import { accessTokenFilter } from '../../../../src/middlewares/filters/access.token.filter';

import JwtModule from '../../../../src/token/jwt.module';
import ResFormFactory from '../../../../src/factories/res.form.factory';

import httpMocks from 'node-mocks-http';

describe('AccessTokenFilter', () => {

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
    it('Middleware Type', () => expect(typeof accessTokenFilter).toBe(funcType));
    
    describe('Filter Logic', () => {

        it('401 unauthorize [Request, without token]', async () => {
            await accessTokenFilter(req, res, next);

            expect(JwtModule.decodeToken).not.toBeCalled();
            expect(next).not.toBeCalled();

            expect(res.statusCode).toBe(401);
            expect(res._getJSONData()).toStrictEqual(
                { ...ResFormFactory.getUnauthorizedForm() }
            );

        });

        it('401 unauthorize [Request, with expired token]', async () => {
            req.headers.authorization = 'Bearer sampletokenstring';
            JwtModule.decodeToken.mockReturnValue({
                isValidToken: false, message: 'sample', result: 'sample'
            });
            
            await accessTokenFilter(req, res, next);

            expect(JwtModule.decodeToken).toBeCalled();
            expect(next).not.toBeCalled();
            
            expect(res.statusCode).toBe(401);
            expect(res._getJSONData()).toStrictEqual(
                { ...ResFormFactory.getAccessTokenExpiredForm() }
            );
            
        });

        it('next [Request, with valid token]', async () => {
            req.headers.authorization = 'Bearer sampletokenstring';
            JwtModule.decodeToken.mockReturnValue({
                isValidToken: true, message: 'sample', result: 'sample'
            });
            await accessTokenFilter(req, res, next);
            
            expect(JwtModule.decodeToken).toBeCalled();
            expect(next).toBeCalled();

        });
    });
});