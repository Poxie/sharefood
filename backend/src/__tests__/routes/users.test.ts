import supertest from "supertest";
import app from "../../app";
import { prismaMock } from "../../../singleton";
import { User } from "@prisma/client";
import * as AuthMiddleware from '@/middleware/auth';
import { ERROR_CODES } from "@/errors/errorCodes";
import UserNotFoundError from "@/errors/UserNotFoundError";
import UnauthorizedError from "@/errors/UnauthorizedError";
import BadRequestError from "@/errors/BadRequestError";
import UserQueries from "@/utils/users/userQueries";
import UserMutations from "@/utils/users/userMutations";
import UserAuth from "@/utils/users/userAuth";

jest.mock('@/middleware/auth');

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
    const mockAuthMiddleware = ({ locals={}, error }: {
        locals?: Partial<{ userId: string, isAdmin: boolean }>;
        error?: Error;
    }) => {
        return jest.spyOn(AuthMiddleware, 'auth').mockImplementation(async (req, res, next) => {
            if(error) return next(error);
            Object.entries(locals).forEach(([key, value]) => {
                res.locals[key] = value;
            })
            next();
        })
    }

    afterEach(() => {
        jest.restoreAllMocks();
        jest.clearAllMocks();
    })
    
    describe('GET /users/me', () => {
        it('should return the user if a valid authorization token is provided', async () => {
            const user = mockUser(['password']);

            mockAuthMiddleware({ locals: { userId: user.id } });
            const getUserSpy = jest.spyOn(UserQueries, 'getUserById').mockResolvedValue(user);

            const response = await request.get('/users/me');

            expect(response.status).toBe(200);
            expect(response.body).toEqual(user);
            expect(getUserSpy).toHaveBeenCalledWith(user.id);
        })
        it('should return a 401 status code if the provided token is invalid', async () => {
            mockAuthMiddleware({ error: new UnauthorizedError() });

            const response = await request.get('/users/me');

            expect(response.status).toBe(ERROR_CODES.UNAUTHORIZED);
            expect(response.body).toEqual({ message: new UnauthorizedError().message });
        })
        it('should return a 404 status code if the user does not exist', async () => {
            const id = 'nonexistant';

            mockAuthMiddleware({ locals: { userId: id } });
            jest.spyOn(UserQueries, 'getUserById').mockRejectedValue(new UserNotFoundError());

            const response = await request.get('/users/me');

            expect(response.status).toBe(ERROR_CODES.NOT_FOUND);
            expect(response.body).toEqual({ message: new UserNotFoundError().message });
        })
    })

    describe('GET /users/:id', () => {
        const user = mockUser(['password']);

        it('should return the user with the matching id', async () => {
            const spy = jest.spyOn(UserQueries, 'getUserById').mockResolvedValue(user);

            const response = await request.get(`/users/${user.id}`);

            expect(response.status).toBe(200);
            expect(response.body).toEqual(user);
            expect(spy).toHaveBeenCalledWith(user.id);
        })
        it('should return a 404 status code if the user does not exist', async () => {
            const id = 'nonexistant';
            const error = new UserNotFoundError();

            jest.spyOn(UserQueries, 'getUserById').mockRejectedValue(error);

            const response = await request.get(`/users/${id}`);

            expect(response.status).toBe(ERROR_CODES.NOT_FOUND);
            expect(response.body).toEqual({ message: error.message });
        })
    })

    describe('POST /users', () => {
        const user = mockUser(['password']);

        beforeEach(() => {
            prismaMock.user.create.mockResolvedValue(user);
        })

        it('should create a new user and sign a token', async () => {
            const user = mockUser(['password']);
            const password = 'password';

            const spyCreateUser = jest.spyOn(UserMutations, 'createUser');
            const spySignToken = jest.spyOn(UserAuth, 'signToken');

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
        it('should delete a user if the logged user is an admin', async () => {
            const id = '1';
            const adminUserId = '2';

            mockAuthMiddleware({ locals: { userId: adminUserId, isAdmin: true } });
            const deleteUserSpy = jest.spyOn(UserMutations, 'deleteUser');

            const response = await request.delete(`/users/${id}`);

            expect(response.status).toBe(200);
            expect(response.body).toEqual({});

            expect(deleteUserSpy).toHaveBeenCalledWith(id);
        })
        it('should delete a user if the user is the owner', async () => {
            const id = '1';

            mockAuthMiddleware({ locals: { userId: id } });
            const deleteUserSpy = jest.spyOn(UserMutations, 'deleteUser');

            const response = await request.delete(`/users/${id}`);

            expect(response.status).toBe(200);
            expect(response.body).toEqual({});

            expect(deleteUserSpy).toHaveBeenCalledWith(id);
        })
        it('should return a 401 status code if the user is not the owner or an admin', async () => {
            const id = '1';

            mockAuthMiddleware({ locals: { userId: '2' } });
            const deleteUserSpy = jest.spyOn(UserMutations, 'deleteUser');

            const response = await request.delete(`/users/${id}`);

            expect(response.status).toBe(ERROR_CODES.UNAUTHORIZED);
            expect(response.body).toEqual({ message: new UnauthorizedError().message });
            expect(deleteUserSpy).not.toHaveBeenCalled();
        })
        it('should return a 404 status code if the user does not exist', async () => {
            const id = 'nonexistant';

            mockAuthMiddleware({ locals: { userId: '1', isAdmin: true } });
            jest.spyOn(UserMutations, 'deleteUser').mockRejectedValue(new UserNotFoundError());

            const response = await request.delete(`/users/${id}`);

            expect(response.status).toBe(ERROR_CODES.NOT_FOUND);
            expect(response.body).toEqual({ message: new UserNotFoundError().message });
        })
    })
    describe('PATCH /users/:id', () => {
        it('should update a user if the logged in user is an admin', async () => {
            const user = mockUser(['password']);
            const updatedUser = { ...user, username: 'newUsername' };

            mockAuthMiddleware({ locals: { userId: '2', isAdmin: true } });
            const updateUserSpy = jest.spyOn(UserMutations, 'updateUser').mockResolvedValue(updatedUser);

            const updatedProperties = { username: updatedUser.username };
            const response = await request.patch(`/users/${user.id}`).send(updatedProperties);

            expect(response.status).toBe(200);
            expect(response.body).toEqual(updatedUser);
            expect(updateUserSpy).toHaveBeenCalledWith(user.id, updatedProperties);
        });
        it('should update a user if the logged in user is the owner', async () => {
            const user = mockUser(['password']);
            const updatedUser = { ...user, username: 'newUsername' };

            mockAuthMiddleware({ locals: { userId: user.id } });
            const updateUserSpy = jest.spyOn(UserMutations, 'updateUser').mockResolvedValue(updatedUser);

            const updatedProperties = { username: updatedUser.username };
            const response = await request.patch(`/users/${user.id}`).send(updatedProperties);

            expect(response.status).toBe(200);
            expect(response.body).toEqual(updatedUser);
            expect(updateUserSpy).toHaveBeenCalledWith(user.id, updatedProperties);
        });
        it('should return a 401 status code if isAdmin is passed and the logged in user is not an admin', async () => {
            const user = mockUser(['password']);
            const updatedUser = { ...user, isAdmin: true };

            mockAuthMiddleware({ locals: { userId: user.id, isAdmin: false } });
            const updateUserSpy = jest.spyOn(UserMutations, 'updateUser').mockResolvedValue(updatedUser);

            const response = await request.patch(`/users/${user.id}`).send({ isAdmin: updatedUser.isAdmin });

            expect(response.status).toBe(ERROR_CODES.UNAUTHORIZED);
            expect(response.body).toEqual({ message: new UnauthorizedError().message });
            expect(updateUserSpy).not.toHaveBeenCalled();
        })
        it('should return a 401 status code if the user is not the owner or an admin', async () => {
            const user = mockUser(['password']);
            const updatedUser = { ...user, username: 'newUsername' };

            mockAuthMiddleware({ locals: { userId: '2', isAdmin: false } });
            const updateUserSpy = jest.spyOn(UserMutations, 'updateUser').mockResolvedValue(updatedUser);

            const response = await request.patch(`/users/${user.id}`).send({ username: updatedUser.username });

            expect(response.status).toBe(ERROR_CODES.UNAUTHORIZED);
            expect(response.body).toEqual({ message: new UnauthorizedError().message });
            expect(updateUserSpy).not.toHaveBeenCalled();
        });
        it('should return a 404 status code if the user does not exist', async () => {
            const id = 'nonexistant';

            mockAuthMiddleware({ locals: { userId: '1', isAdmin: true } });
            const updateUserSpy = jest.spyOn(UserMutations, 'updateUser').mockRejectedValue(new UserNotFoundError());

            const response = await request.patch(`/users/${id}`).send({ username: 'newUsername' });

            expect(response.status).toBe(ERROR_CODES.NOT_FOUND);
            expect(response.body).toEqual({ message: new UserNotFoundError().message });
        });
        it('should throw an error if unknown fields are passed', async () => {
            const user = mockUser(['password']);

            mockAuthMiddleware({ locals: { userId: user.id } });

            const errorMessage = 'Invalid property: unknown';

            const updatedProperties = { unknown: 'field' };
            const response = await request.patch(`/users/${user.id}`).send(updatedProperties);

            expect(response.body).toEqual({ message: errorMessage });
        })
        describe.each([
            { id: 'newid' },
            { createdAt: 'newDate' },
        ])(`if immutable fields are passed`, (data) => {
            it('should not update the user', async () => {
                const user = mockUser(['password']);

                const errorMessage = 'Invalid property: ' + Object.keys(data)[0];

                const response = await request.patch(`/users/${user.id}`).send(data);

                expect(response.status).toBe(ERROR_CODES.BAD_REQUEST);
                expect(response.body).toEqual({ message: errorMessage });
            })
        })
    })
})