import { CustomError } from ".";
import { ERROR_CODES } from "./errorCodes";

export default class ArgumentMissingError extends CustomError {
    constructor(message: string) {
        super(message, ERROR_CODES.BAD_REQUEST);
    }
}