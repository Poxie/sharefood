import jwt from 'jsonwebtoken'

const JWT_PRIVATE_KEY = process.env.JWT_PRIVATE_KEY;

export const signToken = (userId: string) => {
    return jwt.sign({ userId }, JWT_PRIVATE_KEY);
}