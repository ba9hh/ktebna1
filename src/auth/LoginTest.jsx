import { useEffect, useState } from "react";
import {
  signInWithGoogle,
  saveUserToDB,
  getCurrentUser,
  signOut,
} from "./authService";

const LoginPage = () => {
  const [user, setUser] = useState(null);

  // After redirect, save user info in DB
  useEffect(() => {
    const init = async () => {
      try {
        const currentUser = await getCurrentUser();
        if (currentUser) {
          await saveUserToDB();
          setUser(currentUser);
        }
      } catch (err) {
        console.error("Error fetching user:", err.message);
      }
    };
    init();
  }, []);

  const handleGoogleLogin = async () => {
    try {
      await signInWithGoogle();
    } catch (err) {
      console.error("Google login error:", err.message);
    }
  };

  const handleLogout = async () => {
    try {
      await signOut();
      setUser(null);
    } catch (err) {
      console.error("Logout error:", err.message);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen gap-4">
      {!user ? (
        <button
          onClick={handleGoogleLogin}
          className="px-6 py-2 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700"
        >
          Sign in with Google
        </button>
      ) : (
        <div className="flex flex-col items-center gap-2">
          <img
            src={user.user_metadata?.avatar_url}
            alt="profile"
            className="w-16 h-16 rounded-full"
          />
          <p className="font-bold">{user.user_metadata?.full_name}</p>
          <p className="text-gray-600">{user.email}</p>
          <button
            // onClick={handleLogout}
            className="px-4 py-2 bg-red-500 text-white rounded-lg shadow hover:bg-red-600"
          >
            Logout
          </button>
        </div>
      )}
    </div>
  );
};

export default LoginPage;
