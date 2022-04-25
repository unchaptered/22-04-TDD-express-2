import request from 'supertest';

import app from '../../../src/app';

import * as userGenerator from '../../unit/data/junk.user.generator';
import * as dataGenerator from '../../unit/data/junk.data.generator';

/**
 * Integration Test Sinario
 * 
 * 1. 회원가입
 * 2. 로그인
 * 3. 토큰 배라행
 * 4. 계정 받기
 * 5. 계정 수정
 * 6. 계정 삭제
 */
describe('Auth Test', () => {

    let AUTH_URL;
    
    let testId;

    let email;
    let password;

    let accessToken;
    let refreshToken;

    let patchForm;

    beforeAll(() => {
        AUTH_URL = '/auth'
        email = userGenerator.getEmail();
        password = userGenerator.getPassword();

        patchForm = {
            nickname: userGenerator.getNickname(),
            short: dataGenerator.getDescriptionShort(),
            long: dataGenerator.getDescription(),
            email: userGenerator.getEmail(),
            social: userGenerator.getEmail()
        }
    });

    it('Join - POST /auth', async () => {
        const response = await request(app)
                                .post(AUTH_URL)
                                .send({ email, password });

        expect(response.statusCode).toBe(201);
        
        expect(response.body.isSuccess).toBeTruthy();
        expect(response.body.message).toBeDefined();

        expect(response.body.result instanceof Object).toBeTruthy();
        expect(response.body.result._id).toBeDefined();
        expect(response.body.result.email).toBe(email);
        expect(response.body.result.password).toBeDefined();
        expect(response.body.result.password).not.toBe(password);
        expect(response.body.result.meta instanceof Object).toBeTruthy();
        expect(response.body.result.meta.social instanceof Array).toBeTruthy();

        expect(testId).toBeUndefined();
        testId = response.body.result._id;
        expect(testId).toBe(response.body.result._id);
        
    });

    it('Login - POST /auth/token', async () => {
        const response = await request(app)
                            .post(AUTH_URL+'/token')
                            .send({ email, password });

        expect(response.statusCode).toBe(201);

        expect(response.body.isSuccess).toBeTruthy();
        expect(response.body.message).toBe('The password match');

        expect(response.body.result.accessToken).toBeDefined();
        expect(response.body.result.refreshToken).toBeDefined();

        expect(response.body.result.account.email).toBe(email);
        expect(response.body.result.account.password).toBeDefined();
        expect(response.body.result.account.password).not.toBe(password);

        expect(response.body.result.account._id).toBe(testId);

        expect(accessToken).toBeUndefined();
        expect(refreshToken).toBeUndefined();

        accessToken = response.body.result.accessToken;
        refreshToken = response.body.result.refreshToken;

        expect(accessToken).toBe(response.body.result.accessToken);
        expect(refreshToken).toBe(response.body.result.refreshToken);

    });

    it('GetProfile - POST /auth/profile/:_id', async () => {
        const response = await request(app)
            .get(AUTH_URL+'/profile/'+testId)
            .set('authorization', 'Bearer ' + accessToken)
            .send();

        expect(response.statusCode).toBe(201);

        expect(response.body.isSuccess).toBeTruthy();
        expect(response.body.message).toBe('Account Find!');

        expect(response.body.result instanceof Object).toBeTruthy();
        expect(response.body.result.email).toBe(email);
        expect(response.body.result.password).toBeDefined();
        expect(response.body.result.password).not.toBe(password);

        expect(response.body.result.meta instanceof Object).toBeTruthy();
        expect(response.body.result.meta.social instanceof Array).toBeTruthy();

    });

    it('ReGet AccessToken - POST /auth/token/re-issue', async () => {
        const response = await request(app)
            .post(AUTH_URL+'/token/re-issue')
            .set('authorization', 'Bearer ' + accessToken)
            .set('refresh', 'Bearer ' + refreshToken)
            .send({ email, password });

        expect(response.statusCode).toBe(201);

        expect(response.body.isSuccess).toBeTruthy();
        expect(response.body.message).toBe('Your access token is republish');

        expect(response.body.result instanceof Object).toBeTruthy();
        expect(response.body.result.accessToken === accessToken).toBeTruthy();
        expect(response.body.result.refreshToken).toBe(refreshToken);
    });

    it('GetProfile*2 - POST /auth/profile/:_id', async () => {
        const response = await request(app)
            .get(AUTH_URL+'/profile/'+testId)
            .set('authorization', 'Bearer ' + accessToken)
            .send();

        expect(response.statusCode).toBe(201);

        expect(response.body.isSuccess).toBeTruthy();
        expect(response.body.message).toBe('Account Find!');

        expect(response.body.result instanceof Object).toBeTruthy();
        expect(response.body.result.email).toBe(email);
        expect(response.body.result.password).toBeDefined();
        expect(response.body.result.password).not.toBe(password);

        expect(response.body.result.meta instanceof Object).toBeTruthy();
        expect(response.body.result.meta.social instanceof Array).toBeTruthy();

    });


    it('PatchProfile - PATCH /auth/profile/:_id', async () => {
        const response = await request(app)
            .patch(AUTH_URL+'/profile/'+testId)
            .set('authorization', 'Bearer ' + accessToken)
            .send({ ... patchForm });

        expect(response.statusCode).toBe(201);
        expect(response.body).toStrictEqual({
            isSuccess: true,
            message: 'The account is successfully updated',
            result: {}
        });
    });

    it('GetProfile*3 - POST /auth/profile/:_id', async () => {
        const response = await request(app)
            .get(AUTH_URL+'/profile/'+testId)
            .set('authorization', 'Bearer ' + accessToken)
            .send();

        expect(response.statusCode).toBe(201);

        expect(response.body.isSuccess).toBeTruthy();
        expect(response.body.message).toBe('Account Find!');

        expect(response.body.result instanceof Object).toBeTruthy();
        expect(response.body.result.email).toBe(email);
        expect(response.body.result.password).toBeDefined();
        expect(response.body.result.password).not.toBe(password);

        expect(response.body.result.meta instanceof Object).toBeTruthy();
        expect(response.body.result.meta.email).toBe(patchForm.email);

        expect(response.body.result.meta.social instanceof Array).toBeTruthy();
        expect(response.body.result.meta.social.length > 0).toBeTruthy();
        expect(response.body.result.meta.social[0]).toBe(patchForm.social);

        expect(response.body.result.description).toBeDefined();
        expect(response.body.result.description.short).toBe(patchForm.short);
        expect(response.body.result.description.long).toBe(patchForm.long);
        
        expect(response.body.result.nickname).toBe(patchForm.nickname);

    });

    it('DeleteProfile - DELETE /auth/profile/:_id', async () => {
        const response = await request(app)
                            .delete(AUTH_URL+'/profile/'+testId)
                            .set('authorization', 'Bearer ' + accessToken)
                            .send({ email, password });

        expect(response.statusCode).toBe(201);
        expect(response.body).toStrictEqual({
            isSuccess: true,
            message: 'The account is successfully deleted',
            result: {
                result: {
                    acknowledged: true,
                    deletedCount: 1
                },
                resultRedis: 1
            }
        });
    });

    it('GetProfile*4 - POST /auth/profile/:_id', async () => {
        const response = await request(app)
            .get(AUTH_URL+'/profile/'+testId)
            .set('authorization', 'Bearer ' + accessToken)
            .send();

        expect(response.statusCode).toBe(404);

        expect(response.body.isSuccess).toBeFalsy();
        expect(response.body.message).toBeDefined();
        expect(response.body.message).toBe(`The ${testId} is not exists`);
        expect(response.body.result instanceof Object).toBeTruthy();

    });

});

