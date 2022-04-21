import { getConfig } from "../../../src/options/config.option";
import { getCorsInstance } from "../../../src/options/cors.option";
import { getMongoDB } from "../../../src/options/database.option";
import { getHelmet } from "../../../src/options/helmet.option";

describe('Options', () => {

    let funcType;

    beforeAll(() => {
        funcType = 'function';
    });

    describe('Option List', () => {
        
        it('getConfig must be defined', () => expect(getConfig).toBeDefined());
        it('getConfig must be function', () => expect(typeof getConfig).toBe(funcType));

        it('getCorsInstance must be defined', () => expect(getCorsInstance).toBeDefined());
        it('getCorsInstance must be function', () => expect(typeof getCorsInstance).toBe(funcType));

        it('getMongoDB must be defined', () => expect(getMongoDB).toBeDefined());
        it('getMongoDB must be function', () => expect(typeof getMongoDB).toBe(funcType));

        it('getHelmet must be defined', () => expect(getHelmet).toBeDefined());
        it('getHelmet must be function', () => expect(typeof getHelmet).toBe(funcType));

    });
});