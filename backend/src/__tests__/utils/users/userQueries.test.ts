import UserQueries from '@/utils/users/userQueries';
import { mockUser } from '../../../../test-utils';
import { prismaMock } from '../../../../singleton';
import { PRISMA_ERROR_CODES } from '@/errors/errorCodes';
import UserNotFoundError from '@/errors/UserNotFoundError';

describe('userQueries', () => {
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
})