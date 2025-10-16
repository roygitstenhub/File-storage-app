import express from "express"
import validateIdMiddleware from "../middleware/validateIdMiddleware.js"
import { deleteFile, getFile, renameFile, uploadInitiate, uploadComplete, upLoadFile, searchFileAndFolders } from "../controllers/filesControler.js"
// import limiter from "../services/rateLimiter.js"
// import throttle from "../services/throttling.js"
const router = express.Router()

router.param("parentDirId", validateIdMiddleware)
router.param("id", validateIdMiddleware)

//AWS routes
router.post('/upload/initiate', uploadInitiate)
router.post('/upload/complete', uploadComplete)

//Create
router.post('/:parentDirId?', upLoadFile)

//Read
router.get("/:id", getFile);

//update
router.patch("/:id", renameFile)

//delete
router.delete("/:id", deleteFile)

router.get("/search/:id",searchFileAndFolders)







export default router