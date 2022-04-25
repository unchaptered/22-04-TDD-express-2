import httpMocks from 'node-mocks-http';
import JwtModule from '../../../../src/token/jwt.module';
import ResFormFactory from '../../../../src/factories/res.form.factory';

import { accessTokenFilter } from '../../../../src/middlewares/filters/access.token.filter';

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

        JwtModule.verifyToken = jest.fn();
    });
    it('Middleware Type', () => expect(typeof accessTokenFilter).toBe(funcType));
    
    describe('Filter Logic', () => {

        it('401 unauthorize [Request, without token]', async () => {
            await accessTokenFilter(req, res, next);

            expect(JwtModule.verifyToken).not.toBeCalled();
            expect(next).not.toBeCalled();

            expect(res.statusCode).toBe(401);
            expect(res._getJSONData()).toStrictEqual(
                { ...ResFormFactory.getUnauthorizedForm() }
            );

        });

        it('401 unauthorize [Request, with expired token]', async () => {
            req.headers.authorization = 'Bearer sampletokenstring';
            JwtModule.verifyToken.mockReturnValue({
                isLiveToken: false, message: 'sample', verifyToken: 'sample'
            });
            
            await accessTokenFilter(req, res, next);

            expect(JwtModule.verifyToken).toBeCalled();
            expect(next).not.toBeCalled();
            
            expect(res.statusCode).toBe(401);
            expect(res._getJSONData()).toStrictEqual(
                { ...ResFormFactory.getAccessTokenExpiredForm() }
            );
            
        });

        it('next [Request, with valid token]', async () => {
            req.headers.authorization = 'Bearer sampletokenstring';
            JwtModule.verifyToken.mockReturnValue({
                isLiveToken: true, message: 'sample', verifyToken: 'sample'
            });
            await accessTokenFilter(req, res, next);
            
            expect(JwtModule.verifyToken).toBeCalled();
            expect(next).toBeCalled();

        });
    });
});