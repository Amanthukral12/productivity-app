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
  done(null, {
    user: session.user,
    sessionId: session.sessionId,
  });
});

passport.deserializeUser(async (serializedSession: any, done) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: serializedSession.user.id },
    });
    done(null, { user, sessionId: serializedSession.sessionId });
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
        const verifyCallbackDoc: VerifyCallbackDocument = {
          user,
          sessionId,
        };
        done(null, verifyCallbackDoc);
      } catch (error) {
        done(error, undefined, undefined);
      }
    }
  )
);

export default passport;
