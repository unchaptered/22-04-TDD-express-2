import * as authMongoService from '../../../../src/auth/auth.mongo.service';

describe('authMongoService', () => {

    let funcType;

    beforeAll(() => {
        funcType = 'function';
    });

    describe('Service List', () => {

        it('isUserExists must be function', () => expect(typeof authMongoService.isUserExists).toBe(funcType));
        it('joinUser must be function', () => expect(typeof authMongoService.joinUser).toBe(funcType));
        it('loginUser must be function', () => expect(typeof authMongoService.loginUser).toBe(funcType));
        
    });
    
})