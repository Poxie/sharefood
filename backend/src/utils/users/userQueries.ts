import prisma from "@/../client";
import { exclude } from "@/../test-utils";
import UserNotFoundError from "@/errors/UserNotFoundError";

export default class UserQueries {
    static async isAdmin(id: string) {
        const user = await prisma.user.findUnique({ where: { id } });
        if(!user) throw new UserNotFoundError();

        return user.isAdmin;
    }

    static async getUserByUsername(username: string) {
        const user = await prisma.user.findUnique({ where: { username } });
        if(!user) return null;

        return user;
    }

    static async getUserById(id: string) {
        const user = await prisma.user.findUnique({ where: { id } });
        if(!user) return null;

        return exclude(user, ['password']);
    }
}