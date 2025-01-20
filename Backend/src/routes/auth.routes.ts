import { Router } from "express";
import passport from "passport";
import {
  getCurrentSession,
  getCuurentUser,
  googleLoginSuccess,
  logout,
  refreshAccessToken,
} from "../controller/auth.controller";
import { trackDeviceInfo } from "../middleware/deviceInfo";
import { authenticateSession } from "../middleware/auth";

const router = Router();

router.get(
  "/auth/google",
  passport.authenticate("google", { scope: ["email"] })
);
router.get(
  "/auth/google/callback",
  trackDeviceInfo,
  passport.authenticate("google", { failureRedirect: "/" }),
  googleLoginSuccess
);
router.route("/auth/session").get(authenticateSession, getCurrentSession);
router.route("/auth/profile").get(authenticateSession, getCuurentUser);
router.route("/auth/logout").post(authenticateSession, logout);
router.route("/auth/refresh-token").post(refreshAccessToken);

export default router;
