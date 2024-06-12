import UserAuth from '@/utils/users/userAuth';
import UserQueries from '@/utils/users/userQueries';
import { User } from '@prisma/client';
import { exclude, mockUser } from '../../../../test-utils';
import bcrypt from 'bcrypt';

describe('userAuth', () => {
    describe('authenticateUser', () => {
        const mockGetUser = (user: User | null) => jest.spyOn(UserQueries, 'getUserByUsername').mockResolvedValue(user);
        const mockCompare = (result: boolean) => jest.spyOn(bcrypt, 'compare').mockImplementation(() => result);

        it('compares the password and returns the user if its the correct password', async () => {
            const user = mockUser();
            
            const { username, password: hashedPassword } = user;
            const inputPassword = 'password';

            const getUserSpy = mockGetUser(user);
            const compareSpy = mockCompare(true);

            const authedUser = await UserAuth.authenticateUser(username, inputPassword);

            expect(authedUser).toEqual(exclude(user, ['password']));
            expect(getUserSpy).toHaveBeenCalledWith(username, true);
            expect(compareSpy).toHaveBeenCalledWith(inputPassword, hashedPassword);
        })
        it('throws an unauthorized error if the username is incorrect', async () => {
            const username = 'username';
            const inputPassword = 'password';

            const getUserSpy = mockGetUser(null);

            await expect(UserAuth.authenticateUser(username, inputPassword)).rejects.toThrow('Invalid username or password.');
            expect(getUserSpy).toHaveBeenCalledWith(username, true);
        })
        it('throws an unauthorized error if the password is incorrect', async () => {
            const user = mockUser();
            const { username } = user;
            const inputPassword = 'password';

            const getUserSpy = mockGetUser(user);
            const compareSpy = mockCompare(false);

            await expect(UserAuth.authenticateUser(username, inputPassword)).rejects.toThrow('Invalid username or password.');
            expect(getUserSpy).toHaveBeenCalledWith(username, true);
            expect(compareSpy).toHaveBeenCalledWith(inputPassword, user.password);
        })
    })
})