import { Router } from 'express';
import users from '../controllers/users';
import recipes from '../controllers/recipes';

const router = Router();

router.use('/users', users);
router.use('/recipes', recipes);

export default router;