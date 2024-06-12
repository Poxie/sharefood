import zod from 'zod';
import { UserErrorMessages } from './userErrorMessages';
import { MAX_PASSWORD_LENGTH, MAX_USERNAME_LENGTH, MIN_PASSWORD_LENGTH, MIN_USERNAME_LENGTH } from './userConstants';

export const userSchema = zod.object({
    username: zod.string({ message: UserErrorMessages.USERNAME_REQUIRED })
        .min(MIN_USERNAME_LENGTH, { message: UserErrorMessages.USERNAME_MIN_LENGTH })
        .max(MAX_USERNAME_LENGTH, { message: UserErrorMessages.USERNAME_MAX_LENGTH }),
    password: zod.string({ message: UserErrorMessages.PASSWORD_REQUIRED })
        .min(MIN_PASSWORD_LENGTH, { message: UserErrorMessages.PASSWORD_MIN_LENGTH })
        .max(MAX_PASSWORD_LENGTH, { message: UserErrorMessages.PASSWORD_MAX_LENGTH }),
    isAdmin: zod.boolean(),
})
export type UserSchema = zod.infer<typeof userSchema>;