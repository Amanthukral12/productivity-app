import jwt from "jsonwebtoken";
import { RefreshTokenPayload, TokenPayload } from "../types/types";

export const generateAccessToken = (payload: TokenPayload): string => {
  return jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET!, {
    expiresIn: "15m",
  });
};

export const generateRefreshToken = (payload: RefreshTokenPayload): string => {
  return jwt.sign(payload, process.env.REFRESH_TOKEN_SECRET!, {
    expiresIn: "30d",
  });
};

export const verifyRefreshToken = (
  token: string
): RefreshTokenPayload | null => {
  try {
    return jwt.verify(
      token,
      process.env.REFRESH_TOKEN_SECRET!
    ) as RefreshTokenPayload;
  } catch (error) {
    console.log(error);
    return null;
  }
};

export const verifyAccessToken = (token: string): TokenPayload | null => {
  try {
    return jwt.verify(token, process.env.ACCESS_TOKEN_SECRET!) as TokenPayload;
  } catch (error) {
    console.log(error);
    return null;
  }
};
