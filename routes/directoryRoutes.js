import express from "express"
import validateIdMiddleware from "../middleware/validateIdMiddleware.js"
import { createDirectory, deleteDirectory, getDirectoryById, renameDirectory } from "../controllers/directoriesControler.js"

const router = express.Router()


router.param("parentDirId", validateIdMiddleware)
router.param("id", validateIdMiddleware)

//Get Dir
router.get('/:id?', getDirectoryById)

//create Dir
router.post("/:parentDirId?", createDirectory)

//Rename Dir
router.patch("/:id", renameDirectory)

//Delete Dir
router.delete("/:id", deleteDirectory)

export default router