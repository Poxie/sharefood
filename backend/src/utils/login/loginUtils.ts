import { userSchema } from "../users/userSchema";

export default class LoginUtils {
    static validateLoginInput(data: Record<string, any>) {
        return userSchema
            .pick({ username: true, password: true })
            .strict()
            .parse(data);
    }
}