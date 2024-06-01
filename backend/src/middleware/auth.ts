import { verifyToken } from "@/utils/auth";
import Users from "@/utils/users";
import { NextFunction, Request, Response } from "express";

export default async function auth(req: Request, res: Response, next: NextFunction) {
    try {
        const userId = verifyToken(req.headers.authorization);

        const isAdmin = await Users.isAdmin(userId);

        res.locals.userId = userId;
        res.locals.isAdmin = isAdmin;
    } catch(error) {
        return next(error);
    }

    next();
}