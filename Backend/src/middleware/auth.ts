import { Request, Response, NextFunction } from "express";
import { verifyAccessToken } from "../utils/auth";
import { PrismaClient, Session } from "@prisma/client";
import { ApiError } from "../utils/ApiError";
import { UserDocument } from "../types/types";

const prisma = new PrismaClient();

export const authenticateSession = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const accessToken =
    req.cookies?.access_token ||
    req.header("Authorization")?.replace("Bearer ", "");

  if (!accessToken) {
    return next(
      new ApiError(401, "Unauthorized. Please try again", [
        "Unauthorized. Please try again",
      ])
    );
  }

  const decoded = verifyAccessToken(accessToken);

  if (!decoded) {
    return next(new ApiError(401, "Invalid token", ["Invalid token"]));
  }
  const session = await prisma.session.findUnique({
    where: {
      sessionId: decoded.sessionId,
    },
    omit: {
      refreshToken: true,
    },
    include: {
      user: true,
    },
  });

  if (!session || session.expiresAt < new Date()) {
    if (session) {
      await prisma.session.delete({
        where: {
          id: session.id,
        },
      });
    }
    throw new ApiError(401, "Invalid or expired session", [
      "Invalid or expired session",
    ]);
  }
  await prisma.session.update({
    where: { id: session.id },
    data: { lastUsedAt: new Date() },
  });

  req.user = session.user as UserDocument;
  req.currentSession = session;

  next();
};
