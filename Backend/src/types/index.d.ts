import { User, Session } from "@prisma/client";

declare global {
  namespace Express {
    interface Request {
      user?: User;
      currentSession?: Session & {
        user: User;
      };
    }
  }
}
