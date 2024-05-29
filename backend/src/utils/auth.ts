import jwt from 'jsonwebtoken'

const JWT_PRIVATE_KEY = process.env.JWT_PRIVATE_KEY;

export const signToken = (userId: string) => {
    if(!JWT_PRIVATE_KEY) throw new Error('JWT_PRIVATE_KEY is not defined');
    return jwt.sign({ userId }, JWT_PRIVATE_KEY);
}