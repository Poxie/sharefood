import { UsernameAlreadyTakenError } from '@/errors/UsernameAlreadyTakenError';
import { IMMUTABLE_USER_FIELDS, ALLOWED_USER_FIELDS } from './userConstants';
import { PRISMA_ERROR_CODES } from '@/errors/errorCodes';
import UserNotFoundError from '@/errors/UserNotFoundError';
import BadRequestError from '@/errors/BadRequestError';
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

        const immutableProps = Object.keys(data).filter(prop => IMMUTABLE_USER_FIELDS.includes(prop));
        const unknownProps = Object.keys(data).filter(prop => !ALLOWED_USER_FIELDS.includes(prop));
        const invalidProps = immutableProps.concat(unknownProps);

        if(invalidProps.length > 0) {
            let message = invalidProps.length === 1 ? 'Invalid property: ' : 'Invalid properties: ';
            message += invalidProps.join(', ');
            throw new BadRequestError(message);
        }

        // If password is passed, hash it
        if(data.password) {
            data.password = await bcrypt.hash(data.password, parseInt(process.env.BCRYPT_SALT_ROUNDS));
        }

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