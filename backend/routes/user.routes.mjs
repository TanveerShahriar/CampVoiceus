import { Router } from 'express';
import { UserController } from '../controllers/index.mjs';
import { requireAuth } from '../middleware/requireAuth.mjs';

const router = Router();

router.get('/', UserController.welcome);
router.post('/register', UserController.registerUser);
router.post('/login', UserController.loginUser);

router.use(requireAuth);

router.post('/getuserbyid', UserController.getUserById);

export default router;
