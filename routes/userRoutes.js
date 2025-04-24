import express from "express"
import checkAuth from "../middleware/auth.js"
import { ObjectId } from "mongodb"
import { client } from "../database/db.js"

const router = express.Router()

router.post('/register', async (req, res, next) => {
    const { username, email, password } = req.body
    const db = req.db
    const foundUser = await db.collection('users').findOne({ email })
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
        const rootDirId = new ObjectId
        const userId = new ObjectId
        const dirCollection = db.collection('directories')
        await dirCollection.insertOne({
            _id: rootDirId,
            name: `root-${email}`,
            parentDirId: null,
            userId
        })

        await db.collection('users').insertOne({
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

})

router.post('/login', async (req, res, next) => {
    const { email, password } = req.body
    const db = req.db
    const user = await db.collection("users").findOne({ email, password })
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

})

router.get('/', checkAuth, (req, res) => {
    res.status(200).json({
        name: req.user.username,
        email: req.user.email,
    })
})

router.post('/logout', (req, res) => {
    res.clearCookie('uid')
    res.status(204).end()
})

export default router