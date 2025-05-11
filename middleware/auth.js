import Session from '../model/sessionModel.js';
import User from '../model/userModel.js';

export default async function checkAuth(req, res, next) {
    const { sid } = req.signedCookies

    if (!sid) {
        res.clearCookie("sid")
        return res.status(401).json({ error: "Not Logged in " });
    }

    const session = await Session.findById(sid)

    if(!session){
        res.clearCookie("sid")
        return res.status(401).json({ error: "Not Logged In!" })
    }

    const user = await User.findOne({ _id: session.userId }).lean()
    if (!user) {
        return res.status(401).json({ error: "Not Logged In!" })
    }
    req.user = user
    next()
}