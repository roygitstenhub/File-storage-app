import express from "express"
import checkAuth, { checkIsAdminUser, checkNotRegularUser } from "../middleware/auth.js"
import { deleteUser, getAllUsers, getCurrentUser, login, logout, logoutAll, logoutById, register } from "../controllers/usersControler.js"

const router = express.Router()

//register
router.post('/user/register', register)

//login
router.post('/user/login',login)

//profile
router.get('/user', checkAuth, getCurrentUser)

//logout
router.post('/user/logout', logout)

//logout all
router.post('/user/logout-all',checkAuth, logoutAll)

//all usrers
router.get('/users', checkAuth, checkNotRegularUser, getAllUsers)

router.post("/users/:userId/logout", checkAuth,checkNotRegularUser, logoutById)

router.delete("/users/:userId", checkAuth, checkIsAdminUser, deleteUser)

export default router