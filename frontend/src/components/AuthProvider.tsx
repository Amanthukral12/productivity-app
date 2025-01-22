import { useEffect } from "react";
import { useAuth } from "../hooks/auth";
import useAuthStore from "../store/authStore";
import { Outlet } from "react-router-dom";

const AuthProvider = () => {
  const { sessionQuery } = useAuth();
  const setUserState = useAuthStore((state) => state.setUser);
  const setSessionState = useAuthStore((state) => state.setCurrentSession);

  useEffect(() => {
    if (sessionQuery.data) {
      setUserState(sessionQuery.data.currentUser);
      setSessionState(sessionQuery.data.currentSession);
    }
  }, [sessionQuery.data, sessionQuery.isLoading]);

  if (sessionQuery.isFetching) {
    return <div>Loading ...</div>;
  }
  return <Outlet />;
};

export default AuthProvider;
