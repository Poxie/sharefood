import BadRequestError from '@/errors/BadRequestError';
import { COOKIE_AGE } from '@/utils/constants';
import UserAuth from '@/utils/users/userAuth';
import express from 'express';

const router = express.Router();

router.post('/', async (req, res, next) => {
    const { username, password } = req.body;

    if(!username) return next(new BadRequestError('Username is required.'));
    if(!password) return next(new BadRequestError('Password is required.'));

    try {
        const user = await UserAuth.authenticateUser(username, password);

        const token = UserAuth.signToken(user.id);
        res.cookie('accessToken', token, {
            maxAge: COOKIE_AGE,
        });

        res.send(user);
    } catch(error) {
        return next(error);
    }
})

export default router;