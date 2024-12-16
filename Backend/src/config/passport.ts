import passport from "passport";
import { Strategy as GoogleStrategy, Profile } from "passport-google-oauth20";
import { PrismaClient } from "@prisma/client";
import {
  GoogleStrategyOptionsWithRequest,
  VerifyCallbackDocument,
} from "../types/types";
import { v4 as uuidv4 } from "uuid";
import dotenv from "dotenv";
dotenv.config();

const prisma = new PrismaClient();

passport.serializeUser((session: any, done) => {
  done(null, session);
});

passport.deserializeUser(async (session: any, done) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
    });
    done(null, { user, sessionId: session.sessionId });
  } catch (error) {
    done(error, null);
  }
});

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENTID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      callbackURL: process.env.GOOGLE_CALLBACK_URL || "",
    } as GoogleStrategyOptionsWithRequest,
    async (
      req: any,
      accessToken: string,
      refreshToken: string,
      profile: Profile,
      done
    ): Promise<void> => {
      try {
        let user = await prisma.user.findUnique({
          where: { googleId: profile.id },
        });

        if (!user) {
          user = await prisma.user.create({
            data: {
              googleId: profile.id,
              email: profile.emails?.[0].value || "",
              name: profile.displayName,
              avatar: profile.photos?.[0].value,
            },
          });
        }

        const sessionId = uuidv4();
        const newRefreshToken = uuidv4();

        await prisma.session.create({
          data: {
            userId: user.id,
            sessionId,
            refreshToken: newRefreshToken,
            deviceInfo: req.deviceInfo,
            expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
          },
        });
        const verifyCallbackDoc: VerifyCallbackDocument = {
          user,
          sessionId,
          refreshToken: newRefreshToken,
        };
        done(null, verifyCallbackDoc);
      } catch (error) {
        done(error, undefined, undefined);
      }
    }
  )
);

export default passport;
