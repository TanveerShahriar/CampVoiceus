import { Router } from 'express';
import { UserController } from '../controllers/index.mjs';

const router = Router();

router.get('/', UserController.welcome);
router.post('/register', UserController.registerUser);
router.post('/login', UserController.loginUser);

export default router;
