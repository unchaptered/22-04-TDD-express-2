import { userPatchGuard } from "../../../../src/middlewares/guards/user.patch.guard";
import { getNickname, getEmail, getShortDescription, getLongDescription } from "../../data/junk.user.generator";

import httpMocks from 'node-mocks-http';

describe('User Patch Gaurd', () => {

    let req;
    let res;
    let next;

    beforeEach(() => {
        req = httpMocks.createRequest();
        res = httpMocks.createResponse();
        next = jest.fn();
    });

    it('Send empty data', async () => {
        req.body = {};
        await userPatchGuard(req, res, next);
        expect(next).not.toBeCalled();
    });

    it('Send nickname', async () => {
        req.body = { nickname: getNickname() };
        await userPatchGuard(req, res,next);
        expect(next).toBeCalled();
    });

    it('Send short', async () => {
        req.body = { short: getShortDescription() };
        await userPatchGuard(req, res,next);
        expect(next).toBeCalled();
    });

    it('Send long', async () => {
        req.body = { long: getLongDescription() };
        await userPatchGuard(req, res,next);
        expect(next).toBeCalled();
    });

    it('Send email', async () => {
        req.body = { email: getEmail() };
        await userPatchGuard(req, res,next);
        expect(next).toBeCalled();
    });

    it('Send social', async () => {
        req.body = { social: getEmail() };
        await userPatchGuard(req, res,next);
        expect(next).toBeCalled();
    });
    
});