import JwtModule from '../../token/jwt.module';
import ResFormFactory from '../../factories/res.form.factory';

export const refreshTokenFilter = (req, res, next) => {

    const refreshTokenEncrypted = req?.headers?.refresh;
    if (refreshTokenEncrypted === undefined)
        return res.status(401).json(ResFormFactory.getUnauthorizedForm());

    const refreshToken = refreshTokenEncrypted.split('Bearer ')[1];
    const { isValidToken } = JwtModule.decodeToken(refreshToken);
    if (!isValidToken)
        return res.status(401).json(ResFormFactory.getRefreshTokenExpiredForm());

    return next();

}