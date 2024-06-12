import * as Auth from '@/middleware/auth'
import UserAuth from '@/utils/users/userAuth';
import UserQueries from '@/utils/users/userQueries';
import { NextFunction, Request, Response } from 'express'
import { mockUser } from '../../../test-utils';
import InvalidAccessTokenError from '@/errors/InvalidAccessTokenError';
import { INVALID_ACCESS_TOKEN, MISSING_ACCESS_TOKEN } from '@/utils/auth/authErrorMessages';

describe('auth middleware', () => {
    let req: Partial<Request>;
    let res: Partial<Response>;
    let next: NextFunction = jest.fn();

    beforeEach(() => {
        req = {};
        res = { 
            locals: {
                userId: undefined,
                isAdmin: undefined,
            } 
        };

        jest.clearAllMocks();
        jest.restoreAllMocks();
    })

    const isAdminSpyFunction = (isAdmin: boolean) => jest.spyOn(UserQueries, 'isAdmin').mockResolvedValue(isAdmin);
    const verifyTokenSpyFunction = (userId: string | null) => jest.spyOn(UserAuth, 'verifyToken').mockReturnValue(userId);

    describe('authenticate', () => {
        const missingTokens = [
            {},
            { accessToken: '' },
            { accessToken: null },
            { accessToken: undefined },
        ]

        describe('when the authentication is required', () => {
            it('sets the res.locals.userId if the user is successfully authenticated', async () => {
                const user = mockUser();
                req.cookies = { accessToken: 'validtoken' };
    
                isAdminSpyFunction(false);
                const verifyTokenSpy = verifyTokenSpyFunction(user.id);
    
                await Auth.authenticate(req as Request, res as Response);
    
                expect(res.locals?.userId).toBe(user.id);
                expect(res.locals?.isAdmin).toBe(false);
                expect(verifyTokenSpy).toHaveBeenCalledWith(req.cookies);
            })
            describe.each([
                { isAdmin: false },
                { isAdmin: true },
            ])('sets the res.locals.isAdmin with the user admin state if the authentication is successful', ({ isAdmin }) => {
                it(`when the user is ${isAdmin ? 'an admin' : 'not an admin'}`, async () => {
                    const user = mockUser({ props: { isAdmin } });
                    req.cookies = { accessToken: 'validtoken' };
    
                    const adminSpy = isAdminSpyFunction(isAdmin);
                    verifyTokenSpyFunction(user.id);
    
                    await Auth.authenticate(req as Request, res as Response);
    
                    expect(res.locals?.isAdmin).toBe(isAdmin);
                    expect(adminSpy).toHaveBeenCalledWith(user.id);
                })
            })
            it('throws a reguar error if the error is not caused by the verify token function', async () => {
                const userId = 'userid';
                req.cookies = { accessToken: 'validtoken' };

                const error = new Error('error');

                verifyTokenSpyFunction(userId);
                jest.spyOn(UserQueries, 'isAdmin').mockRejectedValue(error);

                await expect(Auth.authenticate(req as Request, res as Response)).rejects.toThrow(error);
            })
            it('throws an unauthorized error if the token is invalid', async () => {
                req.cookies = { accessToken: 'invalidtoken' };
                
                const error = new InvalidAccessTokenError(INVALID_ACCESS_TOKEN);
    
                verifyTokenSpyFunction(null);
    
                await expect(Auth.authenticate(req as Request, res as Response)).rejects.toThrow(error);
            })
            describe.each(missingTokens)('if the token is missing', (cookies) => {
                it('throws an invalid access token error', async () => {
                    req.cookies = cookies;
    
                    const error = new InvalidAccessTokenError(INVALID_ACCESS_TOKEN);
    
                    verifyTokenSpyFunction(null);
    
                    await expect(Auth.authenticate(req as Request, res as Response)).rejects.toThrow(error);
                })
            })
        })

        describe('when the authentication is optional', () => {
            it('sets the res.locals.userId if the user is successfully authenticated', async () => {
                const user = mockUser();
                req.cookies = { accessToken: 'validtoken' };

                isAdminSpyFunction(user.isAdmin);
                const verifyTokenSpy = verifyTokenSpyFunction(user.id);

                await Auth.authenticate(req as Request, res as Response, true);

                expect(verifyTokenSpy).toHaveBeenCalledWith(req.cookies);
                expect(res.locals?.userId).toBe(user.id);
                expect(res.locals?.isAdmin).toBe(user.isAdmin);
            })
            it('doesnt throw an invalid token error if the token is invalid', async () => {
                req.cookies = { accessToken: 'invalidtoken' };

                const error = new InvalidAccessTokenError(INVALID_ACCESS_TOKEN);

                verifyTokenSpyFunction(null);

                await Auth.authenticate(req as Request, res as Response, true);

                expect(res.locals?.userId).toBeUndefined();
            })
            describe.each(missingTokens)('if the token is missing', (cookies) => {
                it('doesnt throw an invalid token error', async () => {
                    req.cookies = cookies;

                    const error = new InvalidAccessTokenError(INVALID_ACCESS_TOKEN);

                    verifyTokenSpyFunction(null);

                    await expect(() => Auth.authenticate(req as Request, res as Response, true)).not.toThrow(error);
                })
            })
            it('throws an error if the error is unrelated to user authentication', async () => {
                const userId = 'userid';
                req.cookies = { accessToken: 'validtoken' };

                const error = new Error('error');

                verifyTokenSpyFunction(userId);
                jest.spyOn(UserQueries, 'isAdmin').mockRejectedValue(error);

                await expect(Auth.authenticate(req as Request, res as Response, true)).rejects.toThrow(error);
            })
        })
    })
})