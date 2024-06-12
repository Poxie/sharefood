import express, { NextFunction, Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import ArgumentMissingError from '@/errors/ArgumentMissingError';
import UnauthorizedError from '@/errors/UnauthorizedError';
import { auth } from '@/middleware/auth';
import { COOKIE_AGE } from '@/utils/constants';
import UserQueries from '@/utils/users/userQueries';
import UserMutations from '@/utils/users/userMutations';
import UserAuth from '@/utils/users/userAuth';

const prisma = new PrismaClient();
const router = express.Router();

router.get('/', async (req: Request, res: Response) => {
    const users = await prisma.user.findMany();
    res.send(users);
});

router.get('/me', auth, async (req: Request, res: Response, next: NextFunction) => {
    const { userId } = res.locals;
    
    try {
        const user = await UserQueries.getUserById(userId);
        res.send(user);
    } catch(error) {
        next(error);
    }
});

router.get('/:id', async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;

    try {
        const user = await UserQueries.getUserById(id);
        res.send(user);
    } catch(error) {
        next(error);
    }
})

router.post('/', async (req: Request, res: Response, next: NextFunction) => {
    const { username, password } = req.body;

    if(!username) return next(new ArgumentMissingError('Username is missing.'));
    if(!password) return next(new ArgumentMissingError('Password is missing.'));

    try {
        const user = await UserMutations.createUser({ 
            username, 
            password, 
        });

        const accessToken = UserAuth.signToken(user.id);
        res.cookie('accessToken', accessToken, {
            maxAge: COOKIE_AGE,
        });

        return res.send({
            user,
            accessToken,
        });
    } catch(error) {
        return next(error);
    }
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

// TODO: Add checks for immutable & unknown fields, as those were removed from updateUser mutation function
router.patch('/:id', auth, async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;

    const { userId, isAdmin } = res.locals;
    if(userId !== id && !isAdmin) {
        return next(new UnauthorizedError());
    }

    const data = req.body;

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