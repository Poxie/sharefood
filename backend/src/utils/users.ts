import bcrypt from 'bcrypt';
import { PrismaClient, User } from "@prisma/client";
import { ID_LENGTH, IMMUTABLE_USER_FIELDS } from "./constants";
import prisma from "@/../client";
import { UsernameAlreadyTakenError } from '@/errors/UsernameAlreadyTakenError';
import UserNotFoundError from '@/errors/UserNotFoundError';
import { PRISMA_ERROR_CODES } from '@/errors/errorCodes';
import UnauthorizedError from '@/errors/UnauthorizedError';
import BadRequestError from '@/errors/BadRequestError';

export const generateUserId: () => Promise<string> = async () => {
    const id = Math.random().toString().slice(2, ID_LENGTH + 2);

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
    static async isAdmin(id: string) {
        const user = await prisma.user.findUnique({ where: { id } });
        if(!user) throw new UserNotFoundError();

        return user.isAdmin;
    }

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
                    isAdmin: false,
                }
            });
            
            return exclude(user, ['password']);
        } catch(error) {
            if((error as any).code === PRISMA_ERROR_CODES.UNIQUE_CONSTRAINT_VIOLATION) {
                throw new UsernameAlreadyTakenError();
            }
            throw error;
        }
    }
    static async deleteUser(id: string) {
        try {
            await prisma.user.delete({ where: { id } });
            return true;
        } catch(error) {
            if((error as any).code === PRISMA_ERROR_CODES.RECORD_NOT_FOUND) {
                throw new UserNotFoundError();
            }
            throw error;
        }
    }
    static async updateUser(id: string, data: Partial<User>) {
        const invalidProperties = Object.keys(data).filter(prop => !IMMUTABLE_USER_FIELDS.includes(prop));
        if(invalidProperties.length > 0) {
            let message = invalidProperties.length === 1 ? 'Invalid property: ' : 'Invalid properties: ';
            message += invalidProperties.join(', ');
            throw new BadRequestError(message);
        }

        try {
            const user = await prisma.user.update({ where: { id }, data });
            return exclude(user, ['password']);
        } catch(error) {
            if((error as any).code === PRISMA_ERROR_CODES.RECORD_NOT_FOUND) {
                throw new UserNotFoundError();
            }
            throw error;
        }
    }
}