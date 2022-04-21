export default class InjectFactory {

    constructor() {
        throw new Error('InjectFactory is utility class');
    }
    
    // applications

    static getServerMode = () => process.env.NODE_ENV;
    static getPort = () => process.env.PORT;

    // databases

    static getMongoAddress = () => process.env.DB_MONGO;
    static getRedisAddress = () => process.env.DB_REDIS;

    // authentication

    static getJwtSecret = () => process.env.SECRET;
    static getJwtAlgorithm = () => process.env.ALGORITHM;
    static getJwtAccessExpired = () => process.env.ACCESS_EXPIRED;
    static getJwtRefreshExpired = () => process.env.REFRESH_EXPIRED;
    
}