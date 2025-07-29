import express from "express"
import validateIdMiddleware from "../middleware/validateIdMiddleware.js"
import { deleteFile, getFile, renameFile, upLoadFile } from "../controllers/filesControler.js"
// import limiter from "../services/rateLimiter.js"
// import throttle from "../services/throttling.js"
const router = express.Router()


router.param("parentDirId", validateIdMiddleware)
router.param("id", validateIdMiddleware)

//Create
router.post('/:parentDirId?', upLoadFile)

//Read
router.get("/:id", getFile);

//update
router.patch("/:id", renameFile)

//delete
router.delete("/:id",deleteFile)


export default router