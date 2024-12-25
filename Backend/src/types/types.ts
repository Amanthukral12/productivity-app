import { Profile } from "passport-google-oauth20";

export type UserDocument = {
  id: number;
  googleId: string;
  email: string;
  name: string;
  avatar: string | null;
  createdAt: Date;
  updatedAt: Date;
};

export interface SessionDocument {
  id: string;
  sessionId: string;
  userId: number;
  refreshToken: string;
  deviceInfo: string;
  createdAt: Date;
  expiresAt: Date;
  lastUsedAt: Date;
  user: UserDocument;
}

export interface VerifyCallbackDocument {
  user?: UserDocument;
  sessionId: string;
}

export type VerifyCallback = (
  error: any,
  user?: VerifyCallbackDocument,
  info?: any
) => void;

export interface GoogleStrategyOptions {
  clientID: string;
  clientSecret: string;
  callbackURL: string;
}

export interface GoogleStrategyOptionsWithRequest
  extends GoogleStrategyOptions {
  passReqToCallback: true;
}

export type GoogleStrategyVerifyFn = (
  accessToken: string,
  refreshToken: string,
  profile: Profile,
  done: VerifyCallback
) => Promise<void> | void;

export type GoogleStrategyVerifyFnWithRequest = (
  req: Request,
  accessToken: string,
  refreshToken: string,
  profile: Profile,
  done: VerifyCallback
) => Promise<void> | void;

export interface TokenPayload {
  userId: number;
  sessionId: string;
}

export interface RefreshTokenPayload {
  sessionId: string;
}
