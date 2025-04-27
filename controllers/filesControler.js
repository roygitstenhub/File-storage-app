import { createWriteStream } from "fs"
import { rm } from "fs/promises"
import path from "path"
import { ObjectId } from "mongodb"
import Directory from "../model/directoryModel.js"
import File from "../model/fileModel.js"

export const upLoadFile = async (req, res) => {
    const parentDirId = req.params.parentDirId || req.user.rootDirId;
    const parentDirData = await Directory.findOne({ _id: parentDirId, userId: req.user._id })

    if (!parentDirData) {
        return res.status(404).json({
            message: "Parent directory not found!"
        })
    }

    const filename = req.headers.filename || 'untitled'
    const extension = path.extname(filename)
    const insertedFile = await File.insertOne({
        extension,
        name: filename,
        parentDirId: parentDirData._id,
        userId: req.user._id
    })

    const fileId = insertedFile.id
    const fullFileName = `${fileId}${extension}`

    const writeStream = createWriteStream(`./storage/${fullFileName}`)
    req.pipe(writeStream)

    req.on("end", async () => {
        return res.status(201).json({ message: "File uploaded" })
    })

    req.on('error', async () => {
        await File.deleteOne({ _id: insertedFile.insertedId })
        res.status(404).json({ message: "Could not upload file" })
    })
}


export const getFile = async (req, res) => {
    try {
        const { id } = req.params
        const fileData = await File.findOne({ _id:id, userId: req.user._id })

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
}

export const renameFile = async (req, res, next) => {
    try {
        const { id } = req.params
        const file = await File.findOne({ _id:id, userId: req.user._id })

        if (!file) {
            return res.status(404).json({ error: "File not found" })
        }

        await File.updateOne({
            _id: id
        }, { $set: { name: req.body.newFilename } })

        return res.status(200).json({ message: "Renamed" });
    } catch (error) {
        error.status = 500
        next(error)
    }
}

export const deleteFile = async (req, res, next) => {
    try {
        const { id } = req.params
        const file = await File.findOne({
            _id: id,
            userId: req.user._id
        }).select("extension")

        if (!file) {
            return res.status(404).json({ error: "File not found" })
        }

        await rm(`./storage/${id}${fileData.extension}`, { recursive: true })

        await file.deleteOne()

        return res.status(200).json({
            message: "File deleted successully"
        })
    } catch (error) {
        next(error)
    }
}