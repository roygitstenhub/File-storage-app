import express from "express"
import cors from "cors"
import cookieParser from "cookie-parser"
import directoryRoutes from "./routes/directoryRoutes.js"
import fileRoutes from "./routes/fileRoutes.js"
import userRoutes from "./routes/userRoutes.js"
import checkAuth from "./middleware/auth.js"
import authRoutes from "./routes/authRouter.js"
import { connectDb } from "./database/db.js"

const PORT = 3030 || 3000

const mySecretKey = "RoystenHash-storageApp-123$#";

await connectDb()
const app = express()
app.use(cookieParser(mySecretKey))
app.use(express.json())

app.use(cors({
    origin: "http://localhost:5173",
    credentials: true
}))

app.use("/directory", checkAuth, directoryRoutes)
app.use("/file", checkAuth, fileRoutes)
app.use("/", userRoutes)
app.use("/auth",authRoutes)

app.use((err, req, res, next) => {
    console.log(err)
    res.status(err.status || 500).json({
        error: "Something went wrong"
    })
})

//server creation code 
app.listen(PORT, () => {
    console.log(`server is running at port ${PORT}`)
})

