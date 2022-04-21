import { Router } from "express";

import { userFormGuard } from "../middlewares/guards/user.form.guard";
import { userPatchGuard } from "../middlewares/guards/user.patch.guard";

import { accessTokenFilter } from "../middlewares/filters/token.access.filter";
import { refreshTokenFilter } from "../middlewares/filters/token.refresh.filter";

import { login, join, getProfile, patchProfile, delteProfile, getAccessToken } from './auth.controller';

const authRouter = Router();

authRouter
    .route('/')
    .get(userFormGuard, login)
    .post(userFormGuard, join);

authRouter
    .route('/profile')
    .get(getProfile)
    .patch(userPatchGuard, patchProfile)
    .delete(userFormGuard, delteProfile);
    // .get(accessTokenFilter, getProfile)
    // .patch(accessTokenFilter, userPatchGuard, patchProfile)
    // .delete(accessTokenFilter, userFormGuard, delteProfile);

authRouter
    .route('/token')
    .get(refreshTokenFilter, getAccessToken);

export default authRouter;


