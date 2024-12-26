import { Router } from "express";
import { authenticateSession } from "../middleware/auth";
import {
  createCategory,
  deleteCategory,
  getCategories,
} from "../controller/category.controler";

const router = Router();

router.route("/add").post(authenticateSession, createCategory);
router.route("/:categoryId").delete(authenticateSession, deleteCategory);
router.route("/").get(authenticateSession, getCategories);

export default router;
