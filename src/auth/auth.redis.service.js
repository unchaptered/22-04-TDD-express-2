import JwtModule from "../token/jwt.module"
import { redisConnection, redisRefreshExpired } from "../options/redis.option"

/**
 * @returns **[boolean, error / null]**
 */
export const setRefreshToken = async (mongoId, refreshToken) => {

    try {
        await redisConnection.set(mongoId, refreshToken, {
            EX: redisRefreshExpired
        });   
    } catch (error) {
      return [false, error];
    } 

    return [true, null];

}

/**
 * @returns **string / null**
 */
export const getRefreshToken = async (mongoId) => {

    try {
        const result = await redisConnection.get(mongoId);
        if (result !== null) return [true, result];

        return [false, null];
    } catch (error) {
        return [false, error];
    }

}