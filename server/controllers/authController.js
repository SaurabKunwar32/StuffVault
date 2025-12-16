import { sendotpService } from "../services/sendOtpService.js"
import OTP from "../models/otpModel.js";
import { verifyIdToken } from "../services/googleAuthService.js";
import User from "../models/userModel.js";
import mongoose, { Types } from "mongoose";
import Directory from "../models/directoryModel.js";
import redisClient from "../config/redis.js";
import { githubCallbackSchema, googleLoginSchema, sendOtpSchema, verifyotpSchema } from "../validators/authSchema.js";
import z from "zod";

const CLIENT_URL = process.env.GITHUB_CLIENT_URL;
const redirect_uri = process.env.GITHUB_REDIRECT_URL;
const clientId = process.env.GITHUB_CLIENTID;
const clientSecret = process.env.GITHUB_CLIENT_SECRET


export const sendotp = async (req, res) => {
    const { success, data, error } = sendOtpSchema.safeParse(req.body)

    if (!success) {
        return res.json({ error: z.flattenError(error).fieldErrors })
    }
    const { email } = data
    const resData = await sendotpService(email)
    res.status(201).json(resData)
}

export const verifyotp = async (req, res, next) => {
    const { success, data } = verifyotpSchema.safeParse(req.body)

    if (!success) {
        return res
            .status(400)
            .json({ error: "Invalid or Expired OTP !!" });
    }
    const { email, otp } = data
    const otpRecord = await OTP.findOne({ email, otp });

    if (!otpRecord) {
        return res.status(400).json({ error: "Invalid or Expired OTP !!" })
    }
    return res.json({ message: "OTP verfied !!" })
}

export const loginWithGoogle = async (req, res, next) => {
    const { success, data } = googleLoginSchema.safeParse(req.body)

    if (!success) {
        return res.json({ error: "Sorry fail to login !!" })
    }

    const { idToken } = data
    const userData = await verifyIdToken(idToken)
    const { name, email, picture } = userData
    const user = await User.findOne({ email }).select("-__v");
    if (user) {

        if (user.isDeleted) {
            return res.status(403).json({ error: "Your account has been deleted for recover please contact to Admin " })
        }

        const allSessions = await redisClient.ft.search('userIdIdx', `@userId:{${user.id}}`, {
            RETURN: []
        })

        // // logic for the max users in the website
        if (allSessions.total >= 2) {
            await redisClient.del(allSessions.documents[0].id)
        }

        if (user.picture.includes('tse3.mm.bing.net')) {
            user.picture = picture;
            await user.save()
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
            maxAge: 1000 * 60 * 60 * 24 * 7,
        });

        return res.json({ message: "User logged in successfully!" });
    }

    const mongooseSession = await mongoose.startSession();

    try {
        const rootdirId = new Types.ObjectId();
        const userId = new Types.ObjectId();

        mongooseSession.startTransaction();

        await Directory.insertOne(
            {
                _id: rootdirId,
                name: `root-${email}`,
                parentDirId: null,
                userId,
            },
            { mongooseSession }
        );

        await User.insertOne(
            {
                _id: userId,
                name,
                email,
                picture,
                rootdirId,
                authProvider: "google"
            },
            { mongooseSession }
        );

        const sessionId = crypto.randomUUID()

        const redisKey = `session:${sessionId}`

        await redisClient.json.set(redisKey, "$", {
            userId,
            rootdirId,
        });
        const sessionExpiryTime = 60 * 60 * 24
        await redisClient.expire(redisKey, sessionExpiryTime)

        res.cookie("sid", sessionId, {
            httpOnly: true,
            signed: true,
            maxAge: 60 * 1000 * 60 * 24 * 7,
        });

        await mongooseSession.commitTransaction();

        return res.status(201).json({ message: "User loggin In !!" });

    } catch (err) {
        await mongooseSession.abortTransaction();
        if (err.code === 121) {
            return res
                .status(400)
                .json({ error: "Invalid input, please enter valid details !!" });
        } else {
            next(err);
        }
    }
}

