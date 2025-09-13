// AuthProvider.jsx
import { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "../supabaseClient";

const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  // Check session on mount
  useEffect(() => {
    const getUser = async () => {
      const {
        data: { session },
        error,
      } = await supabase.auth.getSession();
      console.log(session?.user);
      if (session?.user) {
        setUser({
          id: session.user.id,
          // name: session.user.user_metadata.full_name,
          // email: session.user.user_metadata.email,
          // picture: session.user.user_metadata.avatar_url,
        });
      } else {
        setUser(null);
      }
      setLoading(false);
    };
    getUser();
    // Listen for login/logout events
    const { data: listener } = supabase.auth.onAuthStateChange(
      async (_event, session) => {
        console.log(session?.user);
        if (session?.user) {
          setUser({
            id: session.user.id,
            // name: session.user.user_metadata.full_name,
            // email: session.user.user_metadata.email,
            // picture: session.user.user_metadata.avatar_url,
          });
        } else {
          setUser(null);
        }
        setLoading(false);
      }
    );
    setLoading(false);
    return () => {
      listener.subscription.unsubscribe();
    };
  }, []);

  const loginWithGoogle = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: "http://localhost:5173/login1",
      },
    });
    if (error) console.error("Google login error:", error.message);
  };

  const logout = async () => {
    setLoading(true);
    await supabase.auth.signOut();
    setLoading(false);
  };

  return (
    <AuthContext.Provider value={{ user, loading, loginWithGoogle, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export { AuthProvider, AuthContext };
