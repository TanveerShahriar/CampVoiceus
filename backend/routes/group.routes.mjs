import { Router } from "express";
import {
  createGroup,
  getAllGroups,
  joinGroup,
  leaveGroup,
  createPost,
  getGroupPosts,
  getPostDetails,
  interactWithPost,
  getMyGroups,
  upvotePost,
  downvotePost,
} from "../controllers/group.controller.mjs";
import { requireAuth } from "../middleware/requireAuth.mjs";

const router = Router();

router.use(requireAuth);

router.post("/create", createGroup);
router.get("/allgroups", getAllGroups);
router.get("/mine", getMyGroups);
router.post("/:groupId/join", joinGroup);
router.post("/:groupId/leave", leaveGroup);
router.post("/:groupId/post", createPost);
router.get("/:groupId/posts", getGroupPosts);
router.get("/:groupId/posts/:postId", getPostDetails);
router.post("/:groupId/posts/:postId/interact", interactWithPost);
router.post("/:groupId/posts/:postId/upvote", upvotePost);
router.post("/:groupId/posts/:postId/downvote", downvotePost);

export default router;
