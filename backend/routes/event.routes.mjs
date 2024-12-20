// routes/event.routes.mjs
import { Router } from "express";
import { createEvent, getEvents, rsvpEvent } from "../controllers/event.controller.mjs";
import { requireAuth } from "../middleware/requireAuth.mjs";

const router = Router();

router.post("/create", requireAuth, createEvent);
router.get("/", getEvents);
router.post("/rsvp", requireAuth, rsvpEvent);

export default router;
