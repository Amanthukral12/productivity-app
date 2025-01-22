import { useAuth } from "../../hooks/auth";
import useAuthStore from "../../store/authStore";

const Dashboard = () => {
  const { user } = useAuthStore();
  const { logoutMutation } = useAuth();
  return (
    <div>
      {user?.name}
      <br />
      {user ? (
        <button
          onClick={() => {
            logoutMutation.mutate();
          }}
        >
          Logout
        </button>
      ) : null}
    </div>
  );
};

export default Dashboard;
