import { Router } from "express";
import { authenticateSession } from "../middleware/auth";
import { addTodo, deleteTodo } from "../controller/todo.controller";

const router = Router();

router.route("/add").post(authenticateSession, addTodo);
router.route("/:todoId").delete(authenticateSession, deleteTodo);

export default router;
