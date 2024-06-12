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
        const mockCreateUser = (user: Omit<User, 'password'>) => jest.spyOn(UserMutations, 'createUser').mockResolvedValue(user);
        const mockCreateUserError = (error: Error) => jest.spyOn(UserMutations, 'createUser').mockRejectedValue(error);

        const user = mockUser();
        const userWithoutPassword = exclude(user, ['password']);
        const postData = { username: user.username, password: user.password };

        it('creates the user and returns a user object', async () => {
            const createUserSpy = mockCreateUser(userWithoutPassword);

            const result = await request.post('/users').send(postData);

            expect(result.status).toBe(200);
            expect(result.body).toEqual(userWithoutPassword);
            expect(createUserSpy).toHaveBeenCalledWith(postData);
        })
        it('calls the validateCreateUserInput function to ensure user input validation', async () => {
            const createUserSpy = mockCreateUser(userWithoutPassword);
            const validateCreateUserInputSpy = jest.spyOn(UserUtils, 'validateCreateUserInput');

            const result = await request.post('/users').send(postData);

            expect(result.status).toBe(200);
            expect(result.body).toEqual(userWithoutPassword);
            expect(createUserSpy).toHaveBeenCalledWith(postData);
            expect(validateCreateUserInputSpy).toHaveBeenCalledWith(postData);
        })
    })
})