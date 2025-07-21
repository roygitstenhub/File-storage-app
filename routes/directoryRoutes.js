import express from "express"
import validateIdMiddleware from "../middleware/validateIdMiddleware.js"
import { createDirectory, deleteDirectory, getDirectoryById, renameDirectory } from "../controllers/directoriesControler.js"
import limiter from "../services/rateLimiter.js"
import throttle from "../services/throttling.js"

const router = express.Router()

router.param("parentDirId", validateIdMiddleware)
router.param("id", validateIdMiddleware)

//Get Dir
router.get('/:id?', limiter, getDirectoryById)

//create Dir
router.post("/:parentDirId?", limiter, throttle(2000), createDirectory)

//Rename Dir
router.patch("/:id", limiter, throttle(2000), renameDirectory)

//Delete Dir
router.delete("/:id", limiter, throttle(2000), deleteDirectory)

export default router