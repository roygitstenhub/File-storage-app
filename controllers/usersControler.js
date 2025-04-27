import User from "../model/userModel.js"
import Directory from "../model/directoryModel.js"
import { Types } from "mongoose";
// import { client } from "../database/db.js"

export const register = async (req, res, next) => {
    const { username, email, password } = req.body
    const foundUser = await User.findOne({ email }).lean()
    if (foundUser) {
        return res.status(409).json({
            error: "user already exists",
            message: "A user with this email already exists "
        })
    }
    //start transation
    // const session = client.startSession()
    // session.startTransaction()
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
            password,
            rootDirId
        })
        //commit transation
        // await session.commitTransaction()
        res.status(201).json({ message: "User Registered" })
    } catch (error) {
        // session.abortTransaction()
        if (error.code === 121) {
            res.status(400).json({ error: "Invalid fields please enter valid input" })
        } else {
            next(error)
        }
    }

}

export const login = async (req, res, next) => {
    const { email, password } = req.body
    const user = await User.findOne({ email, password })
    if (!user) {
        return res.status(404).json({ error: "Invalid Credentials" })
    }
    res.cookie("uid", user._id.toString(), {
        httpOnly: true,
        maxAge: 60 * 1000 * 60 * 24 * 7
    })
    res.json({
        message: "Logged In"
    })

}

export const getCurrentUser =(req, res) => {
    res.status(200).json({
        name: req.user.username,
        email: req.user.email,
    })
}

export const logout =(req, res) => {
    res.clearCookie('uid')
    res.status(204).end()
}