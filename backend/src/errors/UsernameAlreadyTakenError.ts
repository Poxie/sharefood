import { CustomError } from ".";
import { ERROR_CODES } from "./errorCodes";

export class UsernameAlreadyTakenError extends CustomError{
  constructor() {
    super('Username is already taken.', ERROR_CODES.UNAUTHORIZED);
  }
}