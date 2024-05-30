import { CustomError } from "@/errors";
import { ERROR_CODES } from "@/errors/errorCodes";
import { NextFunction, Request, Response } from "express";

export default function errorHandler(error: Error | CustomError, req: Request, res: Response, next: NextFunction) {
    if(error instanceof CustomError) {
        return res.status(error.statusCode).send({ message: error.message });
    }
  
    // If it's not a known error, send a generic 500 Internal Server Error
    console.error(error);
    return res.status(ERROR_CODES.INTERNAL_SERVER_ERROR).send({ message: 'Internal Server Error' });
}