import { UserDocument, CustomSession } from "./types";
import { Session } from "@prisma/client";
declare global {
  namespace Express {
    interface Request {
      user?: UserDocument;
      currentSession?: CustomSession & {
        user: UserDocument;
      };
    }
  }
}
