import { createClient } from "redis";
import dotenv from "dotenv";

dotenv.config();

const redisClient = createClient({
  url: process.env.REDIS_URL,
});

redisClient.on("connect", () => {
  console.log("Connected to Redis database");
});

redisClient.on("error", (err) => {
  console.error("Redis Client Error:", err.message);
});

(async () => {
  try {
    await redisClient.connect();
  } catch (err) {
    console.error("Redis connection failed");
  }
})();

export default redisClient;
