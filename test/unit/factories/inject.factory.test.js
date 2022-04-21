import InjectFactory from "../../../src/factories/inject.factory"; 

describe('InjectFacotry', () => {

    let funcType = null;

    beforeAll(() => funcType = 'function');

    describe('Function List', () => {
        it('getServiceMode must be defined', () => expect(InjectFactory.getServerMode).toBeDefined());
        it('getServiceMode must be function', () => expect(typeof InjectFactory.getServerMode).toBe(funcType));
        it('getDatabase must be defined', () => expect(InjectFactory.getDatabase).toBeDefined());
        it('getDatabase must be function', () => expect(typeof InjectFactory.getDatabase).toBe(funcType));
        it('getPort must be defined', () => expect(InjectFactory.getPort).toBeDefined());
        it('getPort must be function', () => expect(typeof InjectFactory.getPort).toBe(funcType));
    });

    describe('Function Return', () => {
        it('getServiceMode return test', () => {
            const SERVER_MODE = InjectFactory.getServerMode();
            expect(SERVER_MODE).not.toBeUndefined();
            expect(SERVER_MODE).toBe('test');
        });
        it('getDatabase might return undefined', () => {
            const DATABASE = InjectFactory.getDatabase();
            expect(DATABASE).toBeUndefined();
        });
        it('getPort might return undefined', () => {
            const PORT = InjectFactory.getPort();
            expect(PORT).toBeUndefined();
        });
    });

    describe('Uility Test', () => {
        it('InjectFacotry can\'t be instance', () => {
            try {
                new InjectFactory();
            } catch (error) {
                expect(error).toEqual(new Error('InjectFactory is utility class'));
            }
        });
    });

});