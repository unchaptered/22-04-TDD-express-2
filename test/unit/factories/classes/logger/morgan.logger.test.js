import MorganLogger from '../../../../../src/factories/classes/logger/morgan.logger';

describe('MorganLogger', () => {

    let funcType;
    beforeAll(() => {
        funcType = 'function';
    });

    describe('Utility Test', () => {
        it('MorganLogger can\'t be instance', () => {
            try {
                new MorganLogger();
            } catch (error) {
                expect(error).toEqual(new Error('Morgan Logger is uility class'));
            }
        });
    });

    describe('Function List', () => {
        it('getInstance must be defined', () => expect(MorganLogger.getInstance).toBeDefined());
        it('getInstance must be function', () => expect(typeof MorganLogger.getInstance).toBe(funcType));
        it('resetInstance must be defined', () => expect(MorganLogger.resetInstance).toBeDefined());
        it('resetInstance must be function', () => expect(typeof MorganLogger.resetInstance).toBe(funcType));
    });


    describe('Singleton Test', () => {

        it('First, logger must be undefined', () => {
            expect(MorganLogger.logger).toBeUndefined();
        });

        it('Second, logger must be defined after getInstance', () => {
            MorganLogger.getInstance();
            expect(MorganLogger.logger).toBeDefined();
        });

        it('Third, logger must be constant after getInstance(second call)', () => {
            const loggerBefore = MorganLogger.logger;
            MorganLogger.getInstance();
            expect(MorganLogger.logger).toBe(loggerBefore);
        });

        it('Four, logger must be undefined after resetInstance', () => {
            MorganLogger.resetInstance();
            expect(MorganLogger.logger).toBeUndefined();
        });

    });

});