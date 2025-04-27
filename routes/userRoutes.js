import express from "express"
import checkAuth from "../middleware/auth.js"
import { getCurrentUser, login, logout, register } from "../controllers/usersControler.js"

const router = express.Router()

router.post('/register',register )

router.post('/login',login )

router.get('/', checkAuth, getCurrentUser)

router.post('/logout',logout )

export default router