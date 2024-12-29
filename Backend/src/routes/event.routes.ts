import { Router } from "express";
import { authenticateSession } from "../middleware/auth";
import { addEvent } from "../controller/event.controller";

const router = Router();

router.route("/add").post(authenticateSession, addEvent);

export default router;
