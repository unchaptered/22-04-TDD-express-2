import { republishTokenFilter } from '../../../../src/middlewares/filters/republish.token.filter';

import JwtModule from '../../../../src/token/jwt.module';
import ResFormFactory from '../../../../src/factories/res.form.factory';

import httpMocks from 'node-mocks-http';

describe('RepublishTokenFilter', () => {

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
        JwtModule.decodeToken = jest.fn();
    });

    it('Middleware Type', () => expect(typeof republishTokenFilter).toBe(funcType));

    describe('Fitler Logic', () => {
        it('401 unauthorized [Request, without token]', async () => {
            await republishTokenFilter(req, res, next);

            expect(JwtModule.verifyToken).not.toBeCalled();
            expect(JwtModule.decodeToken).not.toBeCalled();
            expect(next).not.toBeCalled();

            expect(res.statusCode).toBe(401);
            expect(res._getJSONData()).toStrictEqual({
                ...ResFormFactory.getUnauthorizedForm()
            });
        });

        it('401 unauthorized [Request, with expired token]', async () => {
            req.headers.authorization = 'Bearer sapmleaccesstoken';
            req.headers.refresh = 'Bearer sampletokenstring';
            JwtModule.verifyToken.mockReturnValue({
                isLiveToken: false, message: 'sample', verifyToken: 'sample'
            });
            JwtModule.decodeToken.mockReturnValue({
                isValidToken: false, message: 'smple', decodeToken: 'sample'
            });
            
            await republishTokenFilter(req, res, next);

            expect(JwtModule.verifyToken).toBeCalled();
            expect(JwtModule.decodeToken).not.toBeCalled();
            expect(next).not.toBeCalled();
            
            expect(res.statusCode).toBe(401);
            expect(res._getJSONData()).toStrictEqual({
                ...ResFormFactory.getRefreshTokenExpiredForm()
            });
        });

        it('403 for bidden [Request, with invalid token]', async () => {
            req.headers.authorization = 'Bearer sapmleaccesstoken';
            req.headers.refresh = 'Bearer sampletokenstring';
            JwtModule.verifyToken.mockReturnValue({
                isLiveToken: true, message: 'sample', verifyToken: 'sample'
            });
            JwtModule.decodeToken.mockReturnValue({
                isValidToken: false, message: 'smple', decodeToken: 'sample'
            });

            await republishTokenFilter(req, res, next);
            
            expect(JwtModule.verifyToken).toBeCalled();
            expect(JwtModule.decodeToken).toBeCalled();
            expect(next).not.toBeCalled();

            expect(res.statusCode).toBe(403);
            expect(res._getJSONData()).toStrictEqual({
                ...ResFormFactory.getInvalidExpiredForm()
            });
        });

        it('next [Request, with valid token]', async () => {
            const _id = 'sampleid20220424';
            const email = 'sampleemail@gmail.com';

            req.headers.authorization = 'Bearer sapmleaccesstoken';
            req.headers.refresh = 'Bearer sampletokenstring';
            JwtModule.verifyToken.mockReturnValue({
                isLiveToken: true, message: 'sample', verifyToken: 'sample'
            });
            JwtModule.decodeToken.mockReturnValue({
                isValidToken: true, message: 'smple', decodeToken: { _id, email }
            });

            await republishTokenFilter(req, res, next);
            
            expect(JwtModule.verifyToken).toBeCalled();
            expect(JwtModule.decodeToken).toBeCalled();
            expect(next).toBeCalled();

            expect(req.body._id).toBe(_id);
            expect(req.body.email).toBe(email);

        });

    });

});