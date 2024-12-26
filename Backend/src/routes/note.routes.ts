import { Router } from "express";
import { authenticateSession } from "../middleware/auth";
import {
  addNote,
  deleteNote,
  getNoteById,
  getNotes,
  updateNote,
} from "../controller/note.controller";

const router = Router();

router.route("/").get(authenticateSession, getNotes);
router.route("/add").post(authenticateSession, addNote);
router
  .route("/:noteId")
  .delete(authenticateSession, deleteNote)
  .get(authenticateSession, getNoteById)
  .put(authenticateSession, updateNote);

export default router;
