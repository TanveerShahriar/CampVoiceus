import { Router } from 'express';
import { ThreadController } from '../controllers/index.mjs';

const router = Router();

router.post('/createthread', ThreadController.createThread);
router.post('/homethreads', ThreadController.homeThreads);

export default router;