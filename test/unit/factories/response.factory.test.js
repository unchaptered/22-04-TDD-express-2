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
    let funcType;

    beforeAll(() => funcType = 'function');
    beforeEach(() => {
        message = undefined;
        result = undefined;
    });

    it('Function List', () => {
        expect(typeof ResFormFactory.getSuccessForm).toBe(funcType);
        expect(typeof ResFormFactory.getFailureForm).toBe(funcType);
        expect(typeof ResFormFactory.getUnauthorizedForm).toBe(funcType);
        expect(typeof ResFormFactory.getAccessTokenExpiredForm).toBe(funcType);
        expect(typeof ResFormFactory.getRefreshTokenExpiredForm).toBe(funcType);
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
            });
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

    describe('Authentification Form', () => {
        it('getUnauthorizedForm', () => {
            const resJson = ResFormFactory.getUnauthorizedForm();
            expect(resJson).toEqual({
                isSuccess:false,
                message: 'Your must give two token for us',
                result: {}
            });
        });
        it('getAccessTokenExpiredForm', () => {
            const resJson = ResFormFactory.getAccessTokenExpiredForm();
            expect(resJson).toEqual({
                isSuccess:false,
                message: 'Access Token is expired',
                result: {}
            });
        });
        it('getRefreshTokenExpiredForm', () => {
            const resJson = ResFormFactory.getRefreshTokenExpiredForm();
            expect(resJson).toEqual({
                isSuccess:false,
                message: 'Refresh Token is expired',
                result: {}
            });
        })
    })
});