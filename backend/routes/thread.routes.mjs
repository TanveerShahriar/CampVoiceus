import { Router } from 'express';
import { ThreadController } from '../controllers/index.mjs';

const router = Router();

router.post('/createthread', ThreadController.createThread);
router.post('/homethreads', ThreadController.homeThreads);
router.post('/getthreadbyid', ThreadController.getThreadById);
router.post('/upvote', ThreadController.upvote);
router.post('/downvote', ThreadController.downvote);
router.post('/comment', ThreadController.comment);
router.post('/upvotecomment', ThreadController.upvoteComment);
router.post('/downvotecomment', ThreadController.downvoteComment);

export default router;