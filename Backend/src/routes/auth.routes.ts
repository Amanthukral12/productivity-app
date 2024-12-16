import { Router } from "express";
import passport from "passport";
import { googleLoginSuccess, logout } from "../controller/auth.controller";
import { trackDeviceInfo } from "../middleware/deviceInfo";
import { authenticateSession } from "../middleware/auth";

const router = Router();

router.get("/google", passport.authenticate("google", { scope: ["email"] }));
router.get(
  "/google/callback",
  trackDeviceInfo,
  passport.authenticate("google", { failureRedirect: "/" }),
  googleLoginSuccess
);
router.route("/logout").post(authenticateSession, logout);

export default router;
