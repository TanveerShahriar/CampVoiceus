import { Router } from "express";
import {
  createGroup,
  getAllGroups,
  getMyGroups,
  joinGroup,
  sendMessage,
  getMessages,
  postUpdate,
  getUpdates,
  createTask,
  getTasks,
} from "../controllers/group.controller.mjs";
import { requireAuth } from "../middleware/requireAuth.mjs";

const router = Router();

// Routes for group management
router.post("/create", requireAuth, createGroup); // Create a group
router.get("/", requireAuth, getAllGroups); // Fetch all groups
router.get("/mygroups", requireAuth, getMyGroups); // Fetch my groups
router.post("/:groupId/join", requireAuth, joinGroup); // Join a group

// Routes for messaging
router.post("/:groupId/message", requireAuth, sendMessage); // Send a message
router.get("/:groupId/messages", requireAuth, getMessages); // Fetch messages

// Routes for updates
router.post("/:groupId/update", requireAuth, postUpdate); // Post an update
router.get("/:groupId/updates", requireAuth, getUpdates); // Fetch updates

// Routes for tasks
router.post("/:groupId/task", requireAuth, createTask); // Create a task
router.get("/:groupId/tasks", requireAuth, getTasks); // Fetch tasks

export default router;
