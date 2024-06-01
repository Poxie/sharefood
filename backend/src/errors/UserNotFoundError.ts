import { CustomError } from ".";
import { ERROR_CODES } from "./errorCodes";

export default class UserNotFoundError extends CustomError {
    constructor() {
        super('User not found', ERROR_CODES.NOT_FOUND);
    }
}