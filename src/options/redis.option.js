import redis from 'redis';

export default redisConnection;

export const getRedisDB = (DB_ADDRESS) => {

    redisConnection = redis.createClient(DB_ADDRESS);

}