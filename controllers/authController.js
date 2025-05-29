import mongoose, { Types } from "mongoose";
import User from "../model/userModel.js";
import Directory from "../model/directoryModel.js";
import Session from "../model/sessionModel.js";
import { verifyIdToken } from "../services/googleAuthServices.js";

export const loginWithGoogle = async (req, res, next) => {

    const { idToken } = req.body
    const userData = await verifyIdToken(idToken)
    const { name, email, picture, sub } = userData
    const user = await User.findOne({ email }).select("-__v")

    if (user) {
        const allSessions = await Session.find({ userId: user._id })

        if (allSessions.length >= 2) {
            await allSessions[0].deleteOne()
        }

        if (!user.picture.includes("googleusercontent.com")) {
            user.picture = picture
            await user.save()
        }

        const session = await Session.create({ userId: user._id })

        res.cookie("sid", session.id, {
            httpOnly: true,
            signed: true,
            maxAge: 60 * 1000 * 60 * 24 * 7,
        });

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
            username:name,
            email,
            picture,
            rootDirId
        })

        const session = await Session.create({ userId: userId })

        res.cookie("sid", session.id, {
            httpOnly: true,
            signed: true,
            maxAge: 60 * 1000 * 60 * 24 * 7,
        })

        res.status(201).json({ message: "account created and logged in" });

    } catch (error) {
        next(error);
    }
}