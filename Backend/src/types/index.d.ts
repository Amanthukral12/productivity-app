import { Session } from "@prisma/client";
import { UserDocument } from "./types";

declare global {
  namespace Express {
    interface Request {
      user?: UserDocument;
      currentSession?: Session & {
        user: UserDocument;
      };
    }
  }
}
