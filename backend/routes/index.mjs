import { Router } from 'express';
import userRoutes from './user.routes.mjs';
import threadRoutes from './thread.routes.mjs';
import { requireAuth } from '../middleware/requireAuth.mjs';

const router = Router();

router.use('/users', userRoutes);

router.use(requireAuth);

router.use('/threads', threadRoutes);

export default router;
