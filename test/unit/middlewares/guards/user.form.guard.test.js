import { userFormGuard } from "../../../../src/middlewares/guards/user.form.guard";
import { getEmail, getPassword, getUserForm } from "../../data/junk.user.generator";

import httpMocks from 'node-mocks-http';

describe('User Form Guard', () => {

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
        await userFormGuard(req, res, next);
        expect(next).not.toBeCalled();
        expect(res._getJSONData()).toStrictEqual({
            isSuccess: false,
            message: [ 'email is necessary', 'password is necessary' ],
            result: {}
        });
    });

    it('Send email only', async () => {
        const email = getEmail();
        req.body = { email };
        await userFormGuard(req, res, next);
        expect(next).not.toBeCalled();
        expect(res._getJSONData()).toStrictEqual({
            isSuccess: false,
            message: [ 'password is necessary' ],
            result: {}
        });
    });

    it('Send password only', async () => {
        const password = getPassword();
        req.body = { password };
        await userFormGuard(req, res, next);
        expect(next).not.toBeCalled();
        expect(res._getJSONData()).toStrictEqual({
            isSuccess: false,
            message: [ 'email is necessary' ],
            result: {}
        });
    });
    
    it('Send email, password', async () => {
        const FORM = getUserForm();
        req.body = FORM;
        await userFormGuard(req, res, next);
        expect(next).toBeCalled();
    });
    
});