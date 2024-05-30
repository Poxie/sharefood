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
            const token = 'actualworkingtoken';

            const spy = jest.spyOn(jwt, 'verify');
            spy.mockImplementation(() => ({ userId }));

            const bearerToken = `Bearer ${token}`;
            const result = verifyToken(bearerToken);

            expect(result).toBe(userId);
            expect(spy).toHaveBeenCalledWith(token, process.env.JWT_PRIVATE_KEY);
        })
        it('should throw an error if the token is missing', () => {
            const spy = jest.spyOn(jwt, 'verify');

            try {
                verifyToken(undefined);
            } catch(error) {
                expect(error).toEqual(new InvalidAccessTokenError('Access token is missing'));
            }
        })
        it('should throw an error if the token is invalid', () => {
            const spy = jest.spyOn(jwt, 'verify');

            const bearerToken = 'Bearer invalidtoken';

            try {
                verifyToken(bearerToken);
            } catch(error) {
                expect(error).toEqual(new InvalidAccessTokenError('Invalid access token'));
            }
        })
    })
})