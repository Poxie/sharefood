import express, { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import Users from '../utils/users';
import { UsernameAlreadyTakenError } from '@/errors/UsernameAlreadyTakenError';

const prisma = new PrismaClient();
const router = express.Router();

router.get('/', async (req: Request, res: Response) => {
    const users = await prisma.user.findMany();
    res.send(users);
});

router.post('/', async (req: Request, res: Response) => {
    const { username, password } = req.body;

    try {
        const user = await Users.createUser({ 
            username, 
            password, 
        })
        return res.send(user);
    } catch(error) {
        // If the username is already taken, return a 401 status code
        if(error instanceof UsernameAlreadyTakenError) {
            return res.status(error.statusCode).send(error.message);
        }
    }
});

export default router;