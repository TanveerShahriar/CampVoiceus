import { Router } from 'express';
import multer from 'multer';
import { UserController } from '../controllers/index.mjs';
import { getNotifications } from '../controllers/notifcation.controller.mjs';
import { requireAuth } from '../middleware/requireAuth.mjs';

const router = Router();
const upload = multer({ storage: multer.memoryStorage() });

router.get('/', UserController.welcome);
router.post('/register', UserController.registerUser);
router.post('/login', UserController.loginUser);
router.post('/savefcmtoken', UserController.saveFcmToken);

router.use(requireAuth);

router.post('/getuserbyid', UserController.getUserById);

// get user by username
router.get('/profile/:username', UserController.getUserByUsername);

router.get('/token', UserController.getUserByToken);

router.put('/profile/edit', upload.single('avatarUrl'), UserController.updateUserByUsername);

router.put('/profile/expertise/edit', upload.single('expertCredentialsUrl'), UserController.updateExpertiseByUsername);

router.delete('/profile/expertise/delete', UserController.deleteExpertiseByUsername);

router.get('/notifications', getNotifications);

export default router;
