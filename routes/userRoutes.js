import express from "express"
import checkAuth from "../middleware/auth.js"
import { getCurrentUser, login, logout, logoutAll, register } from "../controllers/usersControler.js"

const router = express.Router()

//register
router.post('/register',register )

//login
router.post('/login',login )

//profile
router.get('/', checkAuth, getCurrentUser)

//logout
router.post('/logout',logout )

//logout all
router.post('/logout-all',logoutAll)

export default router