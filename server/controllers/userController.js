import User from "../models/userModel.js";
import mongoose, { Types } from "mongoose";
import Directory from "../models/directoryModel.js";
import File from "../models/fileModel.js";
import OTP from "../models/otpModel.js";
import bcrypt from "bcrypt";
import path from 'path'
import fs from "fs";
import redisClient from '../config/redis.js'
import { changePasswordSchema, changeUserRoleSchema, loginSchema, registerSchema, setPasswordSchema, updateNameSchema } from "../validators/authSchema.js";
import z from "zod";
import { sanitizeObject } from "../utils/sanitize.js";

export const register = async (req, res, next) => {
  // console.log(req.body);

  const sanitizedData = sanitizeObject(req.body)

  const { success, data, error } = registerSchema.safeParse(sanitizedData)

  if (!success) {
    // console.log(z.flattenError(error).fieldErrors);
    return res
      .status(400)
      .json({ error: z.flattenError(error).fieldErrors });
  }

  const { name, password, email, otp } = data;
  // console.log(data);

  const checkUserEmail = await User.findOne({ email });

  if (checkUserEmail) {
    return res.status(409).json({
      error: "User already exists with this email"
    });
  }

  const otpRecord = await OTP.findOne({ email, otp });

  if (!otpRecord) {
    return res.status(400).json({ error: "Invalid or Expired OTP !!" });
  }

  await otpRecord.deleteOne();

  const session = await mongoose.startSession();

  try {
    const rootdirId = new Types.ObjectId();
    const userId = new Types.ObjectId();

    session.startTransaction();

    await Directory.insertOne(
      {
        _id: rootdirId,
        name: `root-${email}`,
        parentDirId: null,
        userId,
      },
      { session }
    );

    await User.insertOne(
      {
        _id: userId,
        name,
        email,
        password,
        rootdirId,
      },
      { session }
    );

    await session.commitTransaction();
    return res.status(201).json({ message: "User Registered successfully !!" });
  } catch (err) {
    await session.abortTransaction();
    // console.dir(err.errInfo.details, { depth: null });

    if (err.code === 121) {
      return res
        .status(400)
        .json({ error: "Invalid input, please enter valid details !!" });
    } else if (err.code === 11000) {
      if (err.keyValue.email) {
        return res.status(409).json({
          error: "This email already exist!1",
          message:
            "A user with this email address exist !! Please use another email to login",
        });
      }
    } else {
      next(err);
    }
  }
};

export const login = async (req, res, next) => {

  const sanitizedData = sanitizeObject(req.body)

  const { success, data, error } = loginSchema.safeParse(sanitizedData)

  if (!success) {
    return res
      .status(400)
      .json({ error: "Invalid credentials , Please enter the valid details !!" });
  }
  const { email, password } = data;

  const user = await User.findOne({ email });

  if (!user) {
    return res.status(404).json({ error: "Invalid credentials , Please enter the valid details !!" });
  }

  if (!user.password)
    return res.status(400).json({ error: "No password set for this account" });

  const isPasswordValid = await bcrypt.compare(password, user.password);

  if (!isPasswordValid) {
    return res.status(404).json({ error: "Invalid credentials !!" });
  }

  const allSessions = await redisClient.ft.search('userIdIdx', `@userId:{${user.id}}`, {
    RETURN: []
  })

  // // logic for the max users in the website
  if (allSessions.total >= 2) {
    await redisClient.del(allSessions.documents[0].id)
  }

  const sessionId = crypto.randomUUID()

  const redisKey = `session:${sessionId}`

  await redisClient.json.set(redisKey, "$", {
    userId: user.id,
    rootdirId: user.rootdirId
  });
  const sessionExpiryTime = 60 * 60 * 24
  await redisClient.expire(redisKey, sessionExpiryTime)

  res.cookie("sid", sessionId, {
    httpOnly: true,
    signed: true,
    sameSite: "lax",
    maxAge: 60 * 1000 * 60 * 24 * 7,
  });
  res.json({ message: "User loggin In !!" });
};

export const getCurrentUser = async (req, res) => {
  const user = await User.findById(req.user._id).lean()
  const rootDir = await Directory.findById(user.rootdirId).lean();
  // console.log(rootDir);
  res.status(200).json({
    name: user.name,
    email: user.email,
    picture: user.picture,
    role: user.role,
    authProvider: user.authProvider,
    hasPassword: !!user.password,
    maxStorageInBytes: user.maxStorageInBytes,
    usedStorageInBytes: rootDir.size
  });
};

