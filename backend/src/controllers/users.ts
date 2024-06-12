import express, { NextFunction, Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import UnauthorizedError from '@/errors/UnauthorizedError';
import { auth } from '@/middleware/auth';
import { COOKIE_AGE } from '@/utils/constants';
import UserQueries from '@/utils/users/userQueries';
import UserMutations from '@/utils/users/userMutations';
import UserAuth from '@/utils/users/userAuth';
import { ALLOWED_USER_FIELDS } from '@/utils/users/userConstants';
import BadRequestError from '@/errors/BadRequestError';
import { userSchema } from '@/utils/users/userSchema';

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

    try {
        userSchema
            .pick({ username: true, password: true })
            .strict()
            .parse(req.body);
    } catch(error) {
        return next(error);
    }

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

// TODO: add constraints to values, such as character length & non empty values
router.patch('/:id', auth, async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;

    // If the logged in user is not an admin or the user being updated, throw an error
    const { userId, isAdmin } = res.locals;
    if(userId !== id && !isAdmin) {
        return next(new UnauthorizedError());
    }

    const data = req.body;

    // If invalid properties or values are provided
    for(const [prop, value] of Object.entries(data)) {
        if(!ALLOWED_USER_FIELDS.includes(prop)) {
            return next(new BadRequestError(`Invalid property: ${prop}`));
        }
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