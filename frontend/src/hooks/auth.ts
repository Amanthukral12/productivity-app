import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import useAuthStore from "../store/authStore";
import api from "../lib/api";
import { SessionResponse, UserDocument } from "../utils/types";

export const useAuth = () => {
  const queryClient = useQueryClient();
  const { logout: clearAuth } = useAuthStore();

  const sessionQuery = useQuery({
    queryKey: ["session"],
    queryFn: async () => {
      const { data } = await api.get<SessionResponse>("/auth/session");
      localStorage.setItem(
        "isAuthenticated",
        data.data.currentUser.name ? "true" : "false"
      );
      return data.data;
    },
    retry: false,
    refetchOnWindowFocus: false,
    staleTime: Infinity,
  });

  const profileQuery = useQuery({
    queryKey: ["profile"],
    queryFn: async () => {
      const { data } = await api.get<UserDocument>("/auth/profile");
      return data;
    },
    enabled: false,
  });
  const initiateGoogleLogin = () => {
    window.location.href = "http://localhost:8000/auth/google";
  };

  const logoutMutation = useMutation({
    mutationFn: async () => {
      await api.post("/auth/logout");
      clearAuth();
      localStorage.removeItem("token");
      localStorage.removeItem("isAuthenticated");
      queryClient.clear();
    },
  });
  return {
    sessionQuery,
    profileQuery,
    initiateGoogleLogin,
    logoutMutation,
    isAuthenticated: !!sessionQuery.data?.currentUser,
    user: sessionQuery.data?.currentUser,
    currentSession: sessionQuery.data?.currentSession,
  };
};
