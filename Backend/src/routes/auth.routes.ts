import { Router } from "express";
import passport from "passport";
import { googleLoginSuccess, logout } from "../controller/auth.controller";

const router = Router();

router.get("/google", passport.authenticate("google", { scope: ["email"] }));
router.get(
  "/google/callback",
  passport.authenticate("google", { failureRedirect: "/" }),
  googleLoginSuccess
);
router.get("/logout", logout);

export default router;
