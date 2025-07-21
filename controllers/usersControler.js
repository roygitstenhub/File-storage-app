import User from "../model/userModel.js"
import Directory from "../model/directoryModel.js"
import { Types } from "mongoose";
import bcrypt from "bcrypt"
// import Session from "../model/sessionModel.js";
import redisClient from "../database/redis.js";
import { loginSchema, registerSchema } from "../validators/authSchema.js";
import { z } from "zod/v4";

export const register = async (req, res, next) => {
    const { success, data, error } = registerSchema.safeParse(req.body)

    if (!success) {
        return res.status(400).json({
            error: z.flattenError(error).fieldErrors
        })
    }

    const { username, email, password } = data
    const hashedPassword = await bcrypt.hash(password, 12)
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
            username,
            email,
            password: hashedPassword,
            rootDirId
        })
        res.status(201).json({ message: "User Registered" })
    } catch (error) {
        if (error.code === 121) {
            res.status(400).json({ error: "Invalid fields please enter valid input" })
        } else if (error.code === 11000 && error.KeyValue.email) {
            res.status(409).json({
                error: "This user already exists ",
                message: "A user with this email address already exists. Please try to Login"
            })
        } else {
            next(error)
        }
    }

}

export const login = async (req, res, next) => {
    const { success, data, error } = loginSchema.safeParse(req.body)

    if (!success) {
        return res.status(400).json({
            error: "Invalid credentials"
        })
    }

    const { email, password } = data

    const user = await User.findOne({ email })

    if (user.deleted) {
        return res.status(403).json({ error: "Your account has been deleted .Contact App Admin" })
    }

    if (!user) {
        return res.status(404).json({ error: "Invalid Credentials" })
    }

    const isPasswordValid = await bcrypt.compare(password, user.password)

    if (!isPasswordValid) {
        return res.status(404).json({ error: "Invalid Credentials" })
    }

    const allSession = await redisClient.ft.search('userIdIdx', `@userId:{${user._id}}`, {
        RETURN: []
    })
    if (allSession.total >= 2) {
        await redisClient.del(allSession.documents[0].id)
    }

    // const allSessions = await Session.find({ userId: user.id })
    // if (allSessions.length >= 2) {
    //     await allSessions[0].deleteOne()
    // }
    // const session = await Session.create({ userId: user._id })

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
        sameSite: 'lax',
        maxAge: sessionExpiryTime
    })

    res.json({
        message: "Logged In"
    })

}

export const getCurrentUser = async (req, res) => {
    const user = await User.findById(req.user._id).lean()
    res.status(200).json({
        name: user.username,
        email: user.email,
        picture: user.picture,
        role: user.role
    })
}

export const getAllUsers = async (req, res) => {
    // const getallusers = await User.find({ deleted: false }).lean()
    // const allSession = await Session.find().lean()
    // const allSessionUserId = allSession.map(({ userId }) => userId.toString())
    // const allSessionUserIdSet = new Set(allSessionUserId)
    // const transformedUsers = getallusers.map(({ _id, username, email }) => ({ id: _id, username, email, isLoggedIn: allSessionUserIdSet.has(_id.toString()) }))
    const getallusers = await User.find({ deleted: false }).lean();

    let allSession = []
    let cursor = '0'
    do {
        const { cursor: nextCursor, keys } = await redisClient.scan(cursor, {
            MATCH: 'session:*'
        })
        allSession = keys
        cursor = nextCursor

    } while (cursor !== '0')

    const allSessionData = await Promise.all(
        allSession.map((session) => redisClient.json.get(session))
    );

    const allSessionUserIdSet = new Set(
        allSessionData.map((data) => data?.userId?.toString()).filter(Boolean)
    );

    const transformedUsers = getallusers.map(({ _id, username, email }) => ({
        id: _id,
        username,
        email,
        isLoggedIn: allSessionUserIdSet.has(_id.toString())
    }));

    res.status(200).json(transformedUsers);
}

export const logout = async (req, res) => {
    const { sid } = req.signedCookies
    // await Session.findByIdAndDelete(sid)
    await redisClient.del(`session:${sid}`)
    res.clearCookie('sid')
    res.status(204).end()
}

export const logoutAll = async (req, res) => {
    // const session = await Session.findById(sid)
    // await Session.deleteMany({ userId: session.userId })
    const allSession = await redisClient.ft.search('userIdIdx', `@userId:{${req.user._id}}`)
    allSession.documents.map(async (item) => await redisClient.del(`${item.id}`))
    res.clearCookie('sid')
    res.status(204).end()
}

export const logoutById = async (req, res, next) => {
    try {
        // await Session.deleteMany({ userId: req.params.userId })
        const allSession = await redisClient.ft.search('userIdIdx', `@userId:{${req.params.userId}}`)
        allSession.documents.map(async (item) => await redisClient.del(`${item.id}`))
        res.status(204).end()
    } catch (error) {
        next(error)
    }
}

export const deleteUser = async (req, res, next) => {
    const { userId } = req.params
    if (req.user._id.toString() === userId) {
        return res.status(403).json({ error: "You cannot delete yourself" })
    }
    try {
        // await User.findByIdAndDelete(userId)
        // await File.deleteMany({ userId })
        // await Directory.deleteMany({ userId })
        // await Session.deleteMany({ userId: req.params.userId })
        const allSession = await redisClient.ft.search('userIdIdx', `@userId:{${req.params.userId}}`)
        allSession.documents.map(async (item) => await redisClient.del(`${item.id}`))
        await User.findByIdAndUpdate(userId, { deleted: true })
        res.status(204).end()
    } catch (error) {
        next(error)
    }
}