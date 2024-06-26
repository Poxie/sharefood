import UserQueries from '@/utils/users/userQueries';
import { exclude, mockUser } from '../../../../test-utils';
import { prismaMock } from '../../../../singleton';
import { PRISMA_ERROR_CODES } from '@/errors/errorCodes';
import UserNotFoundError from '@/errors/UserNotFoundError';

describe('userQueries', () => {
    afterEach(() => {
        jest.clearAllMocks();
        jest.restoreAllMocks();
    })

    describe('isAdmin', () => {
        it('should return true if the user is an admin', async () => {
            const user = mockUser({ props: { isAdmin: true } });

            prismaMock.user.findUnique.mockResolvedValue(user);

            const isAdmin = await UserQueries.isAdmin(user.id);

            expect(isAdmin).toBe(true);
        })
        it('should return false if the user is not an admin', async () => {
            const user = mockUser({ props: { isAdmin: false } });

            prismaMock.user.findUnique.mockResolvedValue(user);

            const isAdmin = await UserQueries.isAdmin(user.id);

            expect(isAdmin).toBe(false);
        })
        it('should throw an error if the user is not found', async () => {
            prismaMock.user.findUnique.mockResolvedValue(null);

            await expect(UserQueries.isAdmin('id')).rejects.toThrow(new UserNotFoundError());
        })
    })

    describe('getUserByUsername', () => {
        it('returns a user object if found', async () => {
            const user = mockUser();

            prismaMock.user.findUnique.mockResolvedValue(user);

            const foundUser = await UserQueries.getUserByUsername(user.username);

            expect(foundUser).toEqual(exclude(user, ['password']));
        })
        it('includes the password if withPassword is true', async () => {
            const user = mockUser();

            prismaMock.user.findUnique.mockResolvedValue(user);

            const foundUser = await UserQueries.getUserByUsername(user.username, true);

            expect(foundUser).toEqual(user);
        })
        it('returns null if the user is not found', async () => {
            prismaMock.user.findUnique.mockResolvedValue(null);

            const user = await UserQueries.getUserByUsername('username');

            expect(user).toBeNull();
        })
    })

    describe('getUserById', () => {
        it('returns a user object if found', async () => {
            const user = mockUser();

            prismaMock.user.findUnique.mockResolvedValue(user);

            const foundUser = await UserQueries.getUserById(user.id);

            expect(foundUser).toEqual(exclude(user, ['password']));
        })
        it('returns null if the user is not found', async () => {
            prismaMock.user.findUnique.mockResolvedValue(null);

            const user = await UserQueries.getUserById('id');

            expect(user).toBeNull();
        })
    })
})