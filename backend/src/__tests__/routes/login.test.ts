import app from "@/app";
import supertest from "supertest";
import UserAuth from '@/utils/users/userAuth';
import { exclude, mockUser } from "../../../test-utils";
import UnauthorizedError from "@/errors/UnauthorizedError";
import { ERROR_CODES } from "@/errors/errorCodes";
import { User } from "@prisma/client";

const request = supertest(app);

describe('POST /login', () => {
    const mockAuthenticateUser = (user: Omit<User, 'password'>) => jest.spyOn(UserAuth, 'authenticateUser').mockResolvedValue(user);
    const mockSignToken = (token: string) => jest.spyOn(UserAuth, 'signToken').mockReturnValue(token);

    const userWithoutPassword = () => mockUser({ excludedFields: ['password'] });

    it('returns the user and sets their token as a cookie if username and password are correct', async () => {
        const user = userWithoutPassword();
        const password = 'password';
        const token = 'accesstoken';

        const authenticateSpy = mockAuthenticateUser(user);
        const signTokenSpy = mockSignToken(token);

        const response = await request.post('/login').send({ username: user.username, password });

        expect(response.body).toEqual(user);
        expect(response.header['set-cookie'].at(0)).toContain(`accessToken=${token}`);
        expect(authenticateSpy).toHaveBeenCalledWith(user.username, password);
        expect(signTokenSpy).toHaveBeenCalledWith(user.id);
    })
})