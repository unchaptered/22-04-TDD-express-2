import JwtModule from '../../token/jwt.module';
import ResFormFactory from '../../factories/res.form.factory';

/**
 * Access Token Expired Check
 * 
 * 1. 토큰 **미소유** 시 | 401 Unauthorized
 * 2. 토큰 **만료** 시 | 401 Unauthorized
 * 3. 통과 시
 */
export const accessTokenFilter = (req, res, next) => {

    const accessTokenEncrypted = req?.headers?.authorization;
    if (accessTokenEncrypted === undefined)
        return res.status(401).json(
            ResFormFactory.getUnauthorizedForm()
        );

    const accessToken = accessTokenEncrypted.split('Bearer ')[1];
    const { isLiveToken } = JwtModule.verifyToken(accessToken);
    if (!isLiveToken)
        return res.status(401).json(ResFormFactory.getAccessTokenExpiredForm());

    return next();

};