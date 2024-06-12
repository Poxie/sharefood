import { MAX_PASSWORD_LENGTH, MAX_USERNAME_LENGTH, MIN_PASSWORD_LENGTH, MIN_USERNAME_LENGTH } from "./userConstants";

export const UserErrorMessages = {
    USERNAME_REQUIRED: 'Username is required.',
    PASSWORD_REQUIRED: 'Password is required.',
    USERNAME_MIN_LENGTH: `Username must be at least ${MIN_USERNAME_LENGTH} characters.`,
    USERNAME_MAX_LENGTH: `Username must be less than ${MAX_USERNAME_LENGTH} characters.`,
    PASSWORD_MIN_LENGTH: `Password must be at least ${MIN_PASSWORD_LENGTH} characters.`,
    PASSWORD_MAX_LENGTH: `Password must be less than ${MAX_PASSWORD_LENGTH} characters.`,
}