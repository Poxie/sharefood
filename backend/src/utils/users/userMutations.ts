import { UsernameAlreadyTakenError } from '@/errors/UsernameAlreadyTakenError';
import { PRISMA_ERROR_CODES } from '@/errors/errorCodes';
import UserNotFoundError from '@/errors/UserNotFoundError';
import { User } from '@prisma/client';
import prisma from '@/../client'
import bcrypt from 'bcrypt';
import UserUtils from './userUtils';

export default class UserMutations {
    static async createUser({ username, password }: { 
        username: string, password: string 
    }) {
        if(!process.env.BCRYPT_SALT_ROUNDS) throw new Error('BCRYPT_SALT_ROUNDS is not defined in the environment variables.');
        
        const hashedPassword = await bcrypt.hash(password, parseInt(process.env.BCRYPT_SALT_ROUNDS));

        try {
            const user = await prisma.user.create({
                data: {
                    id: await UserUtils.generateUserId(),
                    username,
                    password: hashedPassword,
                    createdAt: new Date().getTime().toString(),
                    isAdmin: false,
                }
            });
            
            return UserUtils.excludeProperties(user, ['password']);
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
        if(!process.env.BCRYPT_SALT_ROUNDS) throw new Error('BCRYPT_SALT_ROUNDS is not defined in the environment variables.');

        try {
            const user = await prisma.user.update({ where: { id }, data });
            return UserUtils.excludeProperties(user, ['password']);
        } catch(error) {
            if((error as any).code === PRISMA_ERROR_CODES.RECORD_NOT_FOUND) {
                throw new UserNotFoundError();
            }
            throw error;
        }
    }
}