import express from "express"
import validateIdMiddleware from "../middleware/validateIdMiddleware.js"
import { createDirectory, deleteDirectory, getDirectoryById, renameDirectory } from "../controllers/directoriesControler.js"

const router = express.Router()

router.param("parentDirId", validateIdMiddleware)

router.param("id", validateIdMiddleware)

router.get('/:id?', getDirectoryById)

router.post("/:parentDirId?", createDirectory)

router.patch("/:id", renameDirectory)

router.delete("/:id", deleteDirectory)

export default router