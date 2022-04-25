import httpMocks from 'node-mocks-http';
import JwtModule from "../../../../src/token/jwt.module";
import ResFormFactory from "../../../../src/factories/res.form.factory";

import { ownerTokenFilter } from "../../../../src/middlewares/filters/owner.token.filter";
import ResForm from '../../../../src/factories/classes/response/res.form';

describe('OnwerTokenFilter', () => {

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

    it('Middleware Type', () => expect(typeof ownerTokenFilter).toBe(funcType));

    describe('Filter Logic', () => {

        let _id;

        beforeAll(() => _id = 'testid');
        beforeEach(() => {
            req.params._id = _id
            req.headers.authorization = 'Bearer testtoken';
        });

        it('401 Unauthorized [Request, without Token]', async () => {
            req.headers.authorization = undefined;
            await ownerTokenFilter(req, res, next);
            expect(JwtModule.verifyToken).not.toBeCalled();
            expect(JwtModule.decodeToken).not.toBeCalled();
            expect(next).not.toBeCalled();
            expect(res.statusCode).toBe(401);
            expect(res._getJSONData()).toStrictEqual({
                ...ResFormFactory.getUnauthorizedForm()
            });
        });
        it('401 Unauthorized [Request, with Expired Token]', async () => {
            JwtModule.verifyToken.mockReturnValue({ isLiveToken: false });
            JwtModule.decodeToken.mockReturnValue({ isValidToken: false });
            await ownerTokenFilter(req, res, next);
            expect(JwtModule.verifyToken).toBeCalled();
            expect(JwtModule.decodeToken).not.toBeCalled();
            expect(next).not.toBeCalled();
            expect(res.statusCode).toBe(401);
            expect(res._getJSONData()).toStrictEqual({
                ...ResFormFactory.getAccessTokenExpiredForm()
            })
        });
        it('401 Unauthorized [Request, with Invalid Token]', async () => {
            JwtModule.verifyToken.mockReturnValue({ isLiveToken: true });
            JwtModule.decodeToken.mockReturnValue({ isValidToken: false });
            await ownerTokenFilter(req, res, next);
            expect(JwtModule.verifyToken).toBeCalled();
            expect(JwtModule.decodeToken).toBeCalled();
            expect(next).not.toBeCalled();
            expect(res.statusCode).toBe(401);
            expect(res._getJSONData()).toStrictEqual({
                ...ResFormFactory.getInvalidExpiredForm()
            })
        });
        it('403 Forbidden [Request, with Non-owner Token]', async () => {
            JwtModule.verifyToken.mockReturnValue({ isLiveToken: true });
            JwtModule.decodeToken.mockReturnValue({ isValidToken: true, decodeToken: { _id: _id +'w' } });
            await ownerTokenFilter(req, res, next);
            expect(JwtModule.verifyToken).toBeCalled();
            expect(JwtModule.decodeToken).toBeCalled();
            expect(next).not.toBeCalled();
            expect(res.statusCode).toBe(403);
            expect(res._getJSONData()).toStrictEqual({
                ...ResFormFactory.getUnauthorizedForm()
            })
        });
        it('next [Request, with Valid Token]', async () => {
            JwtModule.verifyToken.mockReturnValue({ isLiveToken: true });
            JwtModule.decodeToken.mockReturnValue({ isValidToken: true, decodeToken: { _id } });
            await ownerTokenFilter(req, res, next);
            expect(JwtModule.verifyToken).toBeCalled();
            expect(JwtModule.decodeToken).toBeCalled();
            expect(next).toBeCalled();
        });
    });
});
