import app from "@/app";
import supertest from "supertest";
import Users from "@/utils/users";
import { exclude, mockUser } from "../../../test-utils";
import UnauthorizedError from "@/errors/UnauthorizedError";
import { ERROR_CODES } from "@/errors/errorCodes";

const request = supertest(app);

describe('POST /login', () => {
    it('should return 200 if the username and password are correct', async () => {
        const data = mockUser();
        const { username, password } = data;

        const returnData = exclude(data, ['password']);
        const authenticateSpy = jest.spyOn(Users, 'authenticate').mockResolvedValue(returnData);

        const response = await request
            .post('/login')
            .send({ username, password });

        expect(response.body).toEqual(returnData);
        expect(authenticateSpy).toHaveBeenCalledWith(username, password);
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