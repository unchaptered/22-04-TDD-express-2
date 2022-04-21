import SuccessForm from './classes/response/success.form';
import FailureForm from './classes/response/failure.form';

/**
 * 다형성을 이용한 반환 객체 생성
 */
class ResFormFactory {

    static unathorized = 'Your must give two token for us';
    static accessTokenExpired = 'Access Token is expired';
    static refreshTokenExpired = 'Refresh Token is expired';

    static getSuccessForm(message, data) {
        return new SuccessForm(message, data);
    }
    
    static getFailureForm(message) {
        return new FailureForm(message);
    }

    static getUnauthorizedForm() {
        return new FailureForm(this.unathorized);
    }

    static getAccessTokenExpiredForm() {
        return new FailureForm(this.accessTokenExpired);
    }
    static getRefreshTokenExpiredForm() {
        return new FailureForm(this.refreshTokenExpired);
    }
    
    /**
     * @Depreacted
     * @returns  
     */
    static getExpiredAuthorizedForm() {
        return new FailureForm(this.expiredAuthorized);
    }
    
}

export default ResFormFactory;