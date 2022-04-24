import * as authService from './auth.service';

import JwtModule from '../token/jwt.module';
import ResFormFactory from '../factories/res.form.factory';

import { redisConnection, redisRefreshExpired } from '../options/redis.option';

// GET /auth 로그인
export const login = async (req, res) => {

    try {
        const { email, password } = req.body;
        if (!await authService.isUserExists(email)) {
            const resJson = ResFormFactory.getFailureForm(`The ${email} is not exists`);
            return res.status(404).json(resJson);
        }
      
        const account = await authService.loginUser(email, password);
        if (account === null) {
            const resJson = ResFormFactory.getFailureForm('The password don\'t match');
            return res.status(400).json(resJson);
        }
        const accessToken = JwtModule.encodeAccessToken({ _id:account._id, email: account.email });
        const refreshToken = JwtModule.encodeRefreshToken();
        
        await redisConnection.set(account._id.toString(), refreshToken, { EX: redisRefreshExpired });
        
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
        if (await authService.isUserExists(email)) {
            const resJson = ResFormFactory.getFailureForm(`The ${email} is already taken`);
            return res.status(409).json(resJson);
        }
        
        const account = await authService.joinUser(email, password);
        const resJson = ResFormFactory.getSuccessForm(`The ${email} is created`, account);
        return res.status(201).json(resJson);
    } catch (error) {
        // const resJson = ResFormFactory.getFailureForm(error);
        const resJson = ResFormFactory.getFailureForm({ name: error.name, message:error.message });
        return res.status(500).json(resJson);
    }

}

export const reGetAccessToken = async (req, res) => {
    
    try {
        const { _id, email } = req.body;
        const redisToken = await redisConnection.get(_id);

        const refreshTokenEncrypted= req.headers.refresh;
        const refreshToken = refreshTokenEncrypted.split('Bearer ')[1];
        if (redisToken !== refreshToken) {
            const resJson = ResFormFactory.getFailureForm('Your token is invalid, please re-login');
            return res.status(403).json(resJson);
        }

        const accessToken = JwtModule.encodeAccessToken({ _id, email });
        const resJson = ResFormFactory.getSuccessForm('Your access token is republish', { accessToken, refreshToken });
        return res.status(201).json(resJson);   
        
    } catch (error) {
        const resJson = ResFormFactory.getFailureForm({ name: error.name, message:error.message });
        return res.status(500).json(resJson);
    }

}

export const getProfile = () => {
}
export const patchProfile = () => {
}
export const delteProfile = () => {
}