import { Router } from 'express';
import { ThreadController } from '../controllers/index.mjs';

const router = Router();

router.post('/createthread', ThreadController.createThread);

export default router;