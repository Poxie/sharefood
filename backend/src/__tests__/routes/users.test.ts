import supertest from "supertest";
import app from "../../app";
import * as AuthMiddleware from '@/middleware/auth';
import { ERROR_CODES } from "@/errors/errorCodes";
import UserNotFoundError from "@/errors/UserNotFoundError";
import UnauthorizedError from "@/errors/UnauthorizedError";
import BadRequestError from "@/errors/BadRequestError";
import UserQueries from "@/utils/users/userQueries";
import UserMutations from "@/utils/users/userMutations";
import UserAuth from "@/utils/users/userAuth";
import { UserErrorMessages } from "@/utils/users/userErrorMessages";
import { UNRECOGNIZED_KEYS } from "@/utils/commonErrorMessages";
import { exclude, mockUser } from "../../../test-utils";
import { User } from "@prisma/client";
import UserUtils from "@/utils/users/userUtils";
import { UsernameAlreadyTakenError } from "@/errors/UsernameAlreadyTakenError";
import { ALLOWED_USER_FIELDS } from "@/utils/users/userConstants";

jest.mock('@/middleware/auth');

const request = supertest(app);

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

    const mockGetUserById = (user: Omit<User, 'password'> | null) => jest.spyOn(UserQueries, 'getUserById').mockResolvedValue(user);

    const userWithoutPassword = () => mockUser({excludedFields: ['password']});

    afterEach(() => {
        jest.clearAllMocks();
        jest.restoreAllMocks();
    })

    describe('Fetching users', () => {
        describe('GET /users/me', () => {
            it('returns the user based on the request cookies', async () => {
                const user = userWithoutPassword();
    
                const authSpy = mockAuthMiddleware({ locals: { userId: user.id } });
                const getUserSpy = mockGetUserById(user);
    
                const result = await request.get('/users/me');
    
                expect(result.status).toBe(200);
                expect(result.body).toEqual(user);
                expect(authSpy).toHaveBeenCalled();
                expect(getUserSpy).toHaveBeenCalledWith(user.id);
            })
            it('if the authentication fails, throw an UnauthorizedError', async () => {
                const error = new UnauthorizedError();
                const authSpy = mockAuthMiddleware({ error });
    
                const result = await request.get('/users/me');
    
                expect(result.status).toBe(ERROR_CODES.UNAUTHORIZED);
                expect(result.body).toEqual({ message: error.message });
                expect(authSpy).toHaveBeenCalled();
            })
            it('if the token is valid, but the user is not found, throw a UserNotFoundError', async () => {
                const userId = 'id';
    
                const authSpy = mockAuthMiddleware({ locals: { userId } });
                const getUserSpy = mockGetUserById(null);
    
                const result = await request.get('/users/me');
    
                expect(result.status).toBe(ERROR_CODES.NOT_FOUND);
                expect(result.body).toEqual({ message: new UserNotFoundError().message });
                expect(authSpy).toHaveBeenCalled();
                expect(getUserSpy).toHaveBeenCalledWith(userId);
            })
        })
    
        describe('GET /users/:id', () => {
            it('returns a user object based on the provided id', async () => {
                const user = userWithoutPassword();

                const getUserSpy = mockGetUserById(user);

                const result = await request.get(`/users/${user.id}`);

                expect(result.status).toBe(200);
                expect(result.body).toEqual(user);
                expect(getUserSpy).toHaveBeenCalledWith(user.id);
            })
            it('throws a UserNotFound error if the user does not exist', async () => {
                const userId = 'id';

                const getUserSpy = mockGetUserById(null);

                const result = await request.get(`/users/${userId}`);

                expect(result.status).toBe(ERROR_CODES.NOT_FOUND);
                expect(result.body).toEqual({ message: new UserNotFoundError().message });
                expect(getUserSpy).toHaveBeenCalledWith(userId);
            })
        })
    })
    
    describe('POST /users', () => {
        const user = mockUser();
        const userWithoutPassword = exclude(user, ['password']);
        const postData = { username: user.username, password: user.password };

        const mockCreateUser = (user: Omit<User, 'password'>) => jest.spyOn(UserMutations, 'createUser').mockResolvedValue(user);
        const mockCreateUserError = (error: Error) => jest.spyOn(UserMutations, 'createUser').mockRejectedValue(error);

        const expectSuccessfulResponse = (result: supertest.Response) => {
            expect(result.status).toBe(200);
            expect(result.body).toEqual(userWithoutPassword);
        }

        it('creates the user and returns a user object', async () => {
            const createUserSpy = mockCreateUser(userWithoutPassword);

            const result = await request.post('/users').send(postData);

            expectSuccessfulResponse(result);
            expect(createUserSpy).toHaveBeenCalledWith(postData);
        })
        it('signs a token and sets it as a cookie after successfully creating the user', async () => {
            const token = 'accesstoken';
            
            const createUserSpy = mockCreateUser(userWithoutPassword);
            const signTokenSpy = jest.spyOn(UserAuth, 'signToken').mockReturnValue(token);

            const result = await request.post('/users').send(postData);

            expectSuccessfulResponse(result);
            expect(createUserSpy).toHaveBeenCalledWith(postData);
            expect(signTokenSpy).toHaveBeenCalledWith(user.id);
            expect(result.headers['set-cookie'].at(0)).toMatch(new RegExp(`^accessToken=${token}`));
        })
        it('calls the validateCreateUserInput function to ensure user input validation', async () => {
            const createUserSpy = mockCreateUser(userWithoutPassword);
            const validateCreateUserInputSpy = jest.spyOn(UserUtils, 'validateCreateUserInput');

            const result = await request.post('/users').send(postData);

            expectSuccessfulResponse(result);
            expect(createUserSpy).toHaveBeenCalledWith(postData);
            expect(validateCreateUserInputSpy).toHaveBeenCalledWith(postData);
        })
        it('throws a UsernameAlreadyTaken error if the username is already taken', async () => {
            const error = new UsernameAlreadyTakenError();

            const createUserSpy = mockCreateUserError(error);

            const result = await request.post('/users').send(postData);

            expect(result.status).toBe(ERROR_CODES.UNAUTHORIZED);
            expect(result.body).toEqual({ message: error.message });
            expect(createUserSpy).toHaveBeenCalledWith(postData);
        })
    })

    describe('DELETE /users/:id', () => {
        const mockDeleteUser = () => jest.spyOn(UserMutations, 'deleteUser').mockResolvedValue(true);
        const mockDeleteUserError = (error: Error) => jest.spyOn(UserMutations, 'deleteUser').mockRejectedValue(error);

        it('deletes the user based on the provided id', async () => {
            const user = userWithoutPassword();

            const authSpy = mockAuthMiddleware({ locals: { userId: user.id } });
            const deleteUserSpy = mockDeleteUser();

            const result = await request.delete(`/users/${user.id}`);

            expect(result.status).toBe(204);
            expect(authSpy).toHaveBeenCalled();
            expect(deleteUserSpy).toHaveBeenCalledWith(user.id);
        })
        it('throws an unauthorized error if the user being deleted is not the logged in as the user', async () => {
            const user = userWithoutPassword();
            const error = new UnauthorizedError();

            const deleteUserSpy = mockDeleteUser();
            const authSpy = mockAuthMiddleware({ locals: { userId: 'differentid', isAdmin: false } });

            const result = await request.delete(`/users/${user.id}`);

            expect(result.status).toBe(ERROR_CODES.UNAUTHORIZED);
            expect(result.body).toEqual({ message: error.message });
            expect(authSpy).toHaveBeenCalled();
            expect(deleteUserSpy).not.toHaveBeenCalled();
        })
        it('allows admins to delete any user', async () => {
            const user = userWithoutPassword();

            const authSpy = mockAuthMiddleware({ locals: { userId: 'differentid', isAdmin: true } });
            const deleteUserSpy = mockDeleteUser();

            const result = await request.delete(`/users/${user.id}`);

            expect(result.status).toBe(204);
            expect(authSpy).toHaveBeenCalled();
            expect(deleteUserSpy).toHaveBeenCalledWith(user.id);
        })
    })

    describe('PATCH /users/:id', () => {
        const mockUpdateUser = (user: User) => jest.spyOn(UserMutations, 'updateUser').mockResolvedValue(user);

        it('updates the users information based on the provided id', async () => {
            const user = userWithoutPassword();
            const updateUser = { ...user, username: 'newusername' };
            const updateData = { username: updateUser.username };

            const authSpy = mockAuthMiddleware({ locals: { userId: user.id } });
            const updateUserSpy = mockUpdateUser(updateUser);

            const result = await request.patch(`/users/${user.id}`).send(updateData);

            expect(result.status).toBe(200);
            expect(result.body).toEqual(updateUser);
            expect(authSpy).toHaveBeenCalled();
            expect(updateUserSpy).toHaveBeenCalledWith(user.id, updateData);
        })
        it('throws an unauthorized error if the user being updated is not the logged in as the user', async () => {
            const user = userWithoutPassword();
            const error = new UnauthorizedError();

            const authSpy = mockAuthMiddleware({ locals: { userId: 'differentid' } });
            const updateUserSpy = mockUpdateUser(user);

            const result = await request.patch(`/users/${user.id}`).send({ username: 'newusername' });

            expect(result.status).toBe(ERROR_CODES.UNAUTHORIZED);
            expect(result.body).toEqual({ message: error.message });
            expect(authSpy).toHaveBeenCalled();
            expect(updateUserSpy).not.toHaveBeenCalled();
        })
        it('allows updates the user information if the user in an admin', async () => {
            const user = userWithoutPassword();
            const updateUser = { ...user, username: 'newusername' };
            const updateData = { username: updateUser.username };

            const authSpy = mockAuthMiddleware({ locals: { userId: 'differentid', isAdmin: true } });
            const updateUserSpy = mockUpdateUser(updateUser);

            const result = await request.patch(`/users/${user.id}`).send(updateData);

            expect(result.status).toBe(200);
            expect(result.body).toEqual(updateUser);
            expect(authSpy).toHaveBeenCalled();
            expect(updateUserSpy).toHaveBeenCalledWith(user.id, updateData);
        })
    })
})