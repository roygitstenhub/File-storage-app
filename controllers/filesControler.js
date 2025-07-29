import { createWriteStream } from "fs"
import { rm } from "fs/promises"
import path from "path"
import Directory from "../model/directoryModel.js"
import File from "../model/fileModel.js"
import User from "../model/userModel.js"

export async function updateDirSize(parentId, deltaSize) {
    while (parentId) {
        let dir = await Directory.findById(parentId)
        dir.size += deltaSize
        await dir.save()
        parentId = dir.parentDirId
    }
}

export const upLoadFile = async (req, res, next) => {
    const parentDirId = req.params.parentDirId || req.user.rootDirId;
    try {
        const parentDirData = await Directory.findOne({ _id: parentDirId, userId: req.user._id })
        if (!parentDirData) {
            return res.status(404).json({
                message: "Parent directory not found!"
            })
        }

        const user = await User.findById(req.user._id)

        const filename = req.headers.filename || 'untitled'
        const filesize = req.headers.filesize

        if(filesize > user.maxStorageInBytes){
            console.log("File is too Large More then 1GB")
        }

        if (filesize > 50 * 1024 * 1024) {
            // res.header('Connection', 'close')
            console.log("File too Large")
            return res.destroy()
        }

        const extension = path.extname(filename)

        const insertedFile = await File.insertOne({
            extension,
            name: filename,
            size: filesize,
            parentDirId: parentDirData._id,
            userId: req.user._id
        })

        const fileId = insertedFile.id

        const fullFileName = `${fileId}${extension}`
        const filepath = `./storage/${fullFileName}`

        // const writeStream = createWriteStream(`./storage/${fullFileName}`)
        const writeStream = createWriteStream(filepath)
        // req.pipe(writeStream)

        let totalFileSize = 0
        let aborted = false
        req.on('data', async (chunk) => {
            if (aborted) return;
            totalFileSize += chunk.length
            if (totalFileSize > filesize) {
                aborted = true
                writeStream.close()
                await insertedFile.deleteOne()
                await rm(filepath)
                return req.destroy()
            }
            writeStream.write(chunk)
        })
        // req.pipe(writeStream)

        req.on("end", async () => {
            await updateDirSize(parentDirId, totalFileSize);
            return res.status(201).json({ message: "File uploaded" })
        })

        req.on('error', async () => {
            await File.deleteOne({ _id: insertedFile.insertedId })
            res.status(404).json({ error: "Could not upload file" })
        })
    } catch (error) {
        console.log(error)
        next(error)
    }
}


export const getFile = async (req, res) => {
    try {
        const { id } = req.params
        const fileData = await File.findOne({ _id: id, userId: req.user._id }).lean()

        if (!fileData) {
            return res.status(404).json({ error: "File not found!" })
        }

        const filePath = `${process.cwd()}/storage/${id}${fileData.extension}`

        if (req.query.action === "download") {
            return res.download(filePath, fileData.name)
        }
        return res.sendFile(filePath, (err) => {
            if (!res.headersSent && err) {
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
        const file = await File.findOne({ _id: id, userId: req.user._id })

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

    const { id } = req.params
    const file = await File.findOne({
        _id: id,
        userId: req.user._id
    })

    if (!file) {
        return res.status(404).json({ error: "File not found" })
    }
    try {
        await rm(`./storage/${id}${file.extension}`)
        await file.deleteOne()
        await updateDirSize(file.parentDirId, -file.size);
        return res.status(200).json({
            error: "File deleted successully"
        })
    } catch (error) {
        next(error)
    }
}