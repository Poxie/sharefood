import { CustomError } from ".";
import { ERROR_CODES } from "./errorCodes";

export default class UnauthorizedError extends CustomError {
    constructor(message='Unauthorized') {
        super(message, ERROR_CODES.UNAUTHORIZED);
    }
}