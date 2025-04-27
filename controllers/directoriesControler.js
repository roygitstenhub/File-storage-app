import { rm } from "fs/promises";
import Directory from "../model/directoryModel.js"
import File from "../model/fileModel.js"

export const getDirectoryById = async (req, res) => {
    const user = req.user
    const _id = req.params.id || user.rootDirId.toString()
    const directoryData = await Directory.findOne({ _id }).lean()
    if (!directoryData) {
        return res.status(404).json({ error: "Directory not found or you do not have access to it!" })
    }

    const files = await File.find({ parentDirId: directoryData._id }).lean()

    const directories = await Directory.find({ parentDirId: _id }).lean()

    return res.status(200).json({
        ...directoryData,
        files: files.map((dir) => ({ ...dir, id: dir._id })),
        directories: directories.map((dir) => ({ ...dir, id: dir._id }))
    })
}

export const createDirectory = async (req, res, next) => {
    try {
        const user = req.user
        const parentDirId = req.params.parentDirId || user.rootDirId.toString()
        const dirname = req.headers.dirname || 'New Folder'

        const parentDir = await Directory.findOne({ _id: parentDirId }).lean()

        if (!parentDir) {
            return res.status(404).json({ message: "Parent directory does not exist" })
        }

        await Directory.insertOne({
            name: dirname,
            parentDirId,
            userId: user._id,
        })

        return res.status(201).json({
            message: "Directory Created"
        })
    } catch (err) {
        if (err.code === 121) {
            res.status(400)
                .json({ error: "Invalid input, please enter valid details" });
        } else {
            next(err);
        }
    }
}

export const renameDirectory = async (req, res) => {
    const user = req.user
    const { id } = req.params
    const { newDirName } = req.body
    try {
        await Directory.findOneAndUpdate({ _id: id, userId: user._id }, { name: newDirName })

        res.status(200).json({
            message: "Directory renamed"
        })
    } catch (error) {
        next(error)
    }
}

export const deleteDirectory = async (req, res, next) => {
    const { id } = req.params

    try {
        const directoryData = await Directory.findOne({ _id: id, userId: req.user._id }).select("_id").lean()

        if (!directoryData) {
            return res.status(404).json({ error: "Directory not found" })
        }

        async function getDirContents(id) {
            let files = await File.find({ parentDirId: id }).select("extension").lean()

            let directories = await Directory.find({ parentDirId: id }).select("_id").lean()

            for (const { _id } of directories) {
                const { files: childFiles, directories: childDir } = await getDirContents(_id)

                files = [...files, ...childFiles]
                directories = [...directories, ...childDir]
            }

            return { files, directories }
        }

        const { files, directories } = await getDirContents(id)

        for (const { _id, extension } of files) {
            await rm(`./storage/${_id.toString()}${extension}`);
        }

        await File.deleteMany({ _id: { $in: files.map(({ _id }) => _id) } })

        await Directory.deleteMany({ _id: { $in: [...directories.map(({ _id }) => _id), id] } })
    } catch (error) {
        next(error)
    }

    return res.json({ message: "Files deleted successfully" })

}