import { createClient } from 'redis'

const redisClient = createClient()

redisClient.on('error', (err) => {
    console.log("Redis client error", err);
    process.exit(1)
})

try {
    await redisClient.connect();
    console.log(" Redis Connected !!");
} catch (err) {
    console.error("Initial Redis connection failed:", err.message);
}

export default redisClient;