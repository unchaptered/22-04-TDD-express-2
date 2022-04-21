import * as HomeController from '../../../../src/home/heom.controller';
import * as HomeService from '../../../../src/home/home.service';

import httpMocks from 'node-mocks-http';

describe('HomeController', () => {

    let funcType;

    beforeAll(() => funcType = 'function');

    describe('Controller List', () => {
        it('notFoundPath must be function', () => expect(typeof HomeController.notFoundPath).toBe(funcType));
    });

    describe('Logic', () => {

        let req;
        let res;
        let next;

        beforeEach(() => {
            req = httpMocks.createRequest();
            res = httpMocks.createResponse();
            next = jest.fn();
        });

        it('notFoundPath', async () => {
            await HomeController.notFoundPath(req, res, next);
            expect(res.statusCode).toBe(404);
            expect(res._getJSONData()).toStrictEqual({
                isSuccess: false,
                message: 'You try to access with empty path',
                result: {}
            });
        })
    });
})