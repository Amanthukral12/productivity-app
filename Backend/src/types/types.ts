export interface UserDocument {
  id: number;
  googleId: string;
  email: string;
  name: string;
  avatar: string | null;
  createdAt: Date;
  updatedAt: Date;
}
