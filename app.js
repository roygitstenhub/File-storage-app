import express from "express"
import cors from "cors"
import dotenv from "dotenv"
dotenv.config()
import cookieParser from "cookie-parser"
import helmet from "helmet"
import rateLimit from "express-rate-limit"
import directoryRoutes from "./routes/directoryRoutes.js"
import fileRoutes from "./routes/fileRoutes.js"
import userRoutes from "./routes/userRoutes.js"
import checkAuth from "./middleware/auth.js"
import authRoutes from "./routes/authRouter.js"
import { connectDb } from "./database/db.js"
import limiter from "./services/rateLimiter.js"
// import throttle from "./services/throttling.js"
import subscriptionRoutes from "./routes/subscriptionRoutes.js"
import webhookRoutes from "./routes/webhookRoutes.js"
import { spawn } from "child_process"
import crypto from "crypto"


const PORT = process.env.PORT || 3000

await connectDb()
const app = express()
app.set("trust proxy",1)
app.use(cookieParser(process.env.SESSION_SECRET))
app.use(express.json())

var whitelist = [process.env.FRONTEND_ORIGIN_1, process.env.FRONTEND_ORIGIN_2]

app.use(cors({
  origin: function (origin, callback) {
    if (whitelist.indexOf(origin) !== -1 || !origin) {
      callback(null, true)
    } else {
      callback(new Error('Not allowed by CORS'))
    }
  },
  credentials: true
}))

app.use(helmet())

app.use(limiter)

app.post("/github-webhook", (req, res) => {
  const givenSignature = req.headers["x-hub-signature-256"]

  if (!givenSignature) {
   return  res.status(403).json({ error: "No Invalid Signature" })
  }

  const calculatedSignature = 'sha256=' + crypto.createHmac("sha256",process.env.GITHUB_SECRET).update(JSON.stringify(req.body)).digest("hex")

  if (givenSignature !== calculatedSignature) {
    return res.status(403).json({ error: "Invalid Signature " })
  }

  res.status(200).json({ message: "OK" });

  const bashChildProcess = spawn("bash", ["/home/ubuntu/deployfrontend.sh"], {
    detached: true,
    stdio: "ignore"
  })

  bashChildProcess.stdout.on("data", (data) => {
    process.stdout.write(data)
  })

  bashChildProcess.stderr.on("data", (data) => {
    process.stdout.write(data)
  })

  bashChildProcess.on("close", (code) => {
    if (code === 0) {
      console.log("script executed successfully")
    } else {
      console.log("script failed")
    }
  })

  bashChildProcess.on("error", (err) => {
    console.log("Error in spawning the  process")
    console.log(err.message)
  })

  bashChildProcess.unref()

})

app.get("/", (req, res) => {
  res.json({ message: "hello from storageapp" })
})

app.get("/", (req, res) => {
  res.json({
    message: "Hello from storageApp"
  })
})

app.use("/directory", checkAuth, directoryRoutes)
app.use("/file", checkAuth, fileRoutes)
app.use("/", userRoutes)
app.use("/auth", authRoutes)
app.use("/subscriptions", checkAuth, subscriptionRoutes)
app.use("/webhooks", webhookRoutes)

app.use((err, req, res, next) => {
  if (res.headersSent) return next(err)
  res.status(err.status || 500).json({
    error: "Something went wrong"
  })
})


app.listen(PORT, () => {
  console.log(`server running at ${PORT}`)
})

