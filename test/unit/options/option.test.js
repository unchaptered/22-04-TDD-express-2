import mongoose from "mongoose";

import { getConfig } from "../../../src/options/config.option";
import { getCorsInstance } from "../../../src/options/cors.option";
import { getMongoDB } from "../../../src/options/mongo.option";
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

    describe('Config Option', () => {

        it('Prod Mode', () => {
            const [ configOption, configModule ] = getConfig('prod');
            expect(configOption.path).toBeDefined();
            expect(configOption.path).toBe('.env.prod');
            expect(configModule.parsed.DB_MONGO).toBeDefined();
            expect(configModule.parsed.HOST).toBeDefined();
            expect(configModule.parsed.PORT).toBeDefined();
        });
        it('Dev Mode', () => {
            const [ configOption, configModule ] = getConfig('dev');
            expect(configOption.path).toBeDefined();
            expect(configOption.path).toBe('.env.dev');
            expect(configModule.parsed.DB_MONGO).toBeDefined();
            expect(configModule.parsed.HOST).toBeDefined();
            expect(configModule.parsed.PORT).toBeDefined();
        });
        it('Test Mode', () => {
            const [ configOption, configModule ] = getConfig('test');
            expect(configOption.path).toBeDefined();
            expect(configOption.path).toBe('.env.test');
            expect(configModule.parsed.DB_MONGO).toBeDefined();
            expect(configModule.parsed.HOST).toBeDefined();
            expect(configModule.parsed.PORT).toBeDefined();
        });
    });

    // describe('Mongo Option', () => {

    //     let DB_ADDRESS;
    //     beforeAll(() => {
    //         DB_ADDRESS = 'smple-url';
    //     });
    //     it('Prod Mode', () => {
    //         const mongoConnection = getMongoDB('prod', DB_ADDRESS);
    //         expect(mongoose.connect).toBeCalledWith(DB_ADDRESS);
    //         expect(mongoConnection).toBe(1);
    //     });
    //     it('Dev Mode', () => {
    //         const mongoConnection = getMongoDB('dev', DB_ADDRESS);
    //         expect(mongoose.connect).toBeCalledWith(DB_ADDRESS);
    //     });
    //     it('Test Mode', () => {
    //         const mongoConnection = getMongoDB('test', DB_ADDRESS);
    //         expect(mongoose.connect).toBeCalledWith(DB_ADDRESS);
    //     });
    
    // });
});