import { refreshTokenFilter } from '../../../../src/middlewares/filters/refresh.token.filter';

import JwtModule from '../../../../src/token/jwt.module';
import ResFormFactory from '../../../../src/factories/res.form.factory';

import httpMocks from 'node-mocks-http';

describe('RefreshTokenFilter', () => {

    let req;
    let res;
    let next;
    let funcType;

    beforeAll(() => funcType = 'function');
    beforeEach(() => {
        req = httpMocks.createRequest();
        res = httpMocks.createResponse();
        next = jest.fn();

        JwtModule.decodeToken = jest.fn();
    });

    it('Middleware Type', () => expect(typeof refreshTokenFilter).toBe(funcType));

    describe('Fitler Logic', () => {
        it('401 unauthorize [Request, without token]', async () => {
            await refreshTokenFilter(req, res, next);

            expect(JwtModule.decodeToken).not.toBeCalled();
            expect(next).not.toBeCalled();

            expect(res.statusCode).toBe(401);
            expect(res._getJSONData()).toStrictEqual(
                { ...ResFormFactory.getUnauthorizedForm() }
            );

        });

        it('401 unauthorize [Request, with expired token]', async () => {
            req.headers.refresh = 'Bearer sampletokenstring';
            JwtModule.decodeToken.mockReturnValue({
                isValidToken: false, message: 'sample', result: 'sample'
            });
            
            await refreshTokenFilter(req, res, next);

            expect(JwtModule.decodeToken).toBeCalled();
            expect(next).not.toBeCalled();
            
            expect(res.statusCode).toBe(401);
            expect(res._getJSONData()).toStrictEqual(
                { ...ResFormFactory.getRefreshTokenExpiredForm() }
            );
            
        });

        it('next [Request, with valid token]', async () => {
            req.headers.refresh = 'Bearer sampletokenstring';
            JwtModule.decodeToken.mockReturnValue({
                isValidToken: true, message: 'sample', result: 'sample'
            });
            await refreshTokenFilter(req, res, next);
            
            expect(JwtModule.decodeToken).toBeCalled();
            expect(next).toBeCalled();

        });
    });

});