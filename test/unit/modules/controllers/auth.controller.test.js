import * as authController from '../../../../src/auth/auth.controller';
import * as authService from '../../../../src/auth/auth.service';

import { getUserForm } from '../../data/junk.user.generator';
import JwtModule from '../../../../src/token/jwt.module';

import httpMocks from 'node-mocks-http';

describe('AuthController', () => {

    let req;
    let res;
    let next;
    let funcType;

    beforeAll(() => {
        funcType = 'function';
    });

    describe('Controller List', () => {
        
        // BASE_URL/auth
        it('join must be function', () => expect(typeof authController.join).toBe(funcType));
        it('login must be function', () => expect(typeof authController.login).toBe(funcType));

        // BASE_URL/auth/profile
        it('getProfile must be function', ()=> expect(typeof authController.getProfile).toBe(funcType));
        it('patchProfile must be function', ()=> expect(typeof authController.patchProfile).toBe(funcType));
        it('delteProfile must be function', ()=> expect(typeof authController.delteProfile).toBe(funcType));
        
    });

    describe('Logic', () => {

        let errorMessage;
        let promiseReject;

        beforeEach(() => {
            req = httpMocks.createRequest();
            res = httpMocks.createResponse();
            next = jest.fn();

            authService.isUserExists = jest.fn();
            authService.joinUser = jest.fn();
            authService.loginUser = jest.fn();

            JwtModule.encodeAccessToken = jest.fn();
            JwtModule.encodeRefreshToken = jest.fn();
        });

        describe('Join Logic', () => {

            let FORM;
            beforeEach(() => {
                FORM = getUserForm();
                req.body = FORM;

                errorMessage = 'Join Logic : Uncaught Error';
                promiseReject = Promise.reject(errorMessage);
            });
            afterAll(() => {
                errorMessage = undefined;
                promiseReject = undefined;
            });

            it('409 Conflict', async () => {
                authService.isUserExists.mockReturnValue(true);
                await authController.join(req, res, next);
                expect(authService.isUserExists).toBeCalledWith(FORM.email);
                expect(authService.joinUser).not.toBeCalled();
                expect(res.statusCode).toBe(409);
                expect(res._getJSONData()).toStrictEqual({
                    isSuccess: false,
                    message: `The ${FORM.email} is already taken`,
                    result: {}
                });
            });

            it('201 Created', async () => {
                authService.isUserExists.mockReturnValue(false);
                authService.joinUser.mockReturnValue(FORM);
                await authController.join(req, res, next);

                expect(authService.isUserExists).toBeCalledWith(FORM.email);
                expect(authService.joinUser).toBeCalledWith(FORM.email, FORM.password);
                expect(res.statusCode).toBe(201);
                expect(res._getJSONData()).toStrictEqual({
                    isSuccess: true,
                    message: `The ${FORM.email} is created`,
                    result: FORM
                });
            });
            
            it('500 Interval Server Error', async () => {
                authService.isUserExists.mockReturnValue(false);
                authService.joinUser.mockReturnValue(promiseReject);
                await authController.join(req, res, next);

                expect(authService.isUserExists).toBeCalledWith(FORM.email);
                expect(authService.joinUser).toBeCalled();
                expect(res.statusCode).toBe(500);
                expect(res._getJSONData()).toStrictEqual({
                    isSuccess: false,
                    message: {},
                    result: {}
                });

            });

        });

        describe('Login Login', () => {

            let FORM;
            beforeEach(() => {
                FORM = getUserForm();
                req.body = FORM;

                errorMessage = 'Login Logic : Uncaught Error';
                promiseReject = Promise.reject(errorMessage);
            });

            afterAll(() => {
                errorMessage = undefined;
                promiseReject = undefined;
            });

            it('404 Not Found', async () => {
                authService.isUserExists.mockReturnValue(false);
                authService.loginUser.mockReturnValue();
                await authController.login(req, res, next);

                expect(authService.isUserExists).toBeCalledWith(FORM.email);
                expect(authService.loginUser).not.toBeCalled();
                expect(res.statusCode).toBe(404);
                expect(res._getJSONData()).toStrictEqual({
                    isSuccess: false,
                    message: `The ${FORM.email} is not exists`,
                    result: {}
                });
            });

            it('400 Bad Request', async () => {
                authService.isUserExists.mockReturnValue(true);
                authService.loginUser.mockReturnValue(null);
                await authController.login(req, res, next);

                expect(authService.isUserExists).toBeCalledWith(FORM.email);
                expect(authService.loginUser).toBeCalledWith(FORM.email, FORM.password);
                expect(res.statusCode).toBe(400);
                expect(res._getJSONData()).toStrictEqual({
                    isSuccess: false,
                    message: 'The password don\'t match',
                    result: {}
                });

            })
            it('201 Created', async () => {
                const sampleToken = 'sample';
                authService.isUserExists.mockReturnValue(true);
                authService.loginUser.mockReturnValue(FORM);
                JwtModule.encodeAccessToken.mockReturnValue(sampleToken);
                JwtModule.encodeRefreshToken.mockReturnValue(sampleToken);
                await authController.login(req, res, next);

                expect(authService.isUserExists).toBeCalledWith(FORM.email);
                expect(authService.loginUser).toBeCalledWith(FORM.email, FORM.password);
                expect(JwtModule.encodeAccessToken).toBeCalledWith({ email: FORM.email});
                expect(JwtModule.encodeRefreshToken).toBeCalled();
                expect(res.statusCode).toBe(201);
                expect(res._getJSONData()).toStrictEqual({
                    isSuccess: true,
                    message: 'The password match',
                    result: {
                        account: FORM,
                        accessToken:sampleToken,
                        refreshToken:sampleToken
                    }
                });
            })
            it('500 Interval Server Error', async () => {
                authService.isUserExists.mockReturnValue(true);
                authService.loginUser.mockReturnValue(promiseReject);
                await authController.login(req, res, next);

                expect(authService.isUserExists).toBeCalledWith(FORM.email);
                expect(authService.loginUser).toBeCalledWith(FORM.email, FORM.password);
                expect(res.statusCode).toBe(500);
                expect(res._getJSONData()).toStrictEqual({
                    isSuccess: false,
                    message: {},
                    result: {}
                });

            });

        });

    });

});