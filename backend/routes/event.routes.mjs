// routes/event.routes.mjs
import { Router } from "express";
import { createEvent, getEvents, rsvpEvent, cancelRSVP, getMyEvents } from "../controllers/event.controller.mjs";
import { requireAuth } from "../middleware/requireAuth.mjs";

const router = Router();

router.post("/create", requireAuth, createEvent);
router.get("/", getEvents);
router.get("/myevents", requireAuth, getMyEvents);
router.post("/rsvp", requireAuth, rsvpEvent);
router.post("/cancel-rsvp", requireAuth, cancelRSVP);
export default router;
