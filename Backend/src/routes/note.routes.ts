import { Router } from "express";
import { authenticateSession } from "../middleware/auth";
import { addNote, getNotes } from "../controller/note.controller";

const router = Router();

router.route("/").get(authenticateSession, getNotes);
router.route("/add").post(authenticateSession, addNote);

export default router;
