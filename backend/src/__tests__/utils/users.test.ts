import bcrypt from 'bcrypt';
import * as UserUtils from '@/utils/users';
import { prismaMock } from '../../../singleton';
import { User } from '@prisma/client';
import { ID_LENGTH } from '@/utils/constants';
import { UsernameAlreadyTakenError } from '@/errors/UsernameAlreadyTakenError';
import UserNotFoundError from '@/errors/UserNotFoundError';
import { PRISMA_ERROR_CODES } from '@/errors/errorCodes';
import UnauthorizedError from '@/errors/UnauthorizedError';
import BadRequestError from '@/errors/BadRequestError';

jest.mock('bcrypt', () => ({
    hash: jest.fn().mockResolvedValue('hashedPassword'),
}));

// Mock data
const mockUser: (excludedFields?: (keyof User)[]) => User = (excludedFields=[]) => {
    const user = {
        id: '1',
        username: 'test',
        password: 'password',
        createdAt: new Date().getTime().toString(),
        isAdmin: false,
    }
    return excludedFields.reduce((acc, field) => {
        delete acc[field];
        return acc;
    }, user);
};

const Users = UserUtils.default;
const { generateUserId } = UserUtils;

describe('Users Utils', () => {
    afterEach(() => {
        jest.clearAllMocks();
    })

    describe('generateUserId', () => {
        it('should generate a random user ID', async () => {
            const id = await generateUserId();
            expect(typeof id).toBe('string');
            expect(id.length).toBe(ID_LENGTH);
        })
        it('should check if ID already exists', async () => {
            const spy = jest.spyOn(Users, 'getUserById');

            await generateUserId();
            
            expect(spy).toHaveBeenCalledTimes(1);
        })
        it('should generate a new ID if ID already exists', async () => {
            const spy = jest.spyOn(Users, 'getUserById')
                .mockResolvedValueOnce(mockUser())
                .mockResolvedValueOnce(null);

            await generateUserId();
            
            expect(spy).toHaveBeenCalledTimes(2);
        })
    })

    describe('getUserById', () => {
        it('should return a user if the user exists', async () => {
            const user = mockUser(['password']);
            prismaMock.user.findUnique.mockResolvedValue(user);

            const result = await Users.getUserById(user.id);

            expect(result).toEqual(user);
            expect(result).not.toHaveProperty('password');
        })

        it('should return null if the user does not exist', async () => {
            const id = 'nonexistent';
            prismaMock.user.findUnique.mockResolvedValue(null);

            expect(Users.getUserById(id)).resolves.toBeNull();
        })
    })

    describe('createUser', () => {
        it('should create a new user with encrypted password', async () => {
            const user = mockUser(['password']);

            prismaMock.user.create.mockResolvedValue(user);
            const hashSpy = jest.spyOn(bcrypt, 'hash');
            const idSpy = jest.spyOn(UserUtils, 'generateUserId');

            const result = await Users.createUser({
                username: user.username,
                password: user.password,
            });

            expect(result).toEqual(user);
            expect(hashSpy).toHaveBeenCalledTimes(1);
            expect(idSpy).toHaveBeenCalledTimes(1);
            expect(prismaMock.user.create).toHaveBeenCalledWith({ data: {
                ...user,
                id: expect.any(String),
                password: 'hashedPassword',
                createdAt: expect.any(String),
            } });
        })
        it('should throw an error if the username is already taken', async () => {
            prismaMock.user.create.mockRejectedValue({ code: PRISMA_ERROR_CODES.UNIQUE_CONSTRAINT_VIOLATION });

            await expect(Users.createUser({
                username: 'test',
                password: 'password',
            })).rejects.toEqual(new UsernameAlreadyTakenError());
        })
    })
    describe('deleteUser', () => {
        it('should delete a user', async () => {
            const id = '1';

            const result = await Users.deleteUser(id);

            expect(result).toBe(true);
            expect(prismaMock.user.delete).toHaveBeenCalledWith({ where: { id } });
        })
    })
    describe('updateUser', () => {
        it('should update a user', async () => {
            const user = mockUser(['password']);
            const updatedUser = { ...user, username: 'newUsername' };

            prismaMock.user.update.mockResolvedValue(updatedUser);

            const result = await Users.updateUser(user.id, { username: updatedUser.username });

            expect(result).toEqual(updatedUser);
            expect(prismaMock.user.update).toHaveBeenCalledWith({ 
                where: { id: user.id }, 
                data: { username: updatedUser.username },
            });
        })
        it('should hash the password if it is passed', async () => {
            const user = mockUser(['password']);
            const updatedUser = { ...user, password: 'newPassword' };

            const spy = jest.spyOn(bcrypt, 'hash');
            prismaMock.user.update.mockResolvedValue(updatedUser);

            const result = await Users.updateUser(user.id, { password: updatedUser.password });

            expect(result).toEqual(user);
            expect(prismaMock.user.update).toHaveBeenCalledWith({ 
                where: { id: user.id }, 
                data: { password: 'hashedPassword' },
            });
            expect(spy).toHaveBeenCalledWith(updatedUser.password, parseInt(process.env.BCRYPT_SALT_ROUNDS));
        })
        describe.each([
            { id: 'newId' },
            { createdAt: 'newDate' },
        ])('if immutable fields are passed', (data) => {
            it('should not update the user', async () => {
                const user = mockUser(['password']);

                let error;
                try {
                    await Users.updateUser(user.id, data);
                } catch(e) {
                    error = e;
                }

                expect(error).toBeInstanceOf(BadRequestError);
                expect(prismaMock.user.update).not.toHaveBeenCalled();
            })
        })
        it('should throw an error if invalid properties are passed', () => {
            const user = mockUser(['password']);

            expect(Users.updateUser(user.id, { unknown: 'field' } as any))
                .rejects.toBeInstanceOf(BadRequestError);
            expect(prismaMock.user.update).not.toHaveBeenCalled();
        })
        it('should throw an error if the user does not exist', async () => {
            prismaMock.user.update.mockRejectedValue({ code: PRISMA_ERROR_CODES.RECORD_NOT_FOUND });

            try {
                await Users.updateUser('nonexistent', {});
            } catch(error) {
                expect(error).toBeInstanceOf(UserNotFoundError);
            }
        })
    })

    describe('isAdmin', () => {
        it('should return true if the user is an admin', async () => {
            const user = mockUser(['password']);
            user.isAdmin = true;

            prismaMock.user.findUnique.mockResolvedValue(user);

            const result = await Users.isAdmin(user.id);

            expect(result).toBe(true);
        })
        it('should return false if the user is not an admin', async () => {
            const user = mockUser(['password']);

            prismaMock.user.findUnique.mockResolvedValue(user);

            const result = await Users.isAdmin(user.id);

            expect(result).toBe(false);
        })
        it('should throw an error if the user does not exist', async () => {
            prismaMock.user.findUnique.mockResolvedValue(null);

            try {
                await Users.isAdmin('nonexistent');
            } catch(error) {
                expect(error).toBeInstanceOf(UserNotFoundError);
            }
        })
    })
})