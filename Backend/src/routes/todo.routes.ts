import { Router } from "express";
import { authenticateSession } from "../middleware/auth";
import {
  addTodo,
  deleteTodo,
  getTodoById,
  getTodos,
  updateTodo,
} from "../controller/todo.controller";

const router = Router();

router.route("/add").post(authenticateSession, addTodo);
router
  .route("/:todoId")
  .delete(authenticateSession, deleteTodo)
  .put(authenticateSession, updateTodo)
  .get(authenticateSession, getTodoById);
router.route("/").get(authenticateSession, getTodos);

export default router;
