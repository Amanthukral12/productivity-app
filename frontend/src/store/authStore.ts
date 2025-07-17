import { create } from "zustand";
import { persist } from "zustand/middleware";
import { CustomSession, Session, UserDocument } from "../types/types";

interface AuthState {
  user: UserDocument | null;
  currentSession: Session | null;
  isAuthenticated: boolean;
  allSessions: CustomSession[] | null;
  setUser: (user: UserDocument | null) => void;
  setCurrentSession: (session: Session | null) => void;
  setAllSessions: (sessions: CustomSession[] | null) => void;
  logout: () => void;
}

const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      currentSession: null,
      isAuthenticated: false,
      allSessions: null,
      setUser: (user) => set({ user, isAuthenticated: !!user }),
      setCurrentSession: (session) => set({ currentSession: session }),
      setAllSessions: (sessions) => set({ allSessions: sessions }),
      logout: () =>
        set({ user: null, currentSession: null, isAuthenticated: false }),
    }),
    {
      name: "auth-store",
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
        currentSession: state.currentSession,
      }),
    }
  )
);

export default useAuthStore;
