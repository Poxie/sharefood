import app from "@/app";
import supertest from "supertest";
import Users from "@/utils/users";
import * as Auth from '@/utils/auth';
import { exclude, mockUser } from "../../../test-utils";
import UnauthorizedError from "@/errors/UnauthorizedError";
import { ERROR_CODES } from "@/errors/errorCodes";

const request = supertest(app);

describe('POST /login', () => {
    it('should return 200 if the username and password are correct and set token cookie', async () => {
        const data = mockUser();
        const { username, password } = data;
        const token = 'token';

        const returnData = exclude(data, ['password']);
        const authenticateSpy = jest.spyOn(Users, 'authenticate').mockResolvedValue(returnData);
        const signTokenSpy = jest.spyOn(Auth, 'signToken').mockReturnValue(token);

        const response = await request
            .post('/login')
            .send({ username, password });

        expect(response.status).toBe(200);
        expect(response.body).toEqual(returnData);
        expect(authenticateSpy).toHaveBeenCalledWith(username, password);
        expect(signTokenSpy).toHaveBeenCalledWith(returnData.id);
        expect(response.headers['set-cookie'].at(0)).toMatch(new RegExp(`^accessToken=${token}`));
    })
    it('should return 401 if the username is incorrect', async () => {
        const data = mockUser();
        const { password } = data;
        const username = 'incorrectusername';

        const error = new UnauthorizedError('Invalid username or password.');
        const authenticateSpy = jest.spyOn(Users, 'authenticate').mockRejectedValue(error);

        const response = await request
            .post('/login')
            .send({ username, password });

        expect(authenticateSpy).toHaveBeenCalledWith(username, password);
        expect(response.status).toBe(ERROR_CODES.UNAUTHORIZED);
        expect(response.body).toEqual({ message: error.message });
    })
    it('should return 401 if the password is incorrect', async () => {
        const data = mockUser();
        const { username } = data;
        const password = 'incorrectpassword';

        const error = new UnauthorizedError('Invalid username or password.');
        const authenticateSpy = jest.spyOn(Users, 'authenticate').mockRejectedValue(error);

        const response = await request
            .post('/login')
            .send({ username, password });

        expect(authenticateSpy).toHaveBeenCalledWith(username, password);
        expect(response.status).toBe(ERROR_CODES.UNAUTHORIZED);
        expect(response.body).toEqual({ message: error.message });
    })
    it('should return 400 if the username is missing', async () => {
        const response = await request
            .post('/login')
            .send({ password: 'password' });

        expect(response.status).toBe(ERROR_CODES.BAD_REQUEST);
        expect(response.body).toEqual({ message: 'Username is required.' });
    })
    it('should return 400 if the password is missing', async () => {
        const response = await request
            .post('/login')
            .send({ username: 'username' });

        expect(response.status).toBe(ERROR_CODES.BAD_REQUEST);
        expect(response.body).toEqual({ message: 'Password is required.' });
    })
})