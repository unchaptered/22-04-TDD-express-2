export default class InjectFactory {

    constructor() {
        throw new Error('InjectFactory is utility class');
    }
    
    static getServerMode = () => process.env.NODE_ENV;
    static getDatabase = () => process.env.DB_ADDRESS;
    static getPort = () => process.env.PORT;
}