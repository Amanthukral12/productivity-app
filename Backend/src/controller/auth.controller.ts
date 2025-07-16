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
import { UserDocument } from "../types/types";

export const googleLoginSuccess = asyncHandler(
  async (req: any, res: Response) => {
    const { user } = req.user;

    const deviceInfo = req.deviceInfo;

    const refreshToken = generateRefreshToken({
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
    const accessToken = generateAccessToken({
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
  }
);

export const getCurrentSession = asyncHandler(
  async (req: Request, res: Response) => {
    if (!req.user) {
      throw new ApiError(401, "Unauthorized Access. Please login again.", [
        "Unauthorized Access. Please login again.",
      ]);
    }

    const currentSession = req.currentSession;
    const currentUser = req.user;
    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          { currentSession, currentUser },
          "Fetched current session successfully"
        )
      );
  }
);

export const getCurrentUser = asyncHandler(
  async (req: Request, res: Response) => {
    if (!req.user) {
      throw new ApiError(401, "Unauthorized Access. Please login again.", [
        "Unauthorized Access. Please login again.",
      ]);
    }
    const currentUser = req.user;
    return res
      .status(200)
      .json(
        new ApiResponse(200, currentUser, "Fetch current user successfully")
      );
  }
);

export const logout = asyncHandler(async (req: Request, res: Response) => {
  if (!req.currentSession) {
    throw new ApiError(401, "No active session", ["No Active session"]);
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
});

export const refreshAccessToken = asyncHandler(
  async (req: Request, res: Response) => {
    const incomingRefreshToken =
      req.cookies?.refresh_token || req.body.refresh_token;
    if (!incomingRefreshToken) {
      const options = {
        httpOnly: true,
        secure: true,
      };
      res.clearCookie("access_token", options);
      res.clearCookie("refresh_token", options);
      throw new ApiError(401, "Unauthorized request", [
        "No refresh token provided",
      ]);
    }

    const decodedToken = verifyRefreshToken(incomingRefreshToken);

    const session = await prisma.session.findUnique({
      where: { sessionId: decodedToken?.sessionId },
    });
    const options = {
      httpOnly: true,
      secure: true,
    };
    if (!session) {
      res
        .status(401)
        .clearCookie("access_Token", options)
        .clearCookie("refresh_Token", options);
      throw new ApiError(401, "Invalid session", ["Invalid session"]);
    }
    if (session.expiresAt < new Date()) {
      await prisma.session.delete({
        where: { id: session.id },
      });
      res
        .status(401)
        .clearCookie("access_Token", options)
        .clearCookie("refresh_Token", options);
      throw new ApiError(401, "Session Expired. Please login again", [
        "Session Expired. Please login again",
      ]);
    }
    const accessToken = generateAccessToken({
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
  }
);

export const getAllSessions = asyncHandler(
  async (req: Request, res: Response) => {
    if (!req.user) {
      throw new ApiError(401, "Unauthorized Access. Please login again.", [
        "Unauthorized Access. Please login again.",
      ]);
    }

    const userId = (req.user as UserDocument).id;

    const sessions = await prisma.session.findMany({
      where: { userId },
      omit: {
        refreshToken: true,
      },
    });

    if (!sessions) {
      throw new ApiError(404, "No sessions found", ["No sessions found"]);
    }

    return res
      .status(200)
      .json(new ApiResponse(200, sessions, "Sessions fetched successfully"));
  }
);

export const updateUserProfile = asyncHandler(
  async (req: Request, res: Response) => {
    if (!req.user) {
      throw new ApiError(401, "Unauthorized Access. Please login again.", [
        "Unauthorized Access. Please login again.",
      ]);
    }
    const userId = (req.user as UserDocument).id;

    const { name } = req.body;

    const userDetails = await prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        name: name !== undefined ? name : undefined,
      },
    });

    return res
      .status(200)
      .json(new ApiResponse(200, userDetails, "User updated successfully"));
  }
);
