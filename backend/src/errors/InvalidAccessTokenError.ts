import { CustomError } from ".";
import { ERROR_CODES } from "./errorCodes";

export default class InvalidAccessTokenError extends CustomError {
    constructor(message: string) {
        super(message, ERROR_CODES.UNAUTHORIZED);
    }
}