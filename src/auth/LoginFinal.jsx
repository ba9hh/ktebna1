import { useContext, useEffect } from "react";
import { AuthContext } from "./AuthProvider";
import { useNavigate } from "react-router-dom";
const Login = () => {
  const { user, loginWithGoogle, logout, loading } = useContext(AuthContext);
  const navigate = useNavigate();
  useEffect(() => {
    if (user && !loading) {
      navigate("/account");
    }
  }, [user, loading, navigate]);
  if (loading) return <p>Loading...</p>;
  return (
    <div className="flex flex-col items-center gap-4">
      {user ? (
        <>
          <img
            src={user.picture}
            alt="avatar"
            className="w-16 h-16 rounded-full"
          />
          <p className="text-lg">Welcome, {user.name}</p>
          <button
            onClick={logout}
            className="px-4 py-2 bg-red-500 text-white rounded-lg"
          >
            Logout
          </button>
        </>
      ) : (
        <button
          onClick={loginWithGoogle}
          className="px-4 py-2 bg-blue-500 text-white rounded-lg"
        >
          Login with Google
        </button>
      )}
    </div>
  );
};

export default Login;
