import { createWriteStream } from "fs"
import { rm } from "fs/promises"
import path from "path"
import Directory from "../model/directoryModel.js"
import File from "../model/fileModel.js"
import User from "../model/userModel.js"
import { createGetSignedUrl, createUploadSignedUrl, deleteS3File, getS3FileMetaData } from "../database/s3.js"
import { error } from "console"
import { fi } from "zod/v4/locales"

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

        const filename = req.headers.filename || 'untitled'
        const filesize = req.headers.filesize

        const user = await User.findById(req.user._id)
        const rootDir = await Directory.findById(req.user.rootDirId)
        const remainingSpace = user.maxStorageInBytes - rootDir.size

        if (filesize > remainingSpace) {
            console.log("File is too Large More then 1GB")
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
        let fileUploadCompleted = false
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
            fileUploadCompleted = true
            await updateDirSize(parentDirId, totalFileSize);
            return res.status(201).json({ message: "File uploaded" })
        })

        req.on("close", async () => {
            if (!fileUploadCompleted) {
                try {
                    await insertedFile.deleteOne();
                    await rm(filepath);
                    console.log("file cleaned");
                } catch (err) {
                    console.error("Error cleaning up aborted upload:", err);
                }
            }
        });

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

        // const filePath = `${process.cwd()}/storage/${id}${fileData.extension}`

        if (req.query.action === "download") {
            const fileUrl = await createGetSignedUrl({
                key: `${id}${fileData.extension}`,
                download: true,
                filename: fileData.name
            })
            return res.redirect(fileUrl)
            // return res.download(filePath, fileData.name)
        }

        // return res.sendFile(filePath, (err) => {
        //     if (!res.headersSent && err) {
        //         return res.json({
        //             error: "file not found"
        //         })
        //     }
        // });

        const fileUrl = await createGetSignedUrl({
            key: `${id}${fileData.extension}`,
            filename: fileData.name
        })

        return res.redirect(fileUrl)

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
        await file.deleteOne()
        await updateDirSize(file.parentDirId, -file.size);
        // await rm(`./storage/${id}${file.extension}`)
         await deleteS3File(`${file.id}${file.extension}`)
        return res.status(200).json({
            error: "File deleted successully"
        })
    } catch (error) {
        next(error)
    }
}

export const uploadInitiate = async (req, res, next) => {
    const parentDirId = req.body.parentDirId || req.user.rootDirId;
    try {
        const parentDirData = await Directory.findOne({ _id: parentDirId, userId: req.user._id })
        if (!parentDirData) {
            return res.status(404).json({
                message: "Parent directory not found!"
            })
        }

        const filename = req.body.name || 'untitled'
        const filesize = req.body.size

        const user = await User.findById(req.user._id)
        const rootDir = await Directory.findById(req.user.rootDirId)
        const remainingSpace = user.maxStorageInBytes - rootDir.size

        if (filesize > remainingSpace) {
            console.log("File is too Large")
            return res.status(507).json({ error: "Not enough storage" })
        }

        const extension = path.extname(filename)

        const insertedFile = await File.insertOne({
            extension,
            name: filename,
            size: filesize,
            parentDirId: parentDirData._id,
            userId: req.user._id,
            isUploading: true
        })

        const uploadSignedUrl = await createUploadSignedUrl({
            key: `${insertedFile.id}${extension}`,
            contentType: req.body.contentType
        })

        res.status(200).json({ uploadSignedUrl, fileId: insertedFile.id })

    } catch (error) {
        next(error)
    }
}


export const uploadComplete = async (req, res, next) => {
    const file = await File.findById(req.body.fileId)
    if (!file) {
        return res.status(404).json({
            error: "File not found in our records"
        })
    }

    try {
        const fileData = await getS3FileMetaData(`${file.id}${file.extension}`)

        if (fileData.ContentLength !== file.size) {
            await file.deleteOne()
            return res.status(400).json({
                error: "File size does not match"
            })
        }
        file.isUploading = false
        await file.save()
        await updateDirSize(file.parentDirId, file.size)
        res.json({ message: "upload complete" })

    } catch (error) {

        await file.deleteOne()
        return res.status(404).json({
            error: "File could not be uploded properly"
        })
    }

}