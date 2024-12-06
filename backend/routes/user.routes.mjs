import { Router } from 'express';
import { UserController } from '../controllers/index.mjs';

const router = Router();

router.get('/', UserController.welcome);
router.post('/register', UserController.registerUser);

export default router;
