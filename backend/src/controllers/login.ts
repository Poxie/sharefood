import app from '@/app';
import BadRequestError from '@/errors/BadRequestError';
import Users from '@/utils/users';
import express from 'express';

const router = express.Router();

router.post('/', async (req, res, next) => {
    const { username, password } = req.body;

    if(!username) return next(new BadRequestError('Username is required.'));
    if(!password) return next(new BadRequestError('Password is required.'));

    try {
        const user = await Users.authenticate(username, password);
        res.send(user);
    } catch(error) {
        return next(error);
    }
})

export default router;