import { PrismaClient, User } from "@prisma/client";
import { ID_LENGTH } from "./constants";

const prisma = new PrismaClient();

export const generateUserId: () => Promise<string> = async () => {
    const id = Math.random().toString(36).slice(2, ID_LENGTH + 2);

    const exists = await Users.getUserById(id);
    if(exists) return generateUserId();

    return id;
}

export default class Users {
    static async getUserById(id: string, withPassword: boolean = false) {
        const user = await prisma.user.findUnique({ where: { id } });
        if(!user) return null;

        return withPassword ? user : { ...user, password: undefined };
    }
}