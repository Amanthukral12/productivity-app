import { UserDocument } from "./types";

declare global {
  namespace Express {
    interface User extends UserDocument {}
  }
}
