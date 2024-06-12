import InvalidAccessTokenError from "@/errors/InvalidAccessTokenError";
import UserAuth from "@/utils/users/userAuth";
import UserQueries from "@/utils/users/userQueries";
import { NextFunction, Request, Response } from "express";

async function authenticate(req: Request, res: Response, optional: boolean = false) {
    try {
        const userId = UserAuth.verifyToken(req.cookies);
        const isAdmin = await UserQueries.isAdmin(userId);

        res.locals.userId = userId;
        res.locals.isAdmin = isAdmin;
    } catch(error) {
        // If the error is unrelated to the access token, throw it
        if(!(error instanceof InvalidAccessTokenError)) {
            throw error;
        }
        // If the auth is required, throw the error
        if(!optional) {
            throw error;
        }
        // If the auth is optional, log the error for debugging purposes
        if(process.env.NODE_ENV === 'development') {
            console.error(error);
        }
    }
}

export async function auth(req: Request, res: Response, next: NextFunction) {
    try {
        await authenticate(req, res);
    } catch(error) {
        return next(error);
    }

    next();
}

export async function authOptional(req: Request, res: Response, next: NextFunction) {
    try {
        await authenticate(req, res, true);
    } catch(error) {
        // Catch the error, but don't throw it
    }
    next();
}