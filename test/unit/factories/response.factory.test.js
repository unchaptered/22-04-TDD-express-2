import {
    junkMessageGenerator, 
    junkMessageListGenerator, 
    junkMeesageErrorGenerator, 
    junkProductGenerator, 
    junkProductListGenerator
} from '../data/junk.data.generator';

import ResFormFactory from '../../../src/factories/res.form.factory';

describe('FormFactory', () => {

    let message;
    let result;


    beforeEach(() => {
        message = undefined;
        result = undefined;
    });

    describe('Function List', () => {
        it('getSuccessForm must be defined', () => expect(ResFormFactory.getSuccessForm).toBeDefined());
        it('getSuccessForm must be function', () => expect(typeof ResFormFactory.getSuccessForm).toBe('function'));
        it('getFailureForm must be defined', () => expect(ResFormFactory.getFailureForm).toBeDefined());
        it('getFailureForm must be function', () => expect(typeof ResFormFactory.getFailureForm).toBe('function'));
    });

    describe('Function Return Primitive Type', () => {
        it('getSuccessForm return string', () => {

            message = 'hello';
            result = 'hello';

            const json = ResFormFactory.getSuccessForm(message, result);
            expect(json).toEqual({
                isSuccess:true,
                message,
                result
            })
        });
        it('getFailureForm return string', () => {

            message = 'hello';

            const json = ResFormFactory.getFailureForm(message);
            expect(json).toEqual({
                isSuccess:false,
                message,
                result: {}
            })
        });
    });

    describe('Functon Return References Type', () => {
        it('message is string, result is Object', () => {
            
            message = junkMessageGenerator();
            result = junkProductGenerator();

            const json = ResFormFactory.getSuccessForm(message, result);
            expect(json).toEqual({ isSuccess: true, message, result });

        });
        it('message is string, result is Array<Object>', () => {
            
            message = junkMessageGenerator();
            result = junkProductListGenerator();

            const json = ResFormFactory.getSuccessForm(message, result);
            expect(json).toEqual({ isSuccess: true, message, result });

        });

        it('message is Array<string>, result is Object', () => {

            message = junkMessageListGenerator();
            result = junkProductGenerator();

            const json = ResFormFactory.getSuccessForm(message, result);
            expect(json).toEqual({ isSuccess: true, message, result });

        });
        it('message is Array<string>, result is Array<Object>', () => {

            message = junkMessageListGenerator();
            result = junkProductListGenerator();

            const json = ResFormFactory.getSuccessForm(message, result);
            expect(json).toEqual({ isSuccess: true, message, result });

        });
        
        it('message is Error, result is Object', () => {

            message = junkMeesageErrorGenerator();
            result = junkProductGenerator();

            const json = ResFormFactory.getSuccessForm(message, result);
            expect(json).toEqual({ isSuccess: true, message, result });

        });
        it('message is Error, result is Array<Object>', () => {

            message = junkMeesageErrorGenerator();
            result = junkProductListGenerator();

            const json = ResFormFactory.getSuccessForm(message, result);
            expect(json).toEqual({ isSuccess: true, message, result });
            
        });

    });
});