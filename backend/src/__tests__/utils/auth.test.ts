import { signToken } from '../../utils/auth';
import jwt from 'jsonwebtoken';

jest.mock('jsonwebtoken', () => ({
    sign: jest.fn().mockReturnValue('accesstoken'),
}));

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
})