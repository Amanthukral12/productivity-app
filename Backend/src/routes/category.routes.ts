import { Router } from "express";
import { authenticateSession } from "../middleware/auth";
import { createCategory } from "../controller/category.controler";

const router = Router();

router.route("/add").post(authenticateSession, createCategory);

export default router;
