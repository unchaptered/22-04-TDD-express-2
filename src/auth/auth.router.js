import { Router } from "express";

import { userFormGuard } from "../middlewares/guards/user.form.guard";
import { userPatchGuard } from "../middlewares/guards/user.patch.guard";

// import { accessTokenFilter } from "../middlewares/filters/access.token.filter";
import { ownerTokenFilter } from "../middlewares/filters/owner.token.filter";
import { republishTokenFilter } from "../middlewares/filters/republish.token.filter";

import { login, join, getProfile, patchProfile, delteProfile, reGetAccessToken } from './auth.controller';

const authRouter = Router();

authRouter
    .route('/')
    .get(userFormGuard, login)
    .post(userFormGuard, join);
    
authRouter
    .route('/token')
    .get(republishTokenFilter, reGetAccessToken);
    // 해당 미들웨어는 _id, email 값을 추출하여 req.body._id, email 안에 넣어줍니다.

authRouter
    .route('/profile/:_id')
    .get(ownerTokenFilter, getProfile)
    .patch(userPatchGuard, ownerTokenFilter, patchProfile)
    .delete(userFormGuard, ownerTokenFilter, delteProfile);
    
export default authRouter;


