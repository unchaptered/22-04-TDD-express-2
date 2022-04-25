import express from 'express';

// Environment Settings
import 'dotenv/config';
import { getMongoDB } from './options/mongo.option';
import { getRedisDB, setRedisRefreshExpired } from './options/redis.option';

import { getConfig } from './options/config.option';
import { getCorsInstance } from './options/cors.option';

import InjectFactory from './factories/inject.factory'; // Environment Injector
import LoggerFactory from './factories/logger.factory'; // System Logger Factory 
import JwtModule from './token/jwt.module'; // Authentication Module

import authRouter from './auth/auth.router';
import shopRouter from './shop/shop.router';

import homeRouter from './home/home.router';

const app = express();
const CORS = getCorsInstance();

const MODE = InjectFactory.getServerMode();
const PORT = InjectFactory.getPort() ?? 4000;

getConfig(MODE);
getMongoDB(MODE, InjectFactory.getMongoAddress());

getRedisDB(MODE, InjectFactory.getRedisOptions());
setRedisRefreshExpired(InjectFactory.getRedisRefreshExpired());

JwtModule.setSecert( InjectFactory.getJwtSecret() );
JwtModule.setAlgorithm( InjectFactory.getJwtAlgorithm() );
JwtModule.setAccessExpired( InjectFactory.getJwtAccessExpired() );
JwtModule.setRefreshExpired( InjectFactory.getJwtRefreshExpired() );
    
app.use(CORS);
app.use(express.json());
app.use(LoggerFactory.getLogger());

app.use('/auth', authRouter);
app.use('/shop', shopRouter);
app.use('/:id', homeRouter);

app.listen(PORT, () => {
    if (MODE !== 'test') console.log(`Server is running on ${PORT}`);
});

export default app;
