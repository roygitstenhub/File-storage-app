import { Types } from "mongoose";
import User from "../model/userModel.js";
import Directory from "../model/directoryModel.js";
// import Session from "../model/sessionModel.js";
import { verifyIdToken } from "../services/googleAuthServices.js";
import redisClient from "../database/redis.js";
import { googleOauthValidator } from "../validators/authSchema.js";

export const loginWithGoogle = async (req, res, next) => {
    const { idToken } = req.body
    const userData = await verifyIdToken(idToken)
    const { success, data } = googleOauthValidator.safeParse(userData)
    if (!success) {
        return res.status(400).json({
            error: "Invalid credentials"
        })
    }
    const { name, email, picture } = data
    const user = await User.findOne({ email }).select("-__v")

    if (user) {

        if (user.deleted) {
            return res.status(403).json({ error: "Your account has been deleted .Contact App Admin" })
        }

        // const allSessions = await Session.find({ userId: user._id })
        // if (allSessions.length >= 2) {
        //     await allSessions[0].deleteOne()
        // }

        const allSession = await redisClient.ft.search('userIdIdx', `@userId:{${user._id}}`, {
            RETURN: []
        })
        if (allSession.total >= 2) {
            await redisClient.del(allSession.documents[0].id)
        }

        if (!user.picture.includes("googleusercontent.com")) {
            user.picture = picture
            await user.save()
        }

        const sessionId = crypto.randomUUID()
        const redisKey = `session:${sessionId}`
        await redisClient.json.set(redisKey, "$", {
            userId: user._id,
            rootDirId: user.rootDirId,
            role: user.role
        })

        const sessionExpiryTime = 60 * 1000 * 60 * 24 * 7
        await redisClient.expire(redisKey, sessionExpiryTime / 1000)
        res.cookie("sid", sessionId, {
            httpOnly: true,
            signed: true,
            sameSite: 'none',
            secure: true,
            maxAge: sessionExpiryTime
        })

        return res.json({ message: "Logged In" })

    }

    try {
        const rootDirId = new Types.ObjectId()
        const userId = new Types.ObjectId()

        await Directory.insertOne({
            _id: rootDirId,
            name: `root-${email}`,
            parentDirId: null,
            userId
        })

        await User.insertOne({
            _id: userId,
            username: name,
            email,
            picture,
            rootDirId
        })

        const sessionId = crypto.randomUUID()
        const redisKey = `session:${sessionId}`
        await redisClient.json.set(redisKey, "$", {
            userId: userId,
            rootDirId: rootDirId,
        })
        const sessionExpiryTime = 60 * 1000 * 60 * 24 * 7
        await redisClient.expire(redisKey, sessionExpiryTime / 1000)
        res.cookie("sid", sessionId, {
            httpOnly: true,
            signed: true,
            sameSite: 'none',
            secure: true,
            maxAge: sessionExpiryTime
        })

        res.status(201).json({ message: "account created and logged in" });

    } catch (error) {
        next(error);
    }
}