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
import asyncHandler from '@/utils/asyncHandler';

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

router.post('/', asyncHandler(async (req: Request, res: Response) => {
    const data = req.body;

    UserUtils.validateCreateUserInput(data);

    const user = await UserMutations.createUser(data);

    const accessToken = UserAuth.signToken(user.id);
    res.cookie('accessToken', accessToken, {
        maxAge: COOKIE_AGE,
    });

    res.send(user);
}));

router.delete('/:id', auth, asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const { userId, isAdmin } = res.locals;

    if(userId !== id && !isAdmin) {
        throw new UnauthorizedError();
    }

    await UserMutations.deleteUser(id);

    res.status(204).end();
}))

router.patch('/:id', auth, asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const { userId, isAdmin } = res.locals;

    if(userId !== id && !isAdmin) {
        throw new UnauthorizedError();
    }

    const data = req.body;

    UserUtils.validateUpdateUserInput(data);
    
    const user = await UserMutations.updateUser(id, data);

    res.send(user);
}))

export default router;