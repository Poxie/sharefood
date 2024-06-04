import InvalidAccessTokenError from '@/errors/InvalidAccessTokenError';
import { Request } from 'express';
import jwt from 'jsonwebtoken'

const JWT_PRIVATE_KEY = process.env.JWT_PRIVATE_KEY;

export const signToken = (userId: string) => {
    if(!JWT_PRIVATE_KEY) throw new Error('JWT_PRIVATE_KEY is not defined');
    return jwt.sign({ userId }, JWT_PRIVATE_KEY);
}

export const verifyToken = (cookies: Request['cookies'] | undefined) => {
    if(!JWT_PRIVATE_KEY) throw new Error('JWT_PRIVATE_KEY is not defined');

    const accessToken = cookies?.accessToken;
    if(!accessToken) throw new InvalidAccessTokenError('Access token is missing');

    try {
        const data = jwt.verify(accessToken, JWT_PRIVATE_KEY) as { userId: string };
        return data.userId;
    } catch(error) {
        throw new InvalidAccessTokenError('Invalid access token');
    }
}