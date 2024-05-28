import supertest from "supertest";
import app from "../../app";
import { prismaMock } from "../../../singleton";
import { User } from "@prisma/client";
import Users from "@/utils/users";
import { ERROR_CODES } from "@/errors/errorCodes";

const request = supertest(app);

// Mock data
const mockUser: (excludedFields?: (keyof User)[]) => User = (excludedFields=[]) => {
    const user = {
        id: '1',
        username: 'test',
        password: 'password',
        createdAt: new Date().getTime().toString(),
    }
    return excludedFields.reduce((acc, field) => {
        delete acc[field];
        return acc;
    }, user);
};

describe('Users Routes', () => {
    describe('POST /users', () => {
        const user = mockUser(['password']);

        beforeEach(() => {
            prismaMock.user.create.mockResolvedValue(user);
        })

        it('should create a new user', async () => {
            const user = mockUser(['password']);
            const password = 'password';

            const spy = jest.spyOn(Users, 'createUser');

            const response = await request.post('/users').send({
                username: user.username,
                password,
            });

            expect(response.status).toBe(200);
            expect(response.body).toHaveProperty('id');
            expect(response.body).toHaveProperty('username');
            expect(response.body).toHaveProperty('createdAt');
            expect(response.body).not.toHaveProperty('password');
            expect(spy).toHaveBeenCalledWith({ username: user.username, password });
        })
        it('should return a 401 status code if the username is already taken', async () => {
            // Code P2002 is thrown when a unique constraint is violated
            prismaMock.user.create.mockRejectedValue({ code: 'P2002' });

            const response = await request.post('/users').send({
                username: 'test',
                password: 'password',
            });

            expect(response.status).toBe(401);
        })
        describe.each([
            { username: 'username', password: '' },
            { username: '', password: 'password' },
            { username: '', password: '' },
            { username: 'username' },
            { password: 'password' },
        ])('when username or password is invalid', (body) => {
            it('should return 400 status code', async () => {
                const response = await request.post('/users').send(body);
                expect(response.status).toBe(ERROR_CODES.BAD_REQUEST);
            });
        });
    })
})