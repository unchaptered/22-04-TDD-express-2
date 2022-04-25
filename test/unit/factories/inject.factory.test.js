import InjectFactory from "../../../src/factories/inject.factory"; 

describe('InjectFacotry', () => {

    let funcType = null;

    beforeAll(() => funcType = 'function');

    describe('Uility Test', () => {
        it('InjectFacotry can\'t be instance', () => {
            try {
                new InjectFactory();
            } catch (error) {
                expect(error).toEqual(new Error('InjectFactory is utility class'));
            }
        });
    });
    describe('Function List', () => {

        describe('Application', () => {
            it('getServiceMode must be function', () => expect(typeof InjectFactory.getServerMode).toBe(funcType));
            it('getPort must be function', () => expect(typeof InjectFactory.getPort).toBe(funcType));
        });

        describe('Databases', () => {
            it('getMongoAddress must be function', () => expect(typeof InjectFactory.getMongoAddress).toBe(funcType));
    
            it('getRedisHost must be function', () => expect(typeof InjectFactory.getRedisHost).toBe(funcType));
            it('getRedisPort must be function', () => expect(typeof InjectFactory.getRedisPort).toBe(funcType));
            it('getRedisId must be function', () => expect(typeof InjectFactory.getRedisId).toBe(funcType));
            it('getRedisPw must be function', () => expect(typeof InjectFactory.getRedisPw).toBe(funcType));
            it('getRedisOptions must be function', () => expect(typeof InjectFactory.getRedisOptions).toBe(funcType));
        });

        describe('Authentication', () => {
            it('getJwtSecret must be function', () => expect(typeof InjectFactory.getJwtSecret).toBe(funcType));
            it('getJwtAlgorithm must be function', () => expect(typeof InjectFactory.getJwtAlgorithm).toBe(funcType));
            it('getJwtAccessExpired must be function', () => expect(typeof InjectFactory.getJwtAccessExpired).toBe(funcType));
            it('getJwtRefreshExpired must be function', () => expect(typeof InjectFactory.getJwtRefreshExpired).toBe(funcType));
        });
    });

    describe('Function Return', () => {

        describe('Application', () => {

            it('\'test\'      [MODE, getServiceMode must return]', () => {
                const SERVER_MODE = InjectFactory.getServerMode();
                expect(SERVER_MODE).not.toBeUndefined();
                expect(SERVER_MODE).toBe('test');
            });
            it('undefined   [PORT, getPort might return]', () => {
                const PORT = InjectFactory.getPort();
                expect(PORT).toBeUndefined();
            });
        });

        describe('Databases', () => {

            it('undefined   [MONGO, getMongoAddress should return]', () => {
                const DB_MONGO = InjectFactory.getMongoAddress();
                expect(DB_MONGO).toBeUndefined();
            });

            it('NaN         [PORT, REDIS, getRedisHost should return]', () => {
                const DB_REDIS_HOST = InjectFactory.getRedisHost();
                expect(DB_REDIS_HOST).toBeUndefined();
            });
            it('undefined   [PORT, REDIS, getRedisPort should return]', () => {
                const DB_REDIS_PORT = InjectFactory.getRedisPort();
                expect(DB_REDIS_PORT).toBeNaN();

            });
            it('NaN         [ID, REDIS, getRedisId should return]', () => {
                const DB_REDIS_ID = InjectFactory.getRedisId();
                expect(DB_REDIS_ID).toBeNaN();

            });
            it('undefined   [PW, REDIS ,getRedisPw should return]', () => {
                const DB_REDIS_PW = InjectFactory.getRedisPw();
                expect(DB_REDIS_PW).toBeUndefined();
            });

            it('object      [OPTIONS, REDIS, getRedisOptions should return]', () => {
                const DB_REDIS_OPTIONS = InjectFactory.getRedisOptions();
                expect(DB_REDIS_OPTIONS).toBeDefined();
                expect(typeof DB_REDIS_OPTIONS).toBe('object');
                expect(DB_REDIS_OPTIONS).toStrictEqual({
                    REDIS_HOST: undefined,
                    REDIS_PORT: NaN,
                    REDIS_ID: NaN,
                    REDIS_PW: undefined
                });
            });
        });

        describe('Authentication', () => {
            it('undefined   [SECRET, getJwtSecret should return]', () => {
                const SECRET = InjectFactory.getJwtSecret();
                expect(SECRET).toBeUndefined();
            });
            it('undefined   [ALGORITHM, getJwtAlgorithm should return]', () => {
                const ALGORITHM = InjectFactory.getJwtAlgorithm();
                expect(ALGORITHM).toBeUndefined();
            });
            it('undefined   [ACCESS_EXPIRED, getJwtAccessExpired should return]', () => {
                const ACCESS_EXPIRED = InjectFactory.getJwtAccessExpired();
                expect(ACCESS_EXPIRED).toBeUndefined();
            });
            it('undefined   [REFRESH_EXPIRED, getJwtRefreshExpired should return]', () => {
                const REFRESH_EXPIRED = InjectFactory.getJwtRefreshExpired();
                expect(REFRESH_EXPIRED).toBeUndefined();
            });
        });

    });


});