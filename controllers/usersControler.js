import User from "../model/userModel.js"
import Directory from "../model/directoryModel.js"
import { Types } from "mongoose";
import bcrypt from "bcrypt"
import Session from "../model/sessionModel.js";

export const register = async (req, res, next) => {
    const { username, email, password } = req.body
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
    const { email, password } = req.body

    const user = await User.findOne({ email })

    if (!user) {
        return res.status(404).json({ error: "Invalid Credentials" })
    }

    const isPasswordValid = await bcrypt.compare(password, user.password)

    if (!isPasswordValid) {
        return res.status(404).json({ error: "Invalid Credentials" })
    }

    const allSessions = await Session.find({ userId: user.id })

    if (allSessions.length >= 2) {
        await allSessions[0].deleteOne()
    }

    const session = await Session.create({ userId: user._id })

    res.cookie("sid", session.id, {
        httpOnly: true,
        signed: true,
        maxAge: 60 * 1000 * 60 * 24 * 7
    })

    res.json({
        message: "Logged In"
    })

}

export const getCurrentUser = (req, res) => {
    res.status(200).json({
        name: req.user.username,
        email: req.user.email,
    })
}

export const logout = async (req, res) => {
    const { sid } = req.signedCookies
    await Session.findByIdAndDelete(sid)
    res.clearCookie('sid')
    res.status(204).end()
}

export const logoutAll = async (req, res) => {
    const { sid } = req.signedCookies
    const session = await Session.findById(sid)
    await Session.deleteMany({ userId: session.userId })
    res.clearCookie('sid')
    res.status(204).end()
}