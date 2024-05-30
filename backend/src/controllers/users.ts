import express, { NextFunction, Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import Users from '../utils/users';
import { UsernameAlreadyTakenError } from '@/errors/UsernameAlreadyTakenError';
import ArgumentMissingError from '@/errors/ArgumentMissingError';
import { signToken } from '@/utils/auth';
import UserNotFoundError from '@/errors/UserNotFoundError';

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

router.delete('/:id', async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;

    try {
        await Users.deleteUser(id);
        return res.send({});
    } catch(error) {
        return next(error);
    }
})

export default router;