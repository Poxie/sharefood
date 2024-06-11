import prisma from "@/../client";
import UserNotFoundError from "@/errors/UserNotFoundError";
import UserUtils from "./userUtils";

export default class UserQueries {
    static async isAdmin(id: string) {
        const user = await prisma.user.findUnique({ where: { id } });
        if(!user) throw new UserNotFoundError();

        return user.isAdmin;
    }

    static async getUserByUsername(username: string, withPassword = false) {
        const user = await prisma.user.findUnique({ where: { username } });
        if(!user) return null;

        return UserUtils.excludeProperties(user, withPassword ? [] : ['password']);
    }

    static async getUserById(id: string) {
        const user = await prisma.user.findUnique({ where: { id } });
        if(!user) return null;

        return UserUtils.excludeProperties(user, ['password']);
    }
}