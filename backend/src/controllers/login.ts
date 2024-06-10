import app from '@/app';
import Users from '@/utils/users';
import express from 'express';

const router = express.Router();

router.post('/', async (req, res, next) => {
    const { username, password } = req.body;

    try {
        const user = await Users.authenticate(username, password);
        res.send(user);
    } catch(error) {
        return next(error);
    }
})

export default router;