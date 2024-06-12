import express, { NextFunction, Request, Response } from 'express';
import { PrismaClient, User } from '@prisma/client';
import UnauthorizedError from '@/errors/UnauthorizedError';
import { auth } from '@/middleware/auth';
import { COOKIE_AGE } from '@/utils/constants';
import UserQueries from '@/utils/users/userQueries';
import UserMutations from '@/utils/users/userMutations';
import UserAuth from '@/utils/users/userAuth';
import { ALLOWED_USER_FIELDS } from '@/utils/users/userConstants';
import { UserSchema, userSchema } from '@/utils/users/userSchema';
import UserNotFoundError from '@/errors/UserNotFoundError';
import UserUtils from '@/utils/users/userUtils';

const prisma = new PrismaClient();
const router = express.Router();

router.get('/me', auth, async (req: Request, res: Response, next: NextFunction) => {
    const { userId } = res.locals;

    if(!userId) return next(new UserNotFoundError());
    
    const user = await UserQueries.getUserById(userId);
    if(!user) return next(new UserNotFoundError());

    res.send(user);
});

router.get('/:id', async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;

    const user = await UserQueries.getUserById(id);
    if(!user) return next(new UserNotFoundError());

    res.send(user);
})

router.post('/', async (req: Request, res: Response, next: NextFunction) => {
    const data = req.body;

    UserUtils.validateCreateUserInput(data);

    const user = await UserMutations.createUser(data);

    const accessToken = UserAuth.signToken(user.id);
    res.cookie('accessToken', accessToken, {
        maxAge: COOKIE_AGE,
    });

    return res.send(user);
});

router.delete('/:id', auth, async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;

    const { userId, isAdmin } = res.locals;
    if(userId !== id && !isAdmin) return next(new UnauthorizedError());
    
    try {
        await UserMutations.deleteUser(id);
    } catch(error) {
        return next(error);
    }

    res.send({});
})

router.patch('/:id', auth, async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;

    // If the logged in user is not an admin or the user being updated, throw an error
    const { userId, isAdmin } = res.locals;
    if(userId !== id && !isAdmin) {
        return next(new UnauthorizedError());
    }

    const data = req.body;

    // Validate the request body
    try {
        const allowedFields = ALLOWED_USER_FIELDS.reduce((obj, key) => {
            obj[key] = true;
            return obj;
        }, {} as Record<keyof UserSchema, true>);

        userSchema
            .pick(allowedFields)
            .strict()
            .partial()
            .parse(data);
    } catch(error) {
        next(error);
    }

    // If password is provided, hash it and replace the password property
    if(data.password) {
        data.password = await UserAuth.hashPassword(data.password);
    }

    // If logged in user is not an admin, they cannot change the isAdmin field
    if(data.isAdmin && !isAdmin) {
        return next(new UnauthorizedError());
    }

    try {
        const user = await UserMutations.updateUser(id, data);
        res.send(user);
    } catch(error) {
        return next(error);
    }
})

export default router;