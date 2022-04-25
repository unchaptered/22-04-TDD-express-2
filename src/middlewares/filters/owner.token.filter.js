import JwtModule from "../../token/jwt.module"
import ResFormFactory from "../../factories/res.form.factory"

/**
 * **Is same** Profile Owner and Access Token Owner?
 * 
 * 1. 토큰 **미소유** 시 | 401 Unathorized
 * 2. 토큰 **만료** 시 | 401 Unathorized
 * 3. 토큰 **불량** 시 | 401 Unathorized
 * 4. 아이디 **불일치** 시 | 403 Forbidden
 * 5. 통과 시
 */
export const ownerTokenFilter = async (req, res, next) => {

    const accessTokenEncrypted = req?.headers?.authorization;
    if (accessTokenEncrypted === undefined)
        return res.status(401).json(ResFormFactory.getUnauthorizedForm());
    
    const accessToken = accessTokenEncrypted.split('Bearer ')[1];
    const { isLiveToken } = JwtModule.verifyToken(accessToken);
    if (!isLiveToken)
        return res.status(401).json(ResFormFactory.getAccessTokenExpiredForm());

    const { isValidToken, decodeToken } = JwtModule.decodeToken(accessToken);
    if (!isValidToken)
        return res.status(401).json(ResFormFactory.getInvalidExpiredForm());

    if (req?.params?._id !== decodeToken._id)
        return res.status(403).json(ResFormFactory.getUnauthorizedForm());

    next();

};