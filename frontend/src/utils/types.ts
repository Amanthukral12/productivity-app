export interface UserDocument {
  id: number;
  googleId: string;
  email: string;
  name: string;
  avatar: string | null;
  createdAt: Date;
  updatedAt: Date;
}
export interface Session {
  id: string;
  sessionId: string;
  userId: number;
  refreshToken: string;
  deviceInfo?: string;
  createdAt: Date;
  expiresAt: Date;
  lastUsedAt: Date;
  user: UserDocument;
}
export interface AuthState {
  isAuthenticated: boolean;
  user: UserDocument | null;
}
