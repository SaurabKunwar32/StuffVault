import redisClient from "../config/redis.js";
import User from "../models/userModel.js";

export default async function checkAuth(req, res, next) {
  const { sid } = req.signedCookies;
  if (!sid) {
    res.clearCookie("sid");
    return res.status(401).json({ message: " 1 Not logged in !!" });
  }

  // console.log({sid});

  // const session = await Session.findById(sid);
  const session = await redisClient.json.get(`session:${sid}`)

  // console.log(session);

  if (!session) {
    res.clearCookie("sid");
    return res.status(401).json({ message: " 2 Not logged in !!" });
  }

  const user = await User.findOne({ _id: session.userId }).lean();
  if (!user) {
    return res.status(401).json({ message: " 3 Not logged in !!" });
  }
  req.user = user;

  // req.user = { _id: session.userId, rootdirId: session.rootdirId }

  next();
}

export const checkNotRegularUser = async (req, res, next) => {
  if (req.user.role !== "User") return next();
  res.status(403).json({ error: "You are not allowed !!" })
}

export const checkIsAdminUser = async (req, res, next) => {
  const { role } = req.user;

  if (role === "Admin" || role === "Owner") {
    return next();
  }
  res.status(403).json({ error: "You are not allowed   !!" })
}

export const checkRoleChangePermission = async (req, res, next) => {
  try {
    const { role: requesterRole } = req.user;
    const { role: newRole, userId: targetUserId } = req.body;

    // Find the target user's current role
    const targetUser = await User.findById(targetUserId);
    if (!targetUser) {
      return res.status(404).json({ error: "Target user not found !" });
    }

    const targetUserRole = targetUser.role;

    // Only Admins or Owners can change roles
    if (requesterRole !== "Admin" && requesterRole !== "Owner") {
      return res.status(403).json({ error: "You are not allowed to change roles!" });
    }

    // Prevent assigning Owner role
    if (newRole === "Owner") {
      return res.status(403).json({ error: "You cannot assign the Owner role!" });
    }

    // Prevent changing an Owner's role
    if (targetUserRole === "Owner") {
      return res.status(403).json({ error: "You cannot change the role of an Owner!" });
    }

    //  Admins cannot modify or assign Admin roles
    if (requesterRole === "Admin" && (targetUserRole === "Admin" || newRole === "Admin")) {
      return res.status(403).json({ error: "Admins cannot change or assign Admin roles!" });
    }

    // Passed all checks
    next();
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
};

export const checkOwnerPermission = async (req, res, next) => {
  try {
    const { role } = req.user;

    if (role === "Owner") {
      return next();
    }

    return res.status(403).json({
      error: "Only the Owner can permanently delete users!",
    });
  } catch (error) {
    console.error("Error in checkOwnerPermission middleware:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

