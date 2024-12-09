import passport from "passport";
import { Strategy as GoogleStrategy, Profile } from "passport-google-oauth20";
import { PrismaClient } from "@prisma/client";
import { UserDocument } from "../types/types";
import dotenv from "dotenv";
dotenv.config();
type VerifyCallback = (error: any, user?: UserDocument, info?: any) => void;

const prisma = new PrismaClient();

passport.serializeUser((user: UserDocument, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id: number, done) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id },
    });
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
    },
    async (
      accessToken: string,
      refreshToken: string,
      profile: Profile,
      done: VerifyCallback
    ) => {
      try {
        const existingUser = await prisma.user.findUnique({
          where: { googleId: profile.id },
        });

        if (existingUser) {
          return done(null, existingUser);
        }
        const newUser = await prisma.user.create({
          data: {
            googleId: profile.id,
            email: profile.emails?.[0].value || "",
            name: profile.displayName,
            avatar: profile.photos?.[0].value,
          },
        });
        done(null, newUser);
      } catch (error) {
        done(error, undefined, null);
      }
    }
  )
);

export default passport;
