import redisClient from '../database/redis.js';
// import Session from '../model/sessionModel.js';
// import User from '../model/userModel.js';

export default async function checkAuth(req, res, next) {
    const { sid } = req.signedCookies

    if (!sid) {
        res.clearCookie("sid")
        return res.status(401).json({ error: "Not Logged in " });
    }

    // const session = await Session.findById(sid)
    const session = await redisClient.json.get(`session:${sid}`)

    if (!session) {
        res.clearCookie("sid")
        return res.status(401).json({ error: "Not Logged In!" })
    }

    // const user = await User.findOne({ _id: session.userId }).lean()
    // if (!user) {
    //     return res.status(401).json({ error: "Not Logged In!" })
    // }

    req.user = { _id: session.userId, rootDirId: session.rootDirId, role: session.role }
    next()
}

export const checkNotRegularUser = (req, res, next) => {
    if (req.user.role !== "User") {
        return next()
    }
    res.status(403).json({ error: "You can not access users" })
}

export const checkIsAdminUser = (req, res, next) => {
    if (req.user.role === "Admin") {
        return next()
    }
    res.status(403).json({ error: "You can not delete users" })
}

