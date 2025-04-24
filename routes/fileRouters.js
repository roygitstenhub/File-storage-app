import express from "express"
import { createWriteStream } from "fs"
import { rm, rename, writeFile } from "fs/promises"
import path from "path"
import filesData from "../filesDB.json" with {type: "json"}
import directoriesData from "../directoriesDB.json" with {type: "json"}
import validateIdMiddleware from "../middleware/validateIdMiddleware.js"
import { ObjectId } from "mongodb"

const router = express.Router()

router.param("parentDirId", validateIdMiddleware)
router.param("id", validateIdMiddleware)

//Create
router.post('/:parentDirId?', async (req, res) => {
    const db = req.db
    const dirCollection = db.collection("directories")
    const filesCollection = db.collection("files")
    const parentDirId = req.params.parentDirId || req.user.rootDirId;
    const parentDirData = await dirCollection.findOne({ _id: new ObjectId(parentDirId), userId: req.user._id })

    if (!parentDirData) {
        return res.status(404).json({
            message: "Parent directory not found!"
        })
    }

    const filename = req.headers.filename || 'untitled'
    const extension = path.extname(filename)
    const insertedFile = await filesCollection.insertOne({
        extension,
        name: filename,
        parentDirId: parentDirData._id,
        userId: req.user._id
    })

    const fileId = insertedFile.insertedId.toString()
    const fullFileName = `${fileId}${extension}`

    const writeStream = createWriteStream(`./storage/${fullFileName}`)
    req.pipe(writeStream)

    req.on("end", async () => {
        return res.status(201).json({ message: "File uploaded" })
    })

    req.on('error', async () => {
        await filesCollection.deleteOne({ _id: insertedFile.insertedId })
        res.status(404).json({ message: "Could not upload file" })
    })
})

//Read
router.get("/:id", async (req, res) => {
    try {
        const { id } = req.params
        const db = req.db
        const filesCollection = db.collection("files")
        const fileData = await filesCollection.findOne({ _id: new ObjectId(id), userId: req.user._id })

        if (!fileData) {
            return res.status(404).json({ error: "File not found!" })
        }

        const filePath = `${process.cwd()}/storage/${id}${fileData.extension}`

        if (req.query.action === "download") {
            return res.download(filePath, fileData.name)
        }
        return res.sendFile(filePath, (err) => {
            if (!res.headersSent) {
                return res.json({
                    error: "file not found"
                })
            }
        });
    } catch (error) {
        res.status(404).json(error.message)
    }
});

//update
router.patch("/:id", async (req, res, next) => {
    try {
        const { id } = req.params
        const db = req.db
        const filesCollection = db.collection("files")
        const fileData = await filesCollection.findOne({ _id: new ObjectId(id), userId: req.user._id })

        if (!fileData) {
            return res.status(404).json({ error: "File not found" })
        }

        await filesCollection.updateOne({
            _id: new ObjectId(id)
        }, { $set: { name: req.body.newFilename } })

        return res.status(200).json({ message: "Renamed" });
    } catch (error) {
        error.status = 500
        next(error)
    }
})

//delete
router.delete("/:id", async (req, res, next) => {
    try {
        const { id } = req.params
        const db = req.db
        const filesCollection = db.collection("files")
        const fileData = await filesCollection.findOne({
            _id:new ObjectId(id),
            userId:req.user._id
        })

        if(!fileData){
            return res.status(404).json({error:"File not found"})
        }

        await rm(`./storage/${id}${fileData.extension}`, { recursive: true })

        await filesCollection.deleteOne({_id:fileData._id})

        return res.status(200).json({
            message: "File deleted successully"
        })
    } catch (error) {
        next(error)
    }
})


export default router