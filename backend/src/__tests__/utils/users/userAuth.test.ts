import UserAuth from '@/utils/users/userAuth';
import UserQueries from '@/utils/users/userQueries';
import { User } from '@prisma/client';
import { exclude, mockUser } from '../../../../test-utils';
import jwt, { JsonWebTokenError } from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import InvalidAccessTokenError from '@/errors/InvalidAccessTokenError';

describe('userAuth', () => {
    describe('authenticateUser', () => {
        const mockGetUser = (user: User | null) => jest.spyOn(UserQueries, 'getUserByUsername').mockResolvedValue(user);
        const mockCompare = (result: boolean) => jest.spyOn(bcrypt, 'compare').mockImplementation(() => result);

        it('compares the password and returns the user if its the correct password', async () => {
            const user = mockUser();
            
            const { username, password: hashedPassword } = user;
            const inputPassword = 'password';

            const getUserSpy = mockGetUser(user);
            const compareSpy = mockCompare(true);

            const authedUser = await UserAuth.authenticateUser(username, inputPassword);

            expect(authedUser).toEqual(exclude(user, ['password']));
            expect(getUserSpy).toHaveBeenCalledWith(username, true);
            expect(compareSpy).toHaveBeenCalledWith(inputPassword, hashedPassword);
        })
        it('throws an unauthorized error if the username is incorrect', async () => {
            const username = 'username';
            const inputPassword = 'password';

            const getUserSpy = mockGetUser(null);

            await expect(UserAuth.authenticateUser(username, inputPassword)).rejects.toThrow('Invalid username or password.');
            expect(getUserSpy).toHaveBeenCalledWith(username, true);
        })
        it('throws an unauthorized error if the password is incorrect', async () => {
            const user = mockUser();
            const { username } = user;
            const inputPassword = 'password';

            const getUserSpy = mockGetUser(user);
            const compareSpy = mockCompare(false);

            await expect(UserAuth.authenticateUser(username, inputPassword)).rejects.toThrow('Invalid username or password.');
            expect(getUserSpy).toHaveBeenCalledWith(username, true);
            expect(compareSpy).toHaveBeenCalledWith(inputPassword, user.password);
        })
    })

    describe('signToken', () => {
        it('signs a token with the user id', async () => {
            const userId = 'userid';
            const token = 'usertoken';

            const spy = jest.spyOn(jwt, 'sign').mockImplementation(() => token);

            const signedToken = await UserAuth.signToken(userId);

            expect(signedToken).toBe(token);
            expect(spy).toHaveBeenCalledWith({ userId }, process.env.JWT_PRIVATE_KEY);
        })
    })

    describe('verifyToken', () => {
        it('returns the userid if the token is valid', () => {
            const userId = 'userid';
            const accessToken = 'workingtoken';

            const spy = jest.spyOn(jwt, 'verify').mockImplementation(() => ({ userId }));

            const result = UserAuth.verifyToken({ accessToken });

            expect(result).toBe(userId);
            expect(spy).toHaveBeenCalledWith(accessToken, process.env.JWT_PRIVATE_KEY);
        })
        it('throws an error if the token is invalid', () => {
            const accessToken = 'invalidaccesstoken';

            const spy = jest.spyOn(jwt, 'verify').mockImplementation(() => { throw new JsonWebTokenError('someissue') });

            try {
                UserAuth.verifyToken({ accessToken });
                fail('should have thrown an InvalidAccessToken error');
            } catch(error) {
                expect(spy).toHaveBeenCalledWith(accessToken, process.env.JWT_PRIVATE_KEY);
                expect(error).toEqual(new InvalidAccessTokenError('Invalid access token.'));
            }       
        })
        describe.each([
            {},
            { accessToken: '' },
            { accessToken: undefined },
        ])('if token is missing', (accessToken) => {
            it('throws an error', () => {
                try {
                    UserAuth.verifyToken(accessToken);
                    fail('should have thrown an InvalidAccessToken error');
                } catch(error) {
                    expect(error).toEqual(new InvalidAccessTokenError('Access token is missing.'));
                }
            })
        })
    })

    describe('hashPassword', () => {
        it('hashes the password and returns it', async () => {
            const password = 'normalpassword';
            const hashedPassword = 'hashedpassword';

            const hashSpy = jest.spyOn(bcrypt, 'hash').mockImplementation(() => hashedPassword);

            const result = await UserAuth.hashPassword(password);

            expect(result).toBe(hashedPassword);
            expect(hashSpy).toHaveBeenCalledWith(password, parseInt(process.env.BCRYPT_SALT_ROUNDS));
        })
    })
})