import WinstonLogger from '../../../../../src/factories/classes/logger/winston.logger';

describe('WinstonLogger', () => {
    
    let funcType;
    beforeAll(() => {
        funcType = 'function';
    });

    describe('Function List', () => {
        it('getInstance must be defined', () => expect(WinstonLogger.getInstance).toBeDefined());
        it('getInstance must be function', () => expect(typeof WinstonLogger.getInstance).toBe(funcType));
    });

    describe('Singleton Test', () => {

        it('First, logger must be undefined', () => {
            expect(WinstonLogger.logger).toBeUndefined();
        });

        it('Second, logger must be defined after getInstance', () => {
            WinstonLogger.getInstance();
            expect(WinstonLogger.logger).toBeDefined();
        });

        it('Third, logger must be constant after getInstance(second call)', () => {
            const loggerBefore = WinstonLogger.logger;
            WinstonLogger.getInstance();
            expect(WinstonLogger.logger).toBe(loggerBefore);
        });

        it('Four, logger must be undefined after resetInstance', () => {
            WinstonLogger.resetInstance();
            expect(WinstonLogger.logger).toBeUndefined();
        });

    });

    describe('Utility Test', () => {
        it('WinstonLogger can\'t be instance', () => {
            try {
                new WinstonLogger();
            } catch (error) {
                expect(error).toEqual(new Error('Winston Logger is uility class'));
            }
        });
    });
});