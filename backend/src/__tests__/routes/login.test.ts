import app from "@/app";
import supertest from "supertest";
import UserAuth from '@/utils/users/userAuth';
import { exclude, mockUser } from "../../../test-utils";
import UnauthorizedError from "@/errors/UnauthorizedError";
import { ERROR_CODES } from "@/errors/errorCodes";
import { User } from "@prisma/client";
import LoginUtils from "@/utils/login/loginUtils";
import { INCORRECT_CREDENTIALS } from "@/utils/login/loginErrorMessages";

const request = supertest(app);

describe('POST /login', () => {
    const mockAuthenticateUser = (user: Omit<User, 'password'>) => jest.spyOn(UserAuth, 'authenticateUser').mockResolvedValue(user);
    const mockAuthenticateUserError = (error: Error) => jest.spyOn(UserAuth, 'authenticateUser').mockRejectedValue(error);
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
    it('throws an incorrect credentials error if the authenticateUser function fails', async () => {
        const data = { username: 'incorrectusername', password: 'password' };

        const error = new UnauthorizedError(INCORRECT_CREDENTIALS);
        const authenticateSpy = mockAuthenticateUserError(error);

        const response = await request.post('/login').send(data);

        expect(response.status).toBe(ERROR_CODES.UNAUTHORIZED);
        expect(response.body).toEqual({ message: error.message });
    })
    describe.each([
        { username: '', password: '' },
        { username: 'username' },
        { password: 'password' },
        { password: 'password', username: 'username', invalid: 'field' },
    ])('when the request body is missing a required field or have invalid properties', (data) => {
        it('validates the request body using zod validateLoginInput function', async () => {
            const validateSpy = jest.spyOn(LoginUtils, 'validateLoginInput');
    
            const response = await request.post('/login').send(data);
    
            expect(response.status).toBe(ERROR_CODES.BAD_REQUEST);
            expect(validateSpy).toHaveBeenCalledWith(data);
        })
    })
})