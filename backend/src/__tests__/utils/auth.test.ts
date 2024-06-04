import InvalidAccessTokenError from '@/errors/InvalidAccessTokenError';
import { signToken, verifyToken } from '../../utils/auth';
import jwt from 'jsonwebtoken';

describe('Auth Utils', () => {
    describe('signToken', () => {
        it('should generate a token', () => {
            const spy = jest.spyOn(jwt, 'sign');

            const userId = '1';
            const token = signToken(userId);
            
            expect(typeof token).toBe('string');
            expect(spy).toHaveBeenCalledWith({ userId }, expect.any(String));
        })
    })

    describe('verifyToken', () => {
        it('should verify a token and return the userId', () => {
            const userId = '1';
            const cookies = {
                accessToken: 'workingtoken',
            }

            const spy = jest.spyOn(jwt, 'verify');
            spy.mockImplementation(() => ({ userId }));

            const result = verifyToken(cookies);

            expect(result).toBe(userId);
            expect(spy).toHaveBeenCalledWith(cookies.accessToken, process.env.JWT_PRIVATE_KEY);
        })
        it('should throw an error if the token is missing', () => {
            try {
                verifyToken(undefined);
            } catch(error) {
                expect(error).toEqual(new InvalidAccessTokenError('Access token is missing'));
            }
        })
        it('should throw an error if the token is invalid', () => {
            const cookies = {
                accessToken: 'invalidtoken',
            }

            try {
                verifyToken(cookies);
            } catch(error) {
                expect(error).toEqual(new InvalidAccessTokenError('Invalid access token'));
            }
        })
    })
})