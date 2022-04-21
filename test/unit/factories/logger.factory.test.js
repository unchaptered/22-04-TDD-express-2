import LoggerFactory from "../../../src/factories/logger.factory";

describe('LoggerFactory', () => {
    
    let funcType;
    let SERVER_MODE_PROD;
    let SERVER_MODE_DEV;
    let SERVER_MODE_TEST;

    beforeAll(() => {
        funcType = 'function';
        SERVER_MODE_PROD = 'prod';
        SERVER_MODE_DEV = 'dev';
        SERVER_MODE_TEST = 'test';
    });

    describe('Function List', () => {
        it('getLogger must be "exists"', () => expect(typeof LoggerFactory.getLogger).toBe(funcType));
        it('getMorganLogger must be "exists"', () => expect(typeof LoggerFactory.getMorganLogger).toBe(funcType));
        it('getWinstonLogger must be "exists"', () => expect(typeof LoggerFactory.getWinstonLogger).toBe(funcType));
    });

    describe('Function Return', () => {

        beforeAll(() => {
            LoggerFactory.getMorganLogger = jest.fn();
            LoggerFactory.getWinstonLogger = jest.fn();
            LoggerFactory.getMorganLogger.mockReturnValue('morgan');
            LoggerFactory.getWinstonLogger.mockReturnValue('winston');
        });

        it('getLogger in "prod"', () => {
            const logger = LoggerFactory.getLogger(SERVER_MODE_PROD);
            expect(logger).not.toBeUndefined();
            expect(logger).toBe('winston');
        });
        it('getLogger in "dev"', () => {
            const logger = LoggerFactory.getLogger(SERVER_MODE_DEV);
            expect(logger).not.toBeUndefined();
            expect(logger).toBe('morgan');
        });
        it('getLogger in "test"', () => {
            const logger = LoggerFactory.getLogger(SERVER_MODE_TEST);
            expect(logger).toBeUndefined();
        });
        
    })

});