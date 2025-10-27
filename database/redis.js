import { createClient } from "redis";
import dotenv from "dotenv";
dotenv.config();

const redisClient = createClient({
    url: `${process.env.REDIS_URL}`,
    username: "default",
    password: 'Q8fJDB3jlSlI87c0BjT2DYW0pOjdV3zu',
});

redisClient.on('connect', () => {
    console.log('Connected to Redis database');
});

redisClient.on('error', (err) => {
    console.error('Redis Client Error', err);
});

(async () => {
    await redisClient.connect();
})();

export default redisClient