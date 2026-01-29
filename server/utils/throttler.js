import redisClient from '../config/redis.js';
import { getCurrentUser } from '../controllers/userController.js';

function createThrottle(throttleName, waitTime = 1000, delayAfter = 3, ttlSeconds = 300) {
    return async (req, res, next) => {
        try {
            const now = Date.now();

            // Hybrid key: user first, IP fallback
            const keyId = req.user?._id?.toString() || req.ip.replace(/:/g, '_');
            // const key = `hello:${keyId}`;
            const key = `throttle:${throttleName}:${keyId}`;

            const requestDataRaw = await redisClient.get(key);
            // console.log(requestDataRaw);

            let { count, previousDelay, lastRequestTime } = requestDataRaw
                ? JSON.parse(requestDataRaw)
                : {
                    count: 0,
                    previousDelay: 0,
                    lastRequestTime: now - waitTime
                };

            count += 1;
            let delay = 0;

            if (count >= delayAfter) {
                const timDiff = now - lastRequestTime;
                delay = Math.max(0, waitTime + previousDelay - timDiff);
                // console.log(delay);
                // It pauses the execution of the current request handler for delay milliseconds without blocking the server.
                await new Promise((resolve) => setTimeout(resolve, delay));
            }

            await redisClient.set(
                key,
                JSON.stringify({
                    count,
                    previousDelay: delay,
                    lastRequestTime: now,
                }),
                // { EX: 6 * 60 } //6min
                { EX: ttlSeconds }
            );

            next();
        } catch (err) {
            console.error('[RedisThrottle] error:', err);
            next();
        }
    };
}

const mainThrottle = {

    // user
    getCurrentUser: createThrottle('getCurrentUser', 1000, 3, 300),
    getAllUsers: createThrottle('getAllUsers', 1000, 3, 300),

    // files
    getFiles: createThrottle("getFiles", 2500, 3, 300),

    // directory
    getDirectory: createThrottle("getDirectory", 1000, 2, 300),

};

export default mainThrottle

