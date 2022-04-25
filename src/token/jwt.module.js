import jwt from 'jsonwebtoken';

/**
 * Utility Classes
 */
class JwtModule {

    static SECRET;
    static ALGORITHM;

    static ACCESS_EXPIRED;
    static REFRESH_EXPIRED;
    
    constructor() {
        throw new Error('JwtModule is utiltiy class');
    }

    static encodeAccessToken(data) {
        if (this.SECRET === undefined) return;

        return jwt.sign(data, this.SECRET, {
            algorithm: this.ALGORITHM, expiresIn: this.ACCESS_EXPIRED
        });
    }

    static encodeRefreshToken() {
        if (this.SECRET === undefined) return;

        return jwt.sign({}, this.SECRET, {
            algorithm: this.ALGORITHM, expiresIn: this.REFRESH_EXPIRED
        })
    }

    static verifyToken(token) {
        if (this.SECRET === undefined) return;
        
        try {
            const verifyToken = jwt.verify(token, this.SECRET);
            return {
                isLiveToken: true,
                message: 'authorized',
                verifyToken
            }
        } catch (error) {
            return {
                isLiveToken: false,
                message: 'unauthorized',
                verifyToken: error
            }
        }
    }

    static decodeToken(token) {
        if (this.SECRET === undefined) return;

        try {
            const decodeToken = jwt.decode(token, this.SECRET);
            return {
                isValidToken: true,
                message: 'authorized',
                decodeToken
            }
        } catch(error) {
            return {
                isValidToken: false,
                message: 'unauthorized',
                decodeToken: error
            }
        }
    }

    static setSecert(SECRET) {
        this.SECRET = SECRET;
    }
    static setAlgorithm(ALGORITHM) {
        this.ALGORITHM = ALGORITHM;
    }
    static setAccessExpired(ACCESS_EXPIRED) {
        this.ACCESS_EXPIRED = ACCESS_EXPIRED;
    }
    static setRefreshExpired(REFRESH_EXPIRED) {
        this.REFRESH_EXPIRED = REFRESH_EXPIRED;
    }

}

export default JwtModule;