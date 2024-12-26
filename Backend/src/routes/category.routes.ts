import { Router } from "express";
import { authenticateSession } from "../middleware/auth";
import {
  createCategory,
  deleteCategory,
  getCategories,
  updateCategory,
} from "../controller/category.controller";

const router = Router();

router.route("/add").post(authenticateSession, createCategory);
router
  .route("/:categoryId")
  .delete(authenticateSession, deleteCategory)
  .patch(authenticateSession, updateCategory);
router.route("/").get(authenticateSession, getCategories);

export default router;