export const loginWithGithub = async (req, res) => {
    const redirectUrl = `https://github.com/login/oauth/authorize?client_id=${clientId}&redirect_uri=${redirect_uri}/auth/github/callback&scope=user:email`;
    res.redirect(redirectUrl);
};

export const callbackGithub = async (req, res, next) => {
    const { success, data } = githubCallbackSchema.safeParse(req.query)

    if (!success) {
        return res.status(400).json({
            error: "GitHub OAuth failed: Authorization code is missing or invalid. Please try logging in again."
        });
    }

    const { code } = data;
    if (!code) return res.status(400).json({
        error: "GitHub OAuth failed: Authorization code is missing or invalid. Please try logging in again."
    });

    try {
        // Exchange code for access token
        const tokenRes = await fetch("https://github.com/login/oauth/access_token", {
            method: "POST",
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                client_id: clientId,
                client_secret: clientSecret,
                code,
            }),
        });

        const tokenData = await tokenRes.json();
        const accessToken = tokenData.access_token;
        if (!accessToken) throw new Error("No access token returned from GitHub");

        //Fetch GitHub user info
        const userRes = await fetch("https://api.github.com/user", {
            headers: { Authorization: `Bearer ${accessToken}` },
        });
        const githubUser = await userRes.json();

        // Fetch email (GitHub sometimes hides it)
        const emailRes = await fetch("https://api.github.com/user/emails", {
            headers: { Authorization: `Bearer ${accessToken}` },
        });
        const emails = await emailRes.json();

        const primaryEmail = emails.find((e) => e.primary)?.email;
        const email = (primaryEmail || githubUser.email || `${githubUser.id}@github.com`)
            ?.trim()
            .toLowerCase();
        const name = githubUser.name || githubUser.login;
        const picture = githubUser.avatar_url;

        // — Check if user already exists (same email)
        let user = await User.findOne({ email });
        // console.log({user});

        if (user) {
            if (user.isDeleted) {
                return res.status(403).json({
                    error: "Your account has been deleted. Contact admin to recover it.",
                });
            }

            if (!user.picture || user.picture.includes("tse3.mm.bing.net")) {
                user.picture = picture;
                await user.save();
            }

            const allSessions = await redisClient.ft.search('userIdIdx', `@userId:{${user.id}}`, {
                RETURN: []
            })


            // logic for the max users in the website
            if (allSessions.total >= 2) {
                await redisClient.del(allSessions.documents[0].id)
            }

            // const session = await Session.create({ userId: user._id });
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
                maxAge: 1000 * 60 * 60 * 24 * 7, // 7 days
            });

            return res.redirect(`${CLIENT_URL}`);
        }



        // Create a new user (transaction-safe)
        const mongooseSession = await mongoose.startSession();
        mongooseSession.startTransaction();

        try {
            const rootdirId = new Types.ObjectId();
            const userId = new Types.ObjectId();

            await Directory.insertOne(
                {
                    _id: rootdirId,
                    name: `root-${email}`,
                    parentDirId: null,
                    userId,
                },
                { mongooseSession }
            );

            await User.insertOne(
                {
                    _id: userId,
                    name,
                    email,
                    picture,
                    rootdirId,
                    authProvider: "github",
                },
                { mongooseSession }
            );


            const sessionId = crypto.randomUUID()

            const redisKey = `session:${sessionId}`
            await redisClient.json.set(redisKey, "$", {
                userId,
                rootdirId
            });
            const sessionExpiryTime = 60 * 60 * 24
            await redisClient.expire(redisKey, sessionExpiryTime)


            res.cookie("sid", sessionId, {
                httpOnly: true,
                signed: true,
                maxAge: 1000 * 60 * 60 * 24 * 7,
            });

            await mongooseSession.commitTransaction();
            return res.redirect(`${CLIENT_URL}`);
        } catch (err) {
            await mongooseSession.abortTransaction();
            next(err);
        }
    } catch (err) {
        console.error("GitHub callback error:", err);
        next(err);
    }
};

