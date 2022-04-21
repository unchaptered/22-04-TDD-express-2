import JwtModule from '../../token/jwt.module';
import ResFormFactory from '../../factories/res.form.factory';

export const accessTokenFilter = (req, res, next) => {

    const accessTokenEncrypted = req?.headers?.authorization;
    if (accessTokenEncrypted === undefined)
        return res.status(401).json(ResFormFactory.getUnauthorizedForm());

    const accessToken = accessTokenEncrypted.split('Bearer ')[1];
    const { isValidToken, message, result } = JwtModule.decodeToken(accessToken);
    if (!isValidToken)
        return res.status(401).json(ResFormFactory.getAccessTokenExpiredForm());

    return next();

}