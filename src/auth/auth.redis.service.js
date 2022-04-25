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
        console.log(error);
        return error;
    } 

    return null;

}

/**
 * @returns **string / null**
 */
export const getRefreshToken = async (mongoId) => {

    try {
        const result = await redisConnection.get(mongoId);
        return result;
    } catch (error) {
        return error;
    }

}

export const deleteRefreshToken = async (mongoId) => {

    try {
        const result = await redisConnection.del(mongoId);
        return result;
    } catch (error) {
        return error;
    }
    
}