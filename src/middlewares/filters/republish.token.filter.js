import JwtModule from '../../token/jwt.module';
import ResFormFactory from '../../factories/res.form.factory';

/**
 * Access Token Republish
 * 
 * 1. Acess & Rrfresh **미소유** 시 | 401 Unathorized
 * 2. Refresh Token **만료** 시 | 401 Unathorized
 * 3. Access Token **불량** 시 | 403 Forbidden
 * 4. 통과 시 | req.body._id, req.body.email
 */
export const republishTokenFilter = (req, res, next) => {

    const accessTokenEncrypted = req?.headers?.authorization;
    const refreshTokenEncrypted = req?.headers?.refresh;
    if (accessTokenEncrypted === undefined
            || refreshTokenEncrypted === undefined)
                return res.status(401).json(ResFormFactory.getUnauthorizedForm());

    const refreshToken = refreshTokenEncrypted.split('Bearer ')[1];
    const { isLiveToken } = JwtModule.verifyToken(refreshToken);
    if (!isLiveToken)
        return res.status(401).json(ResFormFactory.getRefreshTokenExpiredForm());

    const accessToken = accessTokenEncrypted.split('Bearer ')[1];
    const {
        isValidToken,
        decodeToken: { _id, email }
    } = JwtModule.decodeToken(accessToken);
    if (!isValidToken)
        return res.status(403).json(ResFormFactory.getInvalidExpiredForm());
    
    req.body._id = _id;
    req.body.email = email;

    return next();

}