export const getAllUser = async (req, res) => {
  try {
    const allUsers = await User.find({ isDeleted: false }).lean();

    // Get all Redis session keys
    const keys = await redisClient.keys("session:*");

    const activeUserIds = new Set();

    //  Loop through keys and extract userId
    for (const key of keys) {
      const sessionData = await redisClient.json.get(key);
      if (sessionData && sessionData.userId) {
        activeUserIds.add(sessionData.userId.toString());
      }
    }

    //  Fetch deleted users
    const deletedUsers = await User.find({ isDeleted: true }).lean();

    const transformedUsers = allUsers.map(({ _id, name, email, role }) => ({
      id: _id,
      name,
      email,
      role,
      isLoggedIn: activeUserIds.has(_id.toString())
    }));

    res.status(200).json({
      transformedUsers,
      deletedUsers
    });
  } catch (err) {
    console.error("Error fetching users:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const logout = async (req, res) => {
  const { sid } = req.signedCookies;
  // await Session.findByIdAndDelete(sid);
  // res.clearCookie("sid");
  await redisClient.del(`session:${sid}`)
  res.status(204).end();
};

export const logoutById = async (req, res) => {
  try {
    const { userId } = req.params;

    if (!userId) {
      return res.status(400).json({ error: "Missing userId in params" });
    }

    // Get all Redis session keys
    const keys = await redisClient.keys("session:*");
    // console.log({keys});

    let deletedCount = 0;

    // Loop through each session
    for (const key of keys) {
      const sessionData = await redisClient.json.get(key);
      // console.log(sessionData);

      if (sessionData && sessionData.userId === userId) {
        await redisClient.del(key);
        deletedCount++;
      }
    }

    if (deletedCount > 0) {
      // console.log(`Cleared ${deletedCount} sessions for user ${userId}`);
      res.status(200).json({ message: "User logged out successfully" });
    } else {
      res.status(404).json({ message: "No active session found for this user" });
    }
  } catch (err) {
    console.error("Error deleting user session:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const logoutAll = async (req, res) => {
  try {
    const { sid } = req.signedCookies;

    if (!sid) {
      return res.status(400).json({ error: "Session ID (sid) missing in cookies" });
    }

    //  Get the current session to find userId
    const currentSessionKey = `session:${sid}`;
    const sessionData = await redisClient.json.get(currentSessionKey);

    if (!sessionData || !sessionData.userId) {
      return res.status(404).json({ error: "Session not found or invalid" });
    }

    const userId = sessionData.userId;
    // console.log("Logging out all sessions for user:", userId);

    //  Get all session keys
    const keys = await redisClient.keys("session:*");


    //  Loop and delete all sessions belonging to this user
    for (const key of keys) {
      const data = await redisClient.json.get(key);
      if (data && data.userId === userId) {
        await redisClient.del(key);
      }
    }

    res.clearCookie("sid");

    res.status(200).json({
      message: `Logged out from all sessions successfully !!)`
    });

  } catch (error) {
    console.error("Error logging out from all sessions:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const deleteUser = async (req, res, next) => {
  const { userId } = req.params;

  // Prevent self-deletion
  if (req.user._id.toString() === userId) {
    return res.status(403).json({ error: "You cannot delete yourself" });
  }

  try {
    //  Mark user as deleted in MongoDB
    await User.findByIdAndUpdate(userId, { isDeleted: true });

    //  Delete all Redis sessions for this user
    const keys = await redisClient.keys("session:*");

    for (const key of keys) {
      const sessionData = await redisClient.json.get(key);
      if (sessionData && sessionData.userId === userId) {
        await redisClient.del(key);
      }
    }



    // Respond success
    res.status(200).json({
      message: "User deleted successfully!",
    });

  } catch (err) {
    next(err);
  }
};

export const restoreUser = async (req, res, next) => {
  try {
    const { userId } = req.params;
    const { role } = req.user;

    // Only Owner can restore users
    if (role !== "Owner") {
      return res.status(403).json({ error: "You do not have permission to restore users!" });
    }

    const restoredUser = await User.findByIdAndUpdate(
      userId,
      { isDeleted: false },
      { new: true }
    );

    if (!restoredUser) {
      return res.status(404).json({ error: "User not found!" });
    }

    res.status(200).json({ message: "User restored successfully!" });
  } catch (error) {
    console.error("Error restoring user:", error);
    res.status(500).json({ error: "Server error while restoring user!" });
  }
};

export const changeUsersRoles = async (req, res, next) => {
  const { success, error, data } = changeUserRoleSchema.safeParse(req.body)

  if (!success) {
    return res.status(400).json({ errors: z.flattenError(error).fieldErrors });
  }

  const { role, userId } = data;
  await User.findByIdAndUpdate(userId, { role: role })
  res.json({ message: "Users role changed successfully!!" })
}

export const deleteUserParmanently = async (req, res, next) => {
  const { userId } = req.params;

  if (req.user._id.toString() === userId) {
    return res.status(403).json({ error: "You cannot delete yourself" });
  }

  try {

    const userFiles = await File.find({ userId });
    // const userDirectories = await Directory.find({ userId });

    const storageBasePath = path.join(process.cwd(), "storage");

    for (const file of userFiles) {
      const cleanExt = file.extension.startsWith(".")
        ? file.extension.slice(1)
        : file.extension;

      const fileName = `${file._id.toString()}.${cleanExt}`;
      const filePath = path.join(storageBasePath, fileName);

      if (fs.existsSync(filePath)) {
        fs.rmSync(filePath);
      } else {
        return res.json({ error: "File not found in your Storage" })
      }
    }

    const keys = await redisClient.keys("session:*");

    await File.deleteMany({ userId });
    await Directory.deleteMany({ userId });
    for (const key of keys) {
      const sessionData = await redisClient.json.get(key);
      if (sessionData && sessionData.userId === userId) {
        await redisClient.del(key);
      }
    } await User.findByIdAndDelete(userId);

    res.status(200).json({ message: "User and all related files and folders deleted permanently!" });
  } catch (err) {
    console.error(" Error deleting user:", err);
    next(err);
  }

}

export const updateName = async (req, res) => {
  try {
    const { success, error, data } = updateNameSchema.safeParse(req.body)

    // console.log(data);
    // console.log(z.flattenError(error).fieldErrors);
    if (!success) {
      return res.status(400).json({ errors: z.flattenError(error).fieldErrors });
    }

    // return
    const { newName } = data;
    const userId = req.user._id;

    if (!newName || !newName.trim()) {
      return res.status(400).json({ message: "Name cannot be empty" });
    }

    const user = await User.findById(userId);

    if (!user || user.isDeleted) {
      return res.status(404).json({ message: "Cannot update the user" });
    }

    user.name = newName.trim();
    await user.save();

    return res.status(200).json({
      message: "Name updated successfully",
      name: user.name,
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Error while changing name !!" });
  }
};

export const changePassword = async (req, res) => {
  const { success, error, data } = changePasswordSchema.safeParse(req.body)

  if (!success) {
    return res.status(400).json({ errors: z.flattenError(error).fieldErrors });
  }

  try {
    const userId = req.user._id;
    const { currentPassword, newPassword } = data;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({ message: "Both passwords are required." });
    }

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    if (!user.password)
      return res.status(400).json({ message: "You don't have a password set yet." });

    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch)
      return res.status(400).json({ message: "Incorrect current password." });

    // const hashedPassword = await bcrypt.hash(newPassword, 12);
    user.password = newPassword;
    await user.save();
    console.log(user.password);

    res.status(200).json({ message: "Password updated successfully." });
  } catch (error) {
    console.error("Change password error:", error);
    res.status(500).json({ message: "Error updating password." });
  }
};

export const setPassword = async (req, res) => {
  const { success, error, data } = setPasswordSchema.safeParse(req.body)

  if (!success) {
    return res.status(400).json({ errors: z.flattenError(error).fieldErrors });
  }

  try {
    const userId = req.user._id;
    const { newPassword } = data;


    if (!newPassword || newPassword.length < 4) {
      return res.status(400).json({ message: "Password must be at least 4 characters" });
    }

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (user.password) {
      return res.status(400).json({ message: "Password already set. Use change password instead." });
    }

    user.password = newPassword; // bcrypt hash happens automatically in pre('save')
    await user.save();

    // console.log(user.password);

    res.status(200).json({ message: "Password set successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
}
