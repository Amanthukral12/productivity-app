import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";
import { Session, UserDocument } from "../utils/types";

interface AuthState {
  user: UserDocument | null;
  currentSession: Session | null;
  isAuthenticated: boolean;
  setUser: (user: UserDocument | null) => void;
  setCurrentSession: (session: Session | null) => void;
  logout: () => void;
}

const useAuthStore = create<AuthState>()(
  devtools(
    persist(
      (set) => ({
        user: null,
        currentSession: null,
        isAuthenticated: false,
        setUser: (user) => set({ user, isAuthenticated: !!user }),
        setCurrentSession: (session) => set({ currentSession: session }),
        logout: () =>
          set({ user: null, currentSession: null, isAuthenticated: false }),
      }),
      {
        name: "auth-store",
        partialize: (state) => ({
          user: state.user,
          isAuthenticated: state.isAuthenticated,
        }),
      }
    )
  )
);

export default useAuthStore;
