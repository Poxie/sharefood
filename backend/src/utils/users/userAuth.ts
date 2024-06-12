import UnauthorizedError from "@/errors/UnauthorizedError";
import UserQueries from "./userQueries";
import UserUtils from "./userUtils";
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { Request } from "express";
import InvalidAccessTokenError from "@/errors/InvalidAccessTokenError";

const JWT_PRIVATE_KEY = process.env.JWT_PRIVATE_KEY;

export default class UserAuth {
    static async authenticateUser(username: string, password: string) {
        const unauthorizedError = new UnauthorizedError('Invalid username or password.');
    
        const user = await UserQueries.getUserByUsername(username, true);
        if(!user || !('password' in user) || typeof user.password !== 'string') throw unauthorizedError;
    
        const passwordMatch = await bcrypt.compare(password, user.password);
        if(!passwordMatch) throw unauthorizedError;
    
        return UserUtils.excludeProperties(user, ['password']);
    }

    static signToken(userId: string) {
        if(!JWT_PRIVATE_KEY) throw new Error('JWT_PRIVATE_KEY is not defined');
        return jwt.sign({ userId }, JWT_PRIVATE_KEY);
    }

    static verifyToken (cookies: Request['cookies'] | undefined) {
        if(!JWT_PRIVATE_KEY) throw new Error('JWT_PRIVATE_KEY is not defined');
    
        const accessToken = cookies?.accessToken;
        if(!accessToken) throw new InvalidAccessTokenError('Access token is missing.');
    
        try {
            const data = jwt.verify(accessToken, JWT_PRIVATE_KEY) as { userId: string };
            return data.userId;
        } catch(error) {
            throw new InvalidAccessTokenError('Invalid access token.');
        }
    }
}
