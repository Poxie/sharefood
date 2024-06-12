import asyncHandler from '@/utils/asyncHandler';
import { COOKIE_AGE } from '@/utils/constants';
import UserAuth from '@/utils/users/userAuth';
import express from 'express';

const router = express.Router();

router.post('/', asyncHandler(async (req, res) => {
    const { username, password } = req.body;

    const user = await UserAuth.authenticateUser(username, password);

    const token = UserAuth.signToken(user.id);
    res.cookie('accessToken', token, {
        maxAge: COOKIE_AGE,
    });

    res.send(user);
}))

export default router;