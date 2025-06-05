import { createClient } from "redis";

const redisClient = createClient()

redisClient.on("error",(err)=>{
    console.error("Redis client Error ",err)
    process.exit(0)
})

await redisClient.connect()

export default redisClient