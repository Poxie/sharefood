import app from '@/app';
import BadRequestError from '@/errors/BadRequestError';
import { signToken } from '@/utils/auth';
import { COOKIE_AGE } from '@/utils/constants';
import Users from '@/utils/users';
import express from 'express';

const router = express.Router();

router.post('/', async (req, res, next) => {
    const { username, password } = req.body;

    if(!username) return next(new BadRequestError('Username is required.'));
    if(!password) return next(new BadRequestError('Password is required.'));

    try {
        const user = await Users.authenticate(username, password);

        const token = signToken(user.id);
        res.cookie('accessToken', token, {
            maxAge: COOKIE_AGE,
        });

        res.send(user);
    } catch(error) {
        return next(error);
    }
})

export default router;