import { ObjectId } from "mongodb"

export default function (req, res, next, id) {
    if (!ObjectId.isValid(id)) {
        return res.status(404).json({
            error: `Invaid Id ${id}`
        })
    }
    next()
}