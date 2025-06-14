import { createClient } from "redis";

const redisClient = createClient({
    url: process.env.RADIS_URI
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