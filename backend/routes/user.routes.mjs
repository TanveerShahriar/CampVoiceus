import { Router } from 'express';
import multer from 'multer';
import { UserController } from '../controllers/index.mjs';
import { requireAuth } from '../middleware/requireAuth.mjs';

const router = Router();
const upload = multer({ storage: multer.memoryStorage() });

router.get('/', UserController.welcome);
router.post('/register', UserController.registerUser);
router.post('/login', UserController.loginUser);

router.use(requireAuth);

router.post('/getuserbyid', UserController.getUserById);

// get user by username
router.get('/profile/:username', UserController.getUserByUsername);

router.get('/token', UserController.getUserByToken);

router.put('/profile/edit', upload.single('avatarUrl'), UserController.updateUserByUsername);

export default router;
