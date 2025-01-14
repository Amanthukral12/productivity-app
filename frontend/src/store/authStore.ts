import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";
import { AuthState } from "../utils/types";

interface AuthStore extends AuthState {
  setAuthState: (authState: Partial<AuthState>) => void;
  reset: () => void;
}

const useAuthStore = create<AuthStore>()(
  devtools(
    persist(
      (set) => ({
        isAuthenticated: false,
        user: null,
        setAuthState: (authState) =>
          set((state) => ({ ...state, ...authState })),
        reset: () => set({ isAuthenticated: false, user: undefined }),
      }),
      {
        name: "auth-store",
        partialize: (state) => ({ isAuthenticated: state.isAuthenticated }),
      }
    )
  )
);

export default useAuthStore;
