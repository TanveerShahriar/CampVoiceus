import { Router } from 'express';
import userRoutes from './user.routes.mjs';
import threadRoutes from './thread.routes.mjs';
import { requireAuth } from '../middleware/requireAuth.mjs';
import eventRoutes from "./event.routes.mjs";
import groupRoutes from "./group.routes.mjs";
const router = Router();

router.use('/users', userRoutes);

router.use(requireAuth);

router.use('/threads', threadRoutes);
router.use("/events", eventRoutes);
router.use("/groups", groupRoutes);
export default router;
