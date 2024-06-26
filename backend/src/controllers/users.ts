import express, { Request, Response } from 'express';
import UnauthorizedError from '@/errors/UnauthorizedError';
import { auth } from '@/middleware/auth';
import { COOKIE_AGE } from '@/utils/constants';
import UserQueries from '@/utils/users/userQueries';
import UserMutations from '@/utils/users/userMutations';
import UserAuth from '@/utils/users/userAuth';
import UserNotFoundError from '@/errors/UserNotFoundError';
import UserUtils from '@/utils/users/userUtils';
import asyncHandler from '@/utils/asyncHandler';

const router = express.Router();

router.get('/me', auth, asyncHandler(async (req: Request, res: Response) => {
    // Thanks to the auth middleware, userId is guaranteed to be defined
    const userId = res.locals.userId!;
    
    const user = await UserQueries.getUserById(userId);
    if(!user) throw new UserNotFoundError();

    res.send(user);
}));

router.get('/:id', asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;

    const user = await UserQueries.getUserById(id);
    if(!user) throw new UserNotFoundError();

    res.send(user);
}))

router.post('/', asyncHandler(async (req: Request, res: Response) => {
    const data = UserUtils.validateCreateUserInput(req.body);

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

    const data = UserUtils.validateUpdateUserInput(req.body);
    
    const user = await UserMutations.updateUser(id, data);

    res.send(user);
}))

export default router;