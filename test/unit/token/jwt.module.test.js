import jwt, { TokenExpiredError } from 'jsonwebtoken';

import JwtModule from "../../../src/token/jwt.module";
import { junkUserFormGenerator } from '../data/junk.user.generator';

describe('JwtModule', () => {

    let funcType;
    beforeAll(()=>{
        funcType = 'function';
        JwtModule.setSecert('SECRET TOKEN');
        JwtModule.setAlgorithm('HS256');
        JwtModule.setAccessExpired('1s');
        JwtModule.setRefreshExpired('3s');
    });

    describe('Uility Test', () => {
        it('JwtModule can\'t be instance', () => {
            try {
                new JwtModule();
            } catch (error) {
                expect(error).toEqual(new Error('JwtModule is utiltiy class'));
            }
        });
    });

    describe('Varlibes List', () => {
        it('SECRET must be defined', () => expect(JwtModule.SECRET).toBeDefined());
        it('ALGORITHM must be defined', () => expect(JwtModule.ALGORITHM).toBeDefined());
        it('ACCESS_EXPIRED must be defined', () => expect(JwtModule.ACCESS_EXPIRED).toBeDefined());
        it('REFRESH_EXPIRED must be defined', () => expect(JwtModule.REFRESH_EXPIRED).toBeDefined());
    });
    describe('Function List', () => {
        it('encodeAccessToken must be function', () => expect(typeof JwtModule.encodeAccessToken).toBe(funcType));
        it('encodeRefreshToken must be function', () => expect(typeof JwtModule.encodeRefreshToken).toBe(funcType));
        it('verifyToken must be function', () => expect(typeof JwtModule.verifyToken).toBe(funcType));
        it('decodeToken must be function', () => expect(typeof JwtModule.decodeToken).toBe(funcType));
    });

    describe('Setter List', () => {
        it('setSecert must be defined', () => expect(JwtModule.setSecert).toBeDefined());
        it('setSecert must be function', () => expect(typeof JwtModule.setSecert).toBe(funcType));
        it('setAlgorithm must be defined', () => expect(JwtModule.setAlgorithm).toBeDefined());
        it('setAlgorithm must be function', () => expect(typeof JwtModule.setAlgorithm).toBe(funcType));
        it('setAccessExpired must be defined', () => expect(JwtModule.setAccessExpired).toBeDefined());
        it('setAccessExpired must be function', () => expect(typeof JwtModule.setAccessExpired).toBe(funcType));
        it('setRefreshExpired must be defined', () => expect(JwtModule.setRefreshExpired).toBeDefined());
        it('setRefreshExpired must be function', () => expect(typeof JwtModule.setRefreshExpired).toBe(funcType));
    });

    describe('Time Test', () => {

        let DATA;

        let accessToken;
        let refreshToken;

        beforeAll(() => { 
            DATA = junkUserFormGenerator()

            accessToken = undefined;
            refreshToken = undefined;
        });
        
        beforeEach(() => {
            jest.useFakeTimers();

            accessToken = JwtModule.encodeAccessToken(DATA);
            refreshToken = JwtModule.encodeRefreshToken();
        });
        afterEach(() => {
            jest.runAllTimers();
        })

        it('Alive Check', () => {
            accessToken = JwtModule.encodeAccessToken(DATA);
            refreshToken = JwtModule.encodeRefreshToken();

            const verifyAccessToken = JwtModule.verifyToken(accessToken);
            const verifyRefreshToken = JwtModule.verifyToken(refreshToken);

            const decodeAccessToken = JwtModule.decodeToken(accessToken);
            const decodeRefrshToken = JwtModule.decodeToken(refreshToken);

            expect(verifyAccessToken).toStrictEqual({ 
                isLiveToken: true,
                message: "authorized",
                verifyToken: { ...DATA,
                    exp: verifyAccessToken.verifyToken.exp,
                    iat: verifyAccessToken.verifyToken.iat
                }
            });
            expect(verifyRefreshToken).toStrictEqual({
                isLiveToken: true,
                message: "authorized",
                verifyToken: {
                    exp: verifyRefreshToken.verifyToken.exp,
                    iat: verifyRefreshToken.verifyToken.iat
                }
            });

            expect(decodeAccessToken).toStrictEqual({
                isValidToken: true,
                message: 'authorized',
                decodeToken: {
                    ...DATA,
                    exp: decodeAccessToken.decodeToken.exp,
                    iat: decodeAccessToken.decodeToken.iat
                }
            });
            expect(decodeRefrshToken).toStrictEqual({
                isValidToken: true,
                message: 'authorized',
                decodeToken: {
                    exp: decodeRefrshToken.decodeToken.exp,
                    iat: decodeRefrshToken.decodeToken.iat
                }
            });
        });

        it('Alive Time Check 200ms : all token alive', async () => {
            setTimeout(() => {
                const verifyAccessToken = JwtModule.verifyToken(accessToken);
                const verifyRefreshToken = JwtModule.verifyToken(refreshToken);
    
                const decodeAccessToken = JwtModule.decodeToken(accessToken);
                const decodeRefrshToken = JwtModule.decodeToken(refreshToken);

                expect(verifyAccessToken).toStrictEqual({ 
                    isLiveToken: true,
                    message: "authorized",
                    verifyToken: { ...DATA,
                        exp: verifyAccessToken.verifyToken.exp,
                        iat: verifyAccessToken.verifyToken.iat
                    }
                });
                expect(verifyRefreshToken).toStrictEqual({
                    isLiveToken: true,
                    message: "authorized",
                    verifyToken: {
                        exp: verifyRefreshToken.verifyToken.exp,
                        iat: verifyRefreshToken.verifyToken.iat
                    }
                });

                expect(decodeAccessToken).toStrictEqual({
                    isValidToken: true,
                    message: 'authorized',
                    decodeToken: {
                        ...DATA,
                        exp: decodeAccessToken.decodeToken.exp,
                        iat: decodeAccessToken.decodeToken.iat
                    }
                });
                expect(decodeRefrshToken).toStrictEqual({
                    isValidToken: true,
                    message: 'authorized',
                    decodeToken: {
                        exp: decodeRefrshToken.decodeToken.exp,
                        iat: decodeRefrshToken.decodeToken.iat
                    }
                });
            }, 200);
        });

        it('Alive Time Check 1s : access token dead', async () => {
            setTimeout(() => {
                const verifyAccessToken = JwtModule.verifyToken(accessToken);
                const verifyRefreshToken = JwtModule.verifyToken(refreshToken);
    
                const decodeAccessToken = JwtModule.decodeToken(accessToken);
                const decodeRefrshToken = JwtModule.decodeToken(refreshToken);

                expect(verifyAccessToken).toStrictEqual({ 
                    isLiveToken: false,
                    message: "unauthorized",
                    verifyToken: new TokenExpiredError('jwt expired')
                });
                expect(verifyRefreshToken).toStrictEqual({
                    isLiveToken: true,
                    message: "authorized",
                    verifyToken: {
                        exp: verifyRefreshToken.verifyToken.exp,
                        iat: verifyRefreshToken.verifyToken.iat
                    }
                });
                
                expect(decodeAccessToken).toStrictEqual({
                    isValidToken: true,
                    message: 'authorized',
                    decodeToken: {
                        ...DATA,
                        exp: decodeAccessToken.decodeToken.exp,
                        iat: decodeAccessToken.decodeToken.iat
                    }
                });
                expect(decodeRefrshToken).toStrictEqual({
                    isValidToken: true,
                    message: 'authorized',
                    decodeToken: {
                        exp: decodeRefrshToken.decodeToken.exp,
                        iat: decodeRefrshToken.decodeToken.iat
                    }
                });
            }, 1000);
        });

        it('Alive Time Check 3s : all token dead', async () => {
            setTimeout(() => {
                const verifyAccessToken = JwtModule.verifyToken(accessToken);
                const verifyRefreshToken = JwtModule.verifyToken(refreshToken);

                const decodeAccessToken = JwtModule.decodeToken(accessToken);
                const decodeRefrshToken = JwtModule.decodeToken(refreshToken);
                
                expect(verifyAccessToken).toStrictEqual({ 
                    isLiveToken: false,
                    message: "unauthorized",
                    verifyToken: new TokenExpiredError('jwt expired')
                });
                expect(verifyRefreshToken).toStrictEqual({
                    isLiveToken: false,
                    message: "unauthorized",
                    verifyToken: new TokenExpiredError('jwt expired')
                });
                
                expect(decodeAccessToken).toStrictEqual({
                    isValidToken: true,
                    message: 'authorized',
                    decodeToken: {
                        ...DATA,
                        exp: decodeAccessToken.decodeToken.exp,
                        iat: decodeAccessToken.decodeToken.iat
                    }
                });
                expect(decodeRefrshToken).toStrictEqual({
                    isValidToken: true,
                    message: 'authorized',
                    decodeToken: {
                        exp: decodeRefrshToken.decodeToken.exp,
                        iat: decodeRefrshToken.decodeToken.iat
                    }
                });
            }, 3000);
        });
    });

    describe('Error Test', () => {

        describe('When you use JwtModule without Settings', () => {

            beforeAll(() => {
                JwtModule.setSecert(undefined);
                JwtModule.setAlgorithm(undefined);
                JwtModule.setAccessExpired(undefined);
                JwtModule.setRefreshExpired(undefined);
    
                jwt.sign = jest.fn();
            });
    
            it('encodeAccessToken return nothing', () => {
                JwtModule.encodeAccessToken();
                expect(jwt.sign).not.toBeCalled();
            });
            it('encodeRefreshToken return nothing', () => {
                JwtModule.encodeRefreshToken();
                expect(jwt.sign).not.toBeCalled();
            });
            it('verifyToken return nothing', () => {
                JwtModule.verifyToken();
                expect(jwt.sign).not.toBeCalled();
            });
        });


    })
});
