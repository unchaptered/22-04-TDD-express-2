import { createClient } from 'redis';

export let redisConnection;
export let redisRefreshExpired;

export const setRedisRefreshExpired = (EXPIRE) => redisRefreshExpired = EXPIRE;
export const getRedisDB = async (SERVER_MODE, REDIS) => {
    redisConnection = createClient({
        host: REDIS.REDIS_HOST,
        port: REDIS.REDIS_PORT,
        database: REDIS.REDIS_ID
    });

    await redisConnection.connect();
}