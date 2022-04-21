export default class InjectFactory {
    static getServerMode = () => process.env.NODE_ENV;
    static getDatabase = () => process.env.DB_ADDRESS;
    static getPort = () => process.env.PORT;
}