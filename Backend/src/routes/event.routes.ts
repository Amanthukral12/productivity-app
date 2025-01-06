import { Router } from "express";
import { authenticateSession } from "../middleware/auth";
import {
  addEvent,
  deleteEvent,
  getAllEventsForMonth,
  getEventById,
} from "../controller/event.controller";

const router = Router();

router.route("/add").post(authenticateSession, addEvent);
router.route("/").get(authenticateSession, getAllEventsForMonth);
router
  .route("/:eventId")
  .delete(authenticateSession, deleteEvent)
  .get(authenticateSession, getEventById);

export default router;
