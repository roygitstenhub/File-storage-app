import express from "express"
import { rm, writeFile } from "fs/promises"
import directoriesData from "../directoriesDB.json" with {type: "json"}
import filesData from "../filesDB.json" with {type: "json"}
import validateIdMiddleware from "../middleware/validateIdMiddleware.js"
import { ObjectId } from "mongodb"

const router = express.Router()

router.param("parentDirId", validateIdMiddleware)
router.param("id", validateIdMiddleware)

//Read
router.get('/:id?', async (req, res) => {
    const db = req.db
    const dirCollection = db.collection('directories')
    const user = req.user
    const _id = req.params.id ? new ObjectId(req.params.id) : user.rootDirId

    const directoryData = await dirCollection.findOne({ _id })

    if (!directoryData) {
        return res.status(404).json({ error: "Directory not found or you do not have access to it!" })
    }

    const files = await db.collection("files").find({ parentDirId: directoryData._id }).toArray()

    const directories = await dirCollection.find({ parentDirId: _id }).toArray()

    return res.status(200).json({
        ...directoryData,
        files: files.map((dir) => ({ ...dir, id: dir._id })),
        directories: directories.map((dir) => ({ ...dir, id: dir._id }))
    })
})


router.post("/:parentDirId?", async (req, res, next) => {
    try {
        const user = req.user
        const db = req.db
        const dirCollection = db.collection('directories')
        const parentDirId = req.params.parentDirId ? new ObjectId(req.params.parentDirId) : user.rootDirId
        const dirname = req.headers.dirname || 'New Folder'

        const parentDir = await dirCollection.findOne({ _id: new Object(parentDirId) })

        if (!parentDir) {
            return res.status(404).json({ message: "Parent directory does not exist" })
        }

        await dirCollection.insertOne({
            name: dirname,
            parentDirId,
            userId: user._id,
        })

        return res.status(201).json({
            message: "Directory Created"
        })
    } catch (error) {
        next(error)
    }
})


router.patch("/:id", async (req, res) => {
    const user = req.user
    const { id } = req.params
    const { newDirName } = req.body
    const db = req.db
    const dirCollection = await db.collection('directories')
    try {
        await dirCollection.updateOne({ _id: new ObjectId(id), userId: user._id }, { $set: { name: newDirName } })

        res.status(200).json({
            message: "Directory renamed"
        })
    } catch (error) {
        next(error)
    }
})


router.delete("/:id", async (req, res, next) => {
    const { id } = req.params
    const db = req.db

    const filesCollection = db.collection("files")
    const dirCollection = db.collection("directories")

    const parentDirObjId = new ObjectId(id)

    const directoryData = await dirCollection.findOne({ _id: parentDirObjId, userId: req.user._id }, { projection: { _id: 1 } })

    if (!directoryData) {
        return res.status(404).json({ error: "Directory not found" })
    }

    async function getDirContents(id) {
        let files = await filesCollection.find({ parentDirId: id }, { projection: { extension: 1 } }).toArray()

        let directories = await dirCollection.find({ parentDirId: id }, { projection: { _id: 1, } }).toArray()

        for (const { _id, name } of directories) {
            const { files: childFiles, directories: childDir } = await getDirContents(new ObjectId(_id))

            files = [...files, ...childFiles]
            directories = [...directories, ...childDir]
        }

        return { files, directories }
    }

    const { files, directories } = await getDirContents(parentDirObjId)

    await filesCollection.deleteMany({ _id: { $in: files.map(({ _id }) => _id) } })
    await dirCollection.deleteMany({ _id: { $in: [directories.map(({ _id }) => _id), parentDirObjId] } })

    return res.json({ message: "Files deleted successfully" })

})

export default router