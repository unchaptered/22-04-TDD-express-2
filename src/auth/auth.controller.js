import * as authMongoService from './auth.mongo.service';
import * as authRedisService from './auth.redis.service';

import JwtModule from '../token/jwt.module';
import ResFormFactory from '../factories/res.form.factory';

// GET /auth 로그인
export const login = async (req, res) => {

    try {
        const { email, password } = req.body;
        if (!await authMongoService.isUserExists(email)) {
            const resJson = ResFormFactory.getFailureForm(`The ${email} is not exists`);
            return res.status(404).json(resJson);
        }
      
        const account = await authMongoService.loginUser(email, password);
        if (account === null) {
            const resJson = ResFormFactory.getFailureForm('The password don\'t match');
            return res.status(400).json(resJson);
        }

        const accessToken = JwtModule.encodeAccessToken({ _id:account._id, email: account.email });
        const refreshToken = JwtModule.encodeRefreshToken();
        
        const [ isSuccess, error ] = authRedisService.setRefreshToken(account._id.toString(), refreshToken)
        if (!isSuccess) {
            const resJson = ResFormFactory.getFailureForm({ name: error.name, message: error.message });
            return res.status(500).json(resJson);
        }
        
        const resJson = ResFormFactory.getSuccessForm('The password match', { account, accessToken, refreshToken });
        return res.status(201).json(resJson);
    } catch (error) {
        // const resJson = ResFormFactory.getFailureForm(error);\
        const resJson = ResFormFactory.getFailureForm({ name: error.name, message:error.message });
        return res.status(500).json(resJson);
    }

}

// POST /auth 회원가입
export const join = async (req, res) => {
    
    try {
        const { email, password } = req.body;
        if (await authMongoService.isUserExists(email)) {
            const resJson = ResFormFactory.getFailureForm(`The ${email} is already taken`);
            return res.status(409).json(resJson);
        }
        
        const account = await authMongoService.joinUser(email, password);
        const resJson = ResFormFactory.getSuccessForm(`The ${email} is created`, account);
        return res.status(201).json(resJson);
    } catch (error) {
        // const resJson = ResFormFactory.getFailureForm(error);
        const resJson = ResFormFactory.getFailureForm({ name: error.name, message:error.message });
        return res.status(500).json(resJson);
    }

}

// POST /auth/token 토큰 재발행
export const reGetAccessToken = async (req, res) => {
    
    const { _id, email } = req.body;
    
    const [ isSuccess, redisResult ] = authRedisService.getRefreshToken(_id);
    if (!isSuccess) {
        if (redisResult === null) {
            const resJson = ResFormFactory.getFailureForm({ name: 'Nout Found', message: 'The token is not found in redis'});
            return res.status(404).json(resJson);
        } 
        const resJson = ResFormFactory.getFailureForm({ name: redisResult.name, message: redisResult.message });
        return res.status(500).json(resJson);
    }

    const refreshTokenEncrypted= req.headers.refresh;
    const refreshToken = refreshTokenEncrypted.split('Bearer ')[1];
    if (redisResult !== refreshToken) {
        const resJson = ResFormFactory.getFailureForm('Your token is invalid, please re-login');
        return res.status(401).json(resJson);
    }

    const accessToken = JwtModule.encodeAccessToken({ _id, email });
    const resJson = ResFormFactory.getSuccessForm('Your access token is republish', { accessToken, refreshToken });
        return res.status(201).json(resJson);

}

export const getProfile = () => {
}
export const patchProfile = () => {
}
export const delteProfile = () => {
}