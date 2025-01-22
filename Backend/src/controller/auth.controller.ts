import { Request, Response } from "express";
import prisma from "../db/db";
import {
  generateAccessToken,
  generateRefreshToken,
  verifyRefreshToken,
} from "../utils/auth";
import { asyncHandler } from "../utils/asyncHandler";
import { ApiResponse } from "../utils/ApiResponse";
import { ApiError } from "../utils/ApiError";

export const googleLoginSuccess = asyncHandler(
  async (req: any, res: Response) => {
    try {
      const { user } = req.user;

      const deviceInfo = req.deviceInfo;

      const refreshToken = await generateRefreshToken({
        sessionId: req.user.sessionId,
      });

      const session = await prisma.session.create({
        data: {
          userId: user.id,
          refreshToken,
          deviceInfo,
          sessionId: req.user.sessionId,
          expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        },
      });
      const accessToken = await generateAccessToken({
        userId: user.id,
        sessionId: session.sessionId,
      });

      return res
        .status(200)
        .cookie("access_token", accessToken, {
          httpOnly: true,
          secure: true,
          sameSite: "none",
          maxAge: 15 * 60 * 1000,
        })
        .cookie("refresh_token", refreshToken, {
          httpOnly: true,
          secure: true,
          sameSite: "none",
          maxAge: 30 * 24 * 60 * 60 * 1000,
        })
        .redirect("http://localhost:5173/");
    } catch (error) {
      console.log(error);
      throw new ApiError(401, JSON.stringify(error) || "Error logging in", [
        "Error logging in",
      ]);
    }
  }
);

export const getCurrentSession = asyncHandler(
  async (req: Request, res: Response) => {
    try {
      if (!req.user) {
        throw new ApiError(401, "Unauthorized Access. Please login again.", [
          "Unauthorized Access. Please login again.",
        ]);
      }

      const currentSession = req.currentSession;
      const currentUser = req.user;
      res
        .status(200)
        .json(
          new ApiResponse(
            200,
            { currentSession, currentUser },
            "Fetched current session successfully"
          )
        );
    } catch (error) {
      throw new ApiError(
        401,
        JSON.stringify(error) || "Error fetching current session",
        ["Error fetching current session"]
      );
    }
  }
);

export const getCuurentUser = asyncHandler(
  async (req: Request, res: Response) => {
    try {
      if (!req.user) {
        throw new ApiError(401, "Unauthorized Access. Please login again.", [
          "Unauthorized Access. Please login again.",
        ]);
      }
      const currentUser = req.user;
      res
        .status(200)
        .json(
          new ApiResponse(200, currentUser, "Fetch current user successfully")
        );
    } catch (error) {
      throw new ApiError(
        401,
        JSON.stringify(error) || "Error fetching current user",
        ["Error fetching current user"]
      );
    }
  }
);

export const logout = asyncHandler(async (req: Request, res: Response) => {
  try {
    if (!req.currentSession) {
      res.status(401).json({ message: "No Active session" });
      return;
    }

    await prisma.session.delete({
      where: { id: req.currentSession.id },
    });

    const options = {
      httpOnly: true,
      secure: true,
    };

    return res
      .status(200)
      .clearCookie("access_Token", options)
      .clearCookie("refresh_Token", options)
      .json(new ApiResponse(200, {}, "User logged out successfully"));
  } catch (error) {
    throw new ApiError(401, "Error logging out", ["Error logging out"]);
  }
});

export const refreshAccessToken = asyncHandler(
  async (req: Request, res: Response) => {
    const incomingRefreshToken =
      req.cookies?.refresh_token || req.body.refresh_token;
    if (!incomingRefreshToken) {
      throw new ApiError(401, "Unauthorized request", [
        "No refresh token provided",
      ]);
    }
    try {
      const decodedToken = await verifyRefreshToken(incomingRefreshToken);

      const session = await prisma.session.findUnique({
        where: { sessionId: decodedToken?.sessionId },
        include: { user: true },
      });
      const options = {
        httpOnly: true,
        secure: true,
      };
      if (!session) {
        return res
          .status(401)
          .clearCookie("access_Token", options)
          .clearCookie("refresh_Token", options)
          .json(new ApiResponse(401, {}, "Invalid session"));
      }
      if (session.expiresAt < new Date()) {
        await prisma.session.delete({
          where: { id: session.id },
        });
        return res
          .status(401)
          .clearCookie("access_Token", options)
          .clearCookie("refresh_Token", options)
          .json(new ApiResponse(401, {}, "Session Expired"));
      }
      const accessToken = await generateAccessToken({
        userId: session.userId,
        sessionId: session.sessionId,
      });

      await prisma.session.update({
        where: { id: session.id },
        data: { lastUsedAt: new Date() },
      });

      res
        .status(200)
        .cookie("access_token", accessToken, {
          httpOnly: true,
          secure: true,
          sameSite: "none",
          maxAge: 15 * 60 * 1000,
        })
        .json(new ApiResponse(200, { accessToken }, "Access token refreshed"));
    } catch (error) {
      console.log(error);
      const options = {
        httpOnly: true,
        secure: true,
      };
      res.clearCookie("access_token", options);
      res.clearCookie("refresh_token", options);
      throw new ApiError(401, "Invalid refresh token", [
        "Invalid refresh token",
      ]);
    }
  }
);
