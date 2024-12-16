import { Request, Response, NextFunction } from "express";
import { verifyAccessToken } from "../utils/auth";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const authenticateSession = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const accessToken = req.cookies["access-token"];

  if (!accessToken) {
    res.status(401).json({ message: "Unauthorized" });
    return;
  }

  const decoded = verifyAccessToken(accessToken);
  if (!decoded) {
    res.status(401).json({ message: "Invalid token" });
    return;
  }
  const session = await prisma.session.findUnique({
    where: {
      sessionId: decoded.sessionId,
    },
    include: {
      user: true,
    },
  });

  if (!session || session.expiresAt < new Date()) {
    res.status(401).json({ message: "Invalid or expired session" });
    return;
  }
  await prisma.session.update({
    where: { id: session.id },
    data: { lastUsedAt: new Date() },
  });

  req.user = session.user;
  req.currentSession = session;

  next();
};
