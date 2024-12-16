import { Router } from 'express';
import userRoutes from './user.routes.mjs';
import threadRoutes from './thread.routes.mjs';

const router = Router();

router.use('/users', userRoutes);
router.use('/threads', threadRoutes);

export default router;
