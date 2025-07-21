import express from "express"
import checkAuth, { checkIsAdminUser, checkNotRegularUser } from "../middleware/auth.js"
import { deleteUser, getAllUsers, getCurrentUser, login, logout, logoutAll, logoutById, register } from "../controllers/usersControler.js"
import limiter from "../services/rateLimiter.js"
import throttle from "../services/throttling.js"

const router = express.Router()

//register
router.post('/user/register', limiter, throttle(2000), register)

//login
router.post('/user/login', limiter, throttle(2000), login)

//profile
router.get('/user', checkAuth, limiter, getCurrentUser)

//logout
router.post('/user/logout', limiter, logout)

//logout all
router.post('/user/logout-all', checkAuth, limiter, logoutAll)

//all usrers
router.get('/users', checkAuth, checkNotRegularUser, limiter, getAllUsers)

router.post("/users/:userId/logout", checkAuth, checkNotRegularUser, limiter, logoutById)

router.delete("/users/:userId", checkAuth, checkIsAdminUser, limiter, deleteUser)

export default router