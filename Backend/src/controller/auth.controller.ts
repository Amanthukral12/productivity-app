import { Request, Response } from "express";
import prisma from "../db/db";
import { v4 as uuidv4 } from "uuid";
import { generateAccessToken } from "../utils/auth";

export const googleLoginSuccess = async (req: any, res: Response) => {
  try {
    const user = req.user;
    const refreshToken = uuidv4();
    const deviceInfo = req.deviceInfo;

    const session = await prisma.session.create({
      data: {
        userId: user.id,
        refreshToken,
        deviceInfo,
        expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      },
    });
    const accessToken = generateAccessToken({
      userId: user.id,
      sessionId: session.sessionId,
    });
    res.cookie("access_tokem", accessToken, {
      httpOnly: true,
      secure: true,
      sameSite: "none",
      maxAge: 15 * 60 * 1000,
    });
    res.redirect("/");
  } catch (error) {
    res.status(500).json({ message: "Error Signing in" });
  }
};

export const logout = async (req: Request, res: Response): Promise<void> => {
  try {
    if (!req.currentSession) {
      res.status(401).json({ message: "No Active session" });
      return;
    }

    await prisma.session.delete({
      where: { id: req.currentSession.id },
    });

    res.clearCookie("access_token");

    res.status(200).json({ message: "Logged out successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error logging out" });
  }
};
