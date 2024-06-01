import bcrypt from 'bcrypt';
import * as UserUtils from '@/utils/users';
import { prismaMock } from '../../../singleton';
import { User } from '@prisma/client';
import { ID_LENGTH } from '@/utils/constants';
import { UsernameAlreadyTakenError } from '@/errors/UsernameAlreadyTakenError';
import UserNotFoundError from '@/errors/UserNotFoundError';
import { PRISMA_ERROR_CODES } from '@/errors/errorCodes';

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