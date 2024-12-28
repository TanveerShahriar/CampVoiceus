import express from "express";
import { GroupController } from "../controllers/index.mjs";
import { requireAuth } from "../middleware/requireAuth.mjs";
import multer from 'multer';

const storage = multer.memoryStorage(); // Store file in memory as Buffer
const upload = multer({ storage });

const router = express.Router();

// Public: Fetch all groups
router.get("/allgroups", requireAuth,  GroupController.getAllGroups);

// Protected: Create a group
router.post("/create", requireAuth, GroupController.createGroup);

// Protected: Fetch groups joined by the user
router.get("/mine", requireAuth, GroupController.getJoinedGroups);

// Protected: Join a group
router.post("/:groupId/join", requireAuth, GroupController.joinGroup);

// Protected: Leave a group
router.post("/:groupId/leave", requireAuth, GroupController.leaveGroup);

router.post('/createthread', upload.single('file'), GroupController.createThread);
router.post('/groupthreads', GroupController.homeThreads);
router.post('/getthreadbyid', GroupController.getThreadById);
router.post('/upvote', GroupController.upvote);
router.post('/downvote', GroupController.downvote);
router.post('/comment', GroupController.comment);
router.get('/user/:userId', GroupController.getUserThreads);
router.post('/upvotecomment', GroupController.upvoteComment);
router.post('/downvotecomment', GroupController.downvoteComment);
router.post('/filedownload', GroupController.fileDownload);



export default router;
