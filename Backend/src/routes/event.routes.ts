import { Router } from "express";
import { authenticateSession } from "../middleware/auth";
import { addEvent, getAllEvents } from "../controller/event.controller";

const router = Router();

router.route("/add").post(authenticateSession, addEvent);
router.route("/").get(authenticateSession, getAllEvents);

export default router;
