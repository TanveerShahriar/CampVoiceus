import { Router } from 'express';
import { UserController } from '../controllers/index.mjs';

const router = Router();

router.get('/', UserController.getUser);

export default router;
