import express, { NextFunction, Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import Users from '../utils/users';
import { UsernameAlreadyTakenError } from '@/errors/UsernameAlreadyTakenError';
import ArgumentMissingError from '@/errors/ArgumentMissingError';
import { signToken, verifyToken } from '@/utils/auth';
import UserNotFoundError from '@/errors/UserNotFoundError';
import UnauthorizedError from '@/errors/UnauthorizedError';
import auth from '@/middleware/auth';
import { ALLOWED_USER_FIELDS } from '@/utils/constants';
import BadRequestError from '@/errors/BadRequestError';

const prisma = new PrismaClient();
const router = express.Router();

router.get('/', async (req: Request, res: Response) => {
    const users = await prisma.user.findMany();
    res.send(users);
});

router.post('/', async (req: Request, res: Response, next: NextFunction) => {
    const { username, password } = req.body;

    if(!username) return next(new ArgumentMissingError('Username is missing.'));
    if(!password) return next(new ArgumentMissingError('Password is missing.'));

    try {
        const user = await Users.createUser({ 
            username, 
            password, 
        });

        const accessToken = signToken(user.id);

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
        await Users.deleteUser(id);
    } catch(error) {
        return next(error);
    }

    res.send({});
})

router.patch('/:id', auth, async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;

    const { userId, isAdmin } = res.locals;
    if(userId !== id && !isAdmin) {
        return next(new UnauthorizedError());
    }

    const data = req.body;

    try {
        const user = await Users.updateUser(id, data);
        res.send(user);
    } catch(error) {
        return next(error);
    }
})

export default router;