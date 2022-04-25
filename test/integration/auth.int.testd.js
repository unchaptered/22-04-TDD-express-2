import request from 'supertest';
import app from '../../src/app';

import * as JunkRequestGenerator from './data/junk.request.generator';

describe('Home Test', () => {
    it('GET /:any-string  , Except Using Path', async () => {
        const response = await request(app)
            .get(JunkRequestGenerator.BASE_URL+'/any-string');

        expect(response.statusCode).toBe(404);
        expect(response).toBe('hello');
    });
});

