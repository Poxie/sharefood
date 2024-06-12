import UnauthorizedError from "@/errors/UnauthorizedError";
import UserQueries from "./userQueries";
import UserUtils from "./userUtils";
import bcrypt from 'bcrypt';

export default class UserAuth {
    static async authenticateUser(username: string, password: string) {
        const unauthorizedError = new UnauthorizedError('Invalid username or password.');
    
        const user = await UserQueries.getUserByUsername(username, true);
        if(!user || !('password' in user) || typeof user.password !== 'string') throw unauthorizedError;
    
        const passwordMatch = await bcrypt.compare(password, user.password);
        if(!passwordMatch) throw unauthorizedError;
    
        return UserUtils.excludeProperties(user, ['password']);
    }
}
