import * as authService from '../../../../src/auth/auth.service';

describe('AuthService', () => {

    let funcType;

    beforeAll(() => {
        funcType = 'function';
    });

    describe('Service List', () => {

        it('isUserExists must be function', () => expect(typeof authService.isUserExists).toBe(funcType));
        it('joinUser must be function', () => expect(typeof authService.joinUser).toBe(funcType));
        it('loginUser must be function', () => expect(typeof authService.loginUser).toBe(funcType));
        
    });
    
})