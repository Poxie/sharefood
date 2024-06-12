import { CustomError } from "@/errors";
import { ERROR_CODES } from "@/errors/errorCodes";
import { NextFunction, Request, Response } from "express";
import { ZodError } from "zod";

export default function errorHandler(error: Error | CustomError, req: Request, res: Response, next: NextFunction) {
    // If the error is a ZodError, send a 400 Bad Request
    if(error instanceof ZodError) {
        // Find the first error message in the array, display only one message at a time
        const message = error.errors.find(err => err.message);
        return res.status(ERROR_CODES.BAD_REQUEST).send({ message: message?.message });
    }

    // If the error is a CustomError, send the status code and message
    if(error instanceof CustomError) {
        return res.status(error.statusCode).send({ message: error.message });
    }
  
    // If it's not a known error, send a generic 500 Internal Server Error
    console.error(error);
    return res.status(ERROR_CODES.INTERNAL_SERVER_ERROR).send({ message: 'Internal Server Error' });
}