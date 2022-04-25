import * as authRedisService from '../../../../src/auth/auth.redis.service';

describe('AuthRedisService', () => {

    let funcType;

    beforeAll(() => {
        funcType = 'function';
    });

    describe('Service List', () => {
        it('setRefreshToken must be function', () => expect(typeof authRedisService.setRefreshToken).toBe(funcType));
        it('getRefreshToken must be function', () => expect(typeof authRedisService.getRefreshToken).toBe(funcType));
    });
    
});