import supertest from "supertest";
import app from "../../app";
import { prismaMock } from "../../../singleton";
import { User } from "@prisma/client";
import Users from "@/utils/users";
import * as Auth from '@/utils/auth';
import { ERROR_CODES } from "@/errors/errorCodes";
import UserNotFoundError from "@/errors/UserNotFoundError";
import UnauthorizedError from "@/errors/UnauthorizedError";

const request = supertest(app);

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

describe('Users Routes', () => {
    afterEach(() => {
        jest.clearAllMocks();
    })

    describe('POST /users', () => {
        const user = mockUser(['password']);

        beforeEach(() => {
            prismaMock.user.create.mockResolvedValue(user);
        })

        it('should create a new user and sign a token', async () => {
            const user = mockUser(['password']);
            const password = 'password';

            const spyCreateUser = jest.spyOn(Users, 'createUser');
            const spySignToken = jest.spyOn(Auth, 'signToken');

            const response = await request.post('/users').send({
                username: user.username,
                password,
            });

            expect(response.status).toBe(200);

            expect(response.body.user).toEqual({
                ...user,
                id: expect.any(String),
                createdAt: expect.any(String),
            });
            expect(response.body.accessToken).toEqual(expect.any(String));

            expect(spyCreateUser).toHaveBeenCalledWith({ username: user.username, password });
            expect(spySignToken).toHaveBeenCalledWith(user.id);
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
    describe('DELETE /users/:id', () => {
        it('should delete a user if the user is an admin', async () => {
            const id = '1';

            jest.spyOn(Auth, 'verifyToken').mockReturnValue(id);
            const spyDeleteUser = jest.spyOn(Users, 'deleteUser');
            const spyIsAdmin = jest.spyOn(Users, 'isAdmin').mockResolvedValue(true);

            const response = await request.delete(`/users/${id}`);

            expect(response.status).toBe(200);
            expect(response.body).toEqual({});

            expect(spyDeleteUser).toHaveBeenCalledWith(id);
            expect(spyIsAdmin).toHaveBeenCalledWith(id);
        })
        it('should delete a user if the user is the owner', async () => {
            const id = '1';

            jest.spyOn(Auth, 'verifyToken').mockReturnValue(id);
            const spyDeleteUser = jest.spyOn(Users, 'deleteUser');
            jest.spyOn(Users, 'isAdmin').mockResolvedValue(false);

            const response = await request.delete(`/users/${id}`);

            expect(response.status).toBe(200);
            expect(response.body).toEqual({});

            expect(spyDeleteUser).toHaveBeenCalledWith(id);
        })
        it('should return a 401 status code if the user is not the owner or an admin', async () => {
            const id = '1';

            jest.spyOn(Auth, 'verifyToken').mockReturnValue('2');
            jest.spyOn(Users, 'isAdmin').mockResolvedValue(false);
            const spyDeleteUser = jest.spyOn(Users, 'deleteUser');

            const response = await request.delete(`/users/${id}`);

            expect(response.status).toBe(ERROR_CODES.UNAUTHORIZED);
            expect(response.body).toEqual({ message: new UnauthorizedError().message });
            expect(spyDeleteUser).not.toHaveBeenCalled();
        })
        it('should return a 404 status code if the user does not exist', async () => {
            const id = 'nonexistant';

            jest.spyOn(Auth, 'verifyToken').mockReturnValue('2');
            jest.spyOn(Users, 'isAdmin').mockResolvedValue(true);
            jest.spyOn(Users, 'deleteUser').mockRejectedValue(new UserNotFoundError());

            const response = await request.delete(`/users/${id}`);

            expect(response.status).toBe(ERROR_CODES.NOT_FOUND);
            expect(response.body).toEqual({ message: new UserNotFoundError().message });
        })
    })
    describe('PATCH /users/:id', () => {
        it('should update a user if the logged in user is an admin', async () => {
            const user = mockUser(['password']);
            const updatedUser = { ...user, username: 'newUsername' };

            jest.spyOn(Auth, 'verifyToken').mockReturnValue('1');
            jest.spyOn(Users, 'isAdmin').mockResolvedValue(true);
            jest.spyOn(Users, 'updateUser').mockResolvedValue(updatedUser);

            const response = await request.patch(`/users/${user.id}`).send({ username: updatedUser.username });

            expect(response.status).toBe(200);
            expect(response.body).toEqual(updatedUser);
        });
        it('should update a user if the logged in user is the owner', async () => {
            const user = mockUser(['password']);
            const updatedUser = { ...user, username: 'newUsername' };

            jest.spyOn(Auth, 'verifyToken').mockReturnValue(user.id);
            jest.spyOn(Users, 'isAdmin').mockResolvedValue(false);
            jest.spyOn(Users, 'updateUser').mockResolvedValue(updatedUser);

            const response = await request.patch(`/users/${user.id}`).send({ username: updatedUser.username });

            expect(response.status).toBe(200);
            expect(response.body).toEqual(updatedUser);
        });
        it('should return a 401 status code if the user is not the owner or an admin', async () => {
            const user = mockUser(['password']);
            const updatedUser = { ...user, username: 'newUsername' };

            jest.spyOn(Auth, 'verifyToken').mockReturnValue('2');
            jest.spyOn(Users, 'isAdmin').mockResolvedValue(false);

            const response = await request.patch(`/users/${user.id}`).send({ username: updatedUser.username });

            expect(response.status).toBe(ERROR_CODES.UNAUTHORIZED);
            expect(response.body).toEqual({ message: new UnauthorizedError().message });
        });
        it('should throw an error if unknown fields are passed', async () => {
            const user = mockUser(['password']);

            jest.spyOn(Auth, 'verifyToken').mockReturnValue('1');
            jest.spyOn(Users, 'isAdmin').mockResolvedValue(true);

            const response = await request.patch(`/users/${user.id}`).send({ unknown: 'field' });

            expect(response.status).toBe(ERROR_CODES.BAD_REQUEST);
            expect(response.body).toEqual({ message: 'Invalid property: unknown' });
        })
        describe.each([
            { id: 'newid' },
            { createdAt: 'newDate' },
        ])(`if immutable fields are passed`, (data) => {
            it('should not update the user', async () => {
                const user = mockUser(['password']);

                const response = await request.patch(`/users/${user.id}`).send(data);

                expect(response.status).toBe(ERROR_CODES.BAD_REQUEST);
                expect(response.body).toEqual({ message: 'Invalid property: ' + Object.keys(data)[0] });
            })
        })
        it('should return a 404 status code if the user does not exist', async () => {
            const id = 'nonexistant';

            jest.spyOn(Auth, 'verifyToken').mockReturnValue('1');
            jest.spyOn(Users, 'isAdmin').mockResolvedValue(true);
            jest.spyOn(Users, 'updateUser').mockRejectedValue(new UserNotFoundError());

            const response = await request.patch(`/users/${id}`).send({ username: 'newUsername' });

            expect(response.status).toBe(ERROR_CODES.NOT_FOUND);
            expect(response.body).toEqual({ message: new UserNotFoundError().message });
        });
    })
})