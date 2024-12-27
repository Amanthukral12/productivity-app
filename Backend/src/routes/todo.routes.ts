import { Router } from "express";
import { authenticateSession } from "../middleware/auth";
import {
  addTodo,
  deleteTodo,
  getTodos,
  updateTodo,
} from "../controller/todo.controller";

const router = Router();

router.route("/add").post(authenticateSession, addTodo);
router
  .route("/:todoId")
  .delete(authenticateSession, deleteTodo)
  .put(authenticateSession, updateTodo);
router.route("/").get(authenticateSession, getTodos);

export default router;
