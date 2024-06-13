import asyncHandler from '@/utils/asyncHandler';
import { COOKIE_AGE } from '@/utils/constants';
import LoginUtils from '@/utils/login/loginUtils';
import UserAuth from '@/utils/users/userAuth';
import express from 'express';

const router = express.Router();

router.post('/', asyncHandler(async (req, res) => {
    const data = LoginUtils.validateLoginInput(req.body);

    const user = await UserAuth.authenticateUser(data.username, data.password);

    const token = UserAuth.signToken(user.id);
    res.cookie('accessToken', token, {
        maxAge: COOKIE_AGE,
    });

    res.send(user);
}))

export default router;