import UserMutations from "@/utils/users/userMutations";
import bcrypt from 'bcrypt';
import { exclude, mockUser } from "../../../../test-utils";
import { prismaMock } from "../../../../singleton";
import { PRISMA_ERROR_CODES } from "@/errors/errorCodes";
import { UsernameAlreadyTakenError } from "@/errors/UsernameAlreadyTakenError";
import UserUtils from "@/utils/users/userUtils";
import UserNotFoundError from "@/errors/UserNotFoundError";
import { User } from "@prisma/client";

describe('userMutations', () => {
    afterEach(() => {
        jest.clearAllMocks();
        jest.restoreAllMocks();
    })

    describe('createUser', () => {
        const hashedPassword = 'hashedpassword';
        const mockBcryptHash = () => jest.spyOn(bcrypt, 'hash').mockImplementation(async () => hashedPassword);

        it('creates and returns a user object', async () => {
            const user = mockUser();
            const { username, password } = user;

            const bcryptSpy = mockBcryptHash();
            const prismaSpy = prismaMock.user.create.mockResolvedValue(user);
            const idSpy = jest.spyOn(UserUtils, 'generateUserId').mockResolvedValue(user.id);

            const createdUser = await UserMutations.createUser({ username, password });

            expect(createdUser).toEqual(exclude(user, ['password']));
            expect(bcryptSpy).toHaveBeenCalledWith(password, parseInt(process.env.BCRYPT_SALT_ROUNDS));
            expect(prismaSpy).toHaveBeenCalledWith({
                data: {
                    ...user,
                    password: hashedPassword,
                    createdAt: expect.any(String),
                }
            });
            expect(idSpy).toHaveBeenCalled();
        })
        it('throws an error if the username is already taken', async () => {
            const user = mockUser();
            const { username, password } = user;

            const bcryptSpy = mockBcryptHash();
            const prismaSpy = prismaMock.user.create.mockRejectedValue({ code: PRISMA_ERROR_CODES.UNIQUE_CONSTRAINT_VIOLATION });

            await expect(UserMutations.createUser({ username, password })).rejects.toThrow(new UsernameAlreadyTakenError());
        })
    })

    describe('deleteUser', () => {
        it('deletes a user and returns true', async () => {
            const user = mockUser();
            const userId = user.id;

            const prismaSpy = prismaMock.user.delete.mockResolvedValue(user);

            const deleted = await UserMutations.deleteUser(userId);

            expect(deleted).toBe(true);
            expect(prismaSpy).toHaveBeenCalledWith({ where: { id: userId } });
        })
        it('throws an error if the user is not found', async () => {
            const userId = 'invalidid';

            const prismaSpy = prismaMock.user.delete.mockRejectedValue({ code: PRISMA_ERROR_CODES.RECORD_NOT_FOUND });

            await expect(UserMutations.deleteUser(userId)).rejects.toThrow(new UserNotFoundError());
        })
    })

    describe('updateUser', () => {
        const mockUpdateUser = (data: User) => prismaMock.user.update.mockResolvedValue(data);
        const mockUpdateUserError = (code: string) => prismaMock.user.update.mockRejectedValue({ code });

        it('throws an error if the user does not exist', async () => {
            const userId = 'invalidid';
            const data = { username: 'newusername' };

            mockUpdateUserError(PRISMA_ERROR_CODES.RECORD_NOT_FOUND);

            await expect(UserMutations.updateUser(userId, data)).rejects.toThrow(new UserNotFoundError());
        })
        describe.each([
            { username: 'newusername' },
            { password: 'newhashedpassword' },
            { isAdmin: true },
        ])('updates the user properties and returns the new user object', (data) => {
            const prop = Object.keys(data)[0];

            it(`updates the user ${prop} property`, async () => {
                const user = mockUser();
    
                const newUser = {...user, ...data};
    
                const prismaSpy = mockUpdateUser(newUser);
    
                const updatedUser = await UserMutations.updateUser(user.id, data);
    
                expect(updatedUser).toEqual(exclude(newUser, ['password']));
                expect(prismaSpy).toHaveBeenCalledWith({ 
                    where: { id: user.id }, 
                    data: { ...data } 
                });
            })
        })
    })
})