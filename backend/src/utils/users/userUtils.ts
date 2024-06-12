import { USER_ID_LENGTH } from "./userConstants";
import UserQueries from "./userQueries";
import { userSchema } from "./userSchema";

export default class UserUtils {
    static async generateUserId(): Promise<string> {
        const id = Math.random().toString().slice(2, USER_ID_LENGTH + 2);
    
        const exists = await UserQueries.getUserById(id);
        if(exists) return this.generateUserId();
    
        return id;
    }

    static excludeProperties<User, Key extends keyof User>(
        user: User,
        keys: Key[]
    ): Omit<User, Key> {
        return Object.fromEntries(
            Object.entries(user as { [k: string]: unknown; }).filter(([key]) => !keys.includes(key as Key))
        ) as Omit<User, Key>;
    }

    static validateCreateUserInput(reqBody: Record<string, any>) {
        userSchema
            .pick({ username: true, password: true })
            .strict()
            .parse(reqBody);
    }
    static validateUpdateUserInput(reqBody: Record<string, any>) {
        userSchema
            .pick({ username: true, password: true })
            .strict()
            .partial()
            .parse(reqBody);
    }
}