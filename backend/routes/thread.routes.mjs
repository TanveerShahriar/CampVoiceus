import { Router } from 'express';
import { ThreadController } from '../controllers/index.mjs';
import multer from 'multer';

const storage = multer.memoryStorage(); // Store file in memory as Buffer
const upload = multer({ storage });

const router = Router();

router.post('/createthread', upload.single('file'), ThreadController.createThread);
router.post('/homethreads', ThreadController.homeThreads);
router.post('/getthreadbyid', ThreadController.getThreadById);
router.post('/upvote', ThreadController.upvote);
router.post('/downvote', ThreadController.downvote);
router.post('/comment', ThreadController.comment);
router.post('/upvotecomment', ThreadController.upvoteComment);
router.post('/downvotecomment', ThreadController.downvoteComment);
router.post('/filedownload', ThreadController.fileDownload);

export default router;