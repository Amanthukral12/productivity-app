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
  deviceInfo?: string;
  createdAt: Date;
  expiresAt: Date;
  lastUsedAt: Date;
  user: UserDocument;
}

export interface CustomSession {
  id: string;
  sessionId: string;
  userId: number;
  deviceInfo: string | null;
  expiresAt: Date;
  lastUsedAt: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface SessionResponse {
  data: {
    currentUser: UserDocument;
    currentSession: Session;
  };
}

export interface Category {
  id: number;
  name: string;
  userId: number;
}

export interface Note {
  id: string;
  title: string;
  content: string;
  categoryIds: number[];
}
