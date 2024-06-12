import { NextFunction, Request, Response } from "express";

type RouteFunction = (req: Request, res: Response, next: NextFunction) => Promise<void>;

export default function asyncHandler(fn: RouteFunction): RouteFunction {
    return async (req, res, next) => {
        Promise.resolve(fn(req, res, next)).catch(next);
    };
}