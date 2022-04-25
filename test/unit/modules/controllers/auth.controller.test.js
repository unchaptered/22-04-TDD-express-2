import * as authController from '../../../../src/auth/auth.controller';
import * as authMongoService from '../../../../src/auth/auth.mongo.service';
import * as authRedisService from '../../../../src/auth/auth.redis.service';

import { getUserForm, getId, getEmail } from '../../data/junk.user.generator';

import JwtModule from '../../../../src/token/jwt.module';

import httpMocks from 'node-mocks-http';

describe('AuthController', () => {

    let funcType;

    beforeAll(() => {
        funcType = 'function';
    });

    describe('Controller List', () => {
        
        // BASE_URL/auth
        it('join must be function', () => expect(typeof authController.join).toBe(funcType));
        it('login must be function', () => expect(typeof authController.login).toBe(funcType));

        it('reGetAccessToken must be de function', () => expect(typeof authController.reGetAccessToken).toBe(funcType));

        // BASE_URL/auth/profile
        it('getProfile must be function', ()=> expect(typeof authController.getProfile).toBe(funcType));
        it('patchProfile must be function', ()=> expect(typeof authController.patchProfile).toBe(funcType));
        it('delteProfile must be function', ()=> expect(typeof authController.delteProfile).toBe(funcType));
        
    });

    describe('Logic', () => {

        let req;
        let res;
        let next;

        let errorMessage;
        let promiseReject;
        let redisConnection;

        beforeEach(() => {
            req = httpMocks.createRequest();
            res = httpMocks.createResponse();
            next = jest.fn();

            authMongoService.isUserExists = jest.fn();
            authMongoService.joinUser = jest.fn();
            authMongoService.loginUser = jest.fn();

            JwtModule.encodeAccessToken = jest.fn();
            JwtModule.encodeRefreshToken = jest.fn();

            authRedisService.setRefreshToken = jest.fn();
            authRedisService.getRefreshToken = jest.fn();
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
                authMongoService.isUserExists.mockReturnValue(true);
                await authController.join(req, res, next);
                expect(authMongoService.isUserExists).toBeCalledWith(FORM.email);
                expect(authMongoService.joinUser).not.toBeCalled();
                expect(res.statusCode).toBe(409);
                expect(res._getJSONData()).toStrictEqual({
                    isSuccess: false,
                    message: `The ${FORM.email} is already taken`,
                    result: {}
                });
            });

            it('201 Created', async () => {
                authMongoService.isUserExists.mockReturnValue(false);
                authMongoService.joinUser.mockReturnValue(FORM);
                await authController.join(req, res, next);

                expect(authMongoService.isUserExists).toBeCalledWith(FORM.email);
                expect(authMongoService.joinUser).toBeCalledWith(FORM.email, FORM.password);
                expect(res.statusCode).toBe(201);
                expect(res._getJSONData()).toStrictEqual({
                    isSuccess: true,
                    message: `The ${FORM.email} is created`,
                    result: FORM
                });
            });
            
            it('500 Interval Server Error', async () => {
                authMongoService.isUserExists.mockReturnValue(false);
                authMongoService.joinUser.mockReturnValue(promiseReject);
                await authController.join(req, res, next);

                expect(authMongoService.isUserExists).toBeCalledWith(FORM.email);
                expect(authMongoService.joinUser).toBeCalled();
                expect(res.statusCode).toBe(500);
                expect(res._getJSONData()).toStrictEqual({
                    isSuccess: false,
                    message: {},
                    result: {}
                });

            });

        });

        describe('Login Logic', () => {

            let FORM;
            let FORM_ID;

            let REDIS_ERR;

            let ACCESS_TOKEN;
            let REFRESH_TOKEN;

            beforeAll(() => {
                FORM_ID = getId();
                FORM = getUserForm();

                ACCESS_TOKEN = 'access_token';
                REFRESH_TOKEN = 'refresh_token';
                REDIS_ERR = new Error('Some Problem is occured in redis');
            });

            beforeEach(() => {
                req.body = FORM;

                errorMessage = 'Login Logic : Uncaught Error';
                promiseReject = Promise.reject(errorMessage);
            });

            afterAll(() => {
                errorMessage = undefined;
                promiseReject = undefined;
            });

            it('404 Not Found', async () => {
                authMongoService.isUserExists.mockReturnValue(false);
                authMongoService.loginUser.mockReturnValue(null);
                JwtModule.encodeAccessToken.mockReturnValue(null);
                JwtModule.encodeRefreshToken.mockReturnValue(null);
                authRedisService.setRefreshToken.mockReturnValue([ false, REDIS_ERR ]);

                await authController.login(req, res, next);

                expect(authMongoService.isUserExists).toBeCalledWith(FORM.email);
                expect(authMongoService.loginUser).not.toBeCalled();
                expect(JwtModule.encodeAccessToken).not.toBeCalled();
                expect(JwtModule.encodeRefreshToken).not.toBeCalled();
                expect(authRedisService.setRefreshToken).not.toBeCalled();

                expect(res.statusCode).toBe(404);
                expect(res._getJSONData()).toStrictEqual({
                    isSuccess: false,
                    message: `The ${FORM.email} is not exists`,
                    result: {}
                });
            });

            it('400 Bad Request', async () => {
                authMongoService.isUserExists.mockReturnValue(true);
                authMongoService.loginUser.mockReturnValue(null);
                JwtModule.encodeAccessToken.mockReturnValue(null);
                JwtModule.encodeRefreshToken.mockReturnValue(null);
                authRedisService.setRefreshToken.mockReturnValue([ false, REDIS_ERR ]);

                await authController.login(req, res, next);

                expect(authMongoService.isUserExists).toBeCalledWith(FORM.email);
                expect(authMongoService.loginUser).toBeCalledWith(FORM.email, FORM.password);
                expect(JwtModule.encodeAccessToken).not.toBeCalled();
                expect(JwtModule.encodeRefreshToken).not.toBeCalled();
                expect(authRedisService.setRefreshToken).not.toBeCalled();
                
                expect(res.statusCode).toBe(400);
                expect(res._getJSONData()).toStrictEqual({
                    isSuccess: false,
                    message: 'The password don\'t match',
                    result: {}
                });

            });

            it('500 Interval Server Error, Mongo login', async () => {
                authMongoService.isUserExists.mockReturnValue(true);
                authMongoService.loginUser.mockReturnValue(promiseReject);
                JwtModule.encodeAccessToken.mockReturnValue(null);
                JwtModule.encodeRefreshToken.mockReturnValue(null);
                authRedisService.setRefreshToken.mockReturnValue([ false, REDIS_ERR ]);

                await authController.login(req, res, next);

                expect(authMongoService.isUserExists).toBeCalledWith(FORM.email);
                expect(authMongoService.loginUser).toBeCalledWith(FORM.email, FORM.password);
                expect(JwtModule.encodeAccessToken).not.toBeCalled();
                expect(JwtModule.encodeRefreshToken).not.toBeCalled();
                expect(authRedisService.setRefreshToken).not.toBeCalled();

                expect(res.statusCode).toBe(500);
                expect(res._getJSONData()).toStrictEqual({
                    isSuccess: false,
                    message: {},
                    result: {}
                });
            });

            it('500 Interval Server Error, Redis set', async () => {
                authMongoService.isUserExists.mockReturnValue(true);
                authMongoService.loginUser.mockReturnValue({ _id: FORM_ID, ...FORM });
                JwtModule.encodeAccessToken.mockReturnValue(ACCESS_TOKEN);
                JwtModule.encodeRefreshToken.mockReturnValue(REFRESH_TOKEN);
                authRedisService.setRefreshToken.mockReturnValue([ false, REDIS_ERR ]);

                await authController.login(req, res, next);

                expect(authMongoService.isUserExists).toBeCalledWith(FORM.email);
                expect(authMongoService.loginUser).toBeCalledWith(FORM.email, FORM.password);
                expect(JwtModule.encodeAccessToken).toBeCalledWith({ _id:FORM_ID, email:FORM.email});
                expect(JwtModule.encodeRefreshToken).toBeCalled();
                expect(authRedisService.setRefreshToken).toBeCalledWith(FORM_ID, REFRESH_TOKEN);

                expect(res.statusCode).toBe(500);
                expect(res._getJSONData()).toStrictEqual({
                    isSuccess: false,
                    message: { name: REDIS_ERR.name, message: REDIS_ERR.message},
                    result: {}
                });
                
            });

            it('201 Created', async () => {
                authMongoService.isUserExists.mockReturnValue(true);
                authMongoService.loginUser.mockReturnValue({ _id: FORM_ID, ...FORM });
                JwtModule.encodeAccessToken.mockReturnValue(ACCESS_TOKEN);
                JwtModule.encodeRefreshToken.mockReturnValue(REFRESH_TOKEN);
                authRedisService.setRefreshToken.mockReturnValue([ true, null ]);

                await authController.login(req, res, next);

                expect(authMongoService.isUserExists).toBeCalledWith(FORM.email);
                expect(authMongoService.loginUser).toBeCalledWith(FORM.email, FORM.password);
                expect(JwtModule.encodeAccessToken).toBeCalledWith({ _id:FORM_ID, email:FORM.email});
                expect(JwtModule.encodeRefreshToken).toBeCalled();
                expect(authRedisService.setRefreshToken).toBeCalledWith(FORM_ID, REFRESH_TOKEN);

                expect(res.statusCode).toBe(201);
                expect(res._getJSONData()).toStrictEqual({
                    isSuccess: true,
                    message: 'The password match',
                    result: {
                        account: { _id:FORM_ID, ...FORM },
                        accessToken: ACCESS_TOKEN,
                        refreshToken: REFRESH_TOKEN
                    }
                });
            });

        });

        describe('ReGet AccessToken Logic', () => {

            let FORM_ID;
            let FORM_EMAIL;
            let ACCESS_TOKEN;
            let REFRESH_TOKEN;

            let REDIS_ERR;

            beforeAll(() => {
                FORM_ID = getId();
                FORM_EMAIL = getEmail();
                ACCESS_TOKEN = 'access_token';
                REFRESH_TOKEN = 'refresh_token';

                REDIS_ERR = new Error('Some Problem is occured in redis');
            });

            beforeEach(() => {
                req.body._id = FORM_ID;
                req.body.email = FORM_EMAIL;
                req.headers.refresh = `Bearer ${REFRESH_TOKEN}`;

                errorMessage = 'ReGet AccessToken Logic : Uncaught Error';
                promiseReject = Promise.reject(errorMessage);
            });

            it('404 Not Found, Redis', async () => {
                req.headers.refresh += '_fake';
                authRedisService.getRefreshToken.mockReturnValue([ false, null ]);
                JwtModule.encodeAccessToken.mockReturnValue(null);

                await authController.reGetAccessToken(req, res, next);

                expect(authRedisService.getRefreshToken).toBeCalledWith(FORM_ID);
                expect(res.statusCode).toBe(404);
                expect(res._getJSONData()).toStrictEqual({
                    isSuccess: false,
                    message: { name: 'Nout Found', message: 'The token is not found in redis' },
                    result: {}
                });
            });

            it('500 Interval Server Error, Redis', async () => {
                req.headers.refresh += '_fake';
                authRedisService.getRefreshToken.mockReturnValue([ false, REDIS_ERR ]);
                JwtModule.encodeAccessToken.mockReturnValue(null);

                await authController.reGetAccessToken(req, res, next);

                expect(authRedisService.getRefreshToken).toBeCalledWith(FORM_ID);
                expect(res.statusCode).toBe(500);
                expect(res._getJSONData()).toStrictEqual({
                    isSuccess: false,
                    message: { name: REDIS_ERR.name, message: REDIS_ERR.message },
                    result: {}
                });
            });

            it('401 Unathorized', async () => {
                req.headers.refresh += '_fake';
                authRedisService.getRefreshToken.mockReturnValue([ true, REFRESH_TOKEN ]);
                JwtModule.encodeAccessToken.mockReturnValue(null);

                await authController.reGetAccessToken(req, res, next);

                expect(authRedisService.getRefreshToken).toBeCalledWith(FORM_ID);
                expect(res.statusCode).toBe(401);
                expect(res._getJSONData()).toStrictEqual({
                    isSuccess: false,
                    message: 'Your token is invalid, please re-login',
                    result: {}
                });
            });

            it('201 Created', async () => {
                authRedisService.getRefreshToken.mockReturnValue([ true, REFRESH_TOKEN ]);
                JwtModule.encodeAccessToken.mockReturnValue(ACCESS_TOKEN);

                await authController.reGetAccessToken(req, res, next);

                expect(authRedisService.getRefreshToken).toBeCalledWith(FORM_ID);
                expect(res.statusCode).toBe(201);
                expect(res._getJSONData()).toStrictEqual({
                    isSuccess: true,
                    message: 'Your access token is republish',
                    result: {
                        accessToken: ACCESS_TOKEN,
                        refreshToken: REFRESH_TOKEN
                    }
                });
            });

        });
    });

});