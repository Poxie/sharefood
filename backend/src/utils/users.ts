import bcrypt from 'bcrypt';
import { PrismaClient, User } from "@prisma/client";
import { ID_LENGTH } from "./constants";
import prisma from "@/../client";
import { UsernameAlreadyTakenError } from '@/errors/UsernameAlreadyTakenError';

export const generateUserId: () => Promise<string> = async () => {
    const id = Math.random().toString(36).slice(2, ID_LENGTH + 2);

    const exists = await Users.getUserById(id);
    if(exists) return generateUserId();

    return id;
}

// Exclude keys from user
function exclude<User, Key extends keyof User>(
    user: User,
    keys: Key[]
): Omit<User, Key> {
    return Object.fromEntries(
        Object.entries(user as { [k: string]: unknown; }).filter(([key]) => !keys.includes(key as Key))
    ) as Omit<User, Key>;
}
export default class Users {
    static async getUserById(id: string) {
        const user = await prisma.user.findUnique({ where: { id } });
        if(!user) return null;

        return exclude(user, ['password']);
    }
    static async createUser({ username, password }: { 
        username: string, password: string 
    }) {
        const hashedPassword = await bcrypt.hash(password, parseInt(process.env.BCRYPT_SALT_ROUNDS || '10'));

        try {
            const user = await prisma.user.create({
                data: {
                    id: await generateUserId(),
                    username,
                    password: hashedPassword,
                    createdAt: new Date().getTime().toString(),
                }
            });
            
            return exclude(user, ['password']);
        } catch(error) {
            if((error as any).code === 'P2002') {
                throw new UsernameAlreadyTakenError();
            }
            throw error;
        }
    }
}