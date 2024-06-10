import { Router } from 'express';
import login from '../controllers/login';
import users from '../controllers/users';
import recipes from '../controllers/recipes';

const router = Router();

router.use('/login', login);
router.use('/users', users);
router.use('/recipes', recipes);

export default router;