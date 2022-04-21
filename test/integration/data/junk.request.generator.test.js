import * as JunkRequestGenerator from './junk.request.generator';

describe('Junk Request Generator', () => {

    describe('List', () => {

        it('BASE_URL must be deinfed', () => expect(JunkRequestGenerator.BASE_URL).toBeDefined());
        it('getAccept must be deinfed', () => expect(JunkRequestGenerator.getAccept).toBeDefined());
        it('getContentType must be deinfed', () => expect(JunkRequestGenerator.getContentType).toBeDefined());

    });
});