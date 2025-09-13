import { supabase } from "../supabaseClient";

// 1. Sign in with Google
export const signInWithGoogle = async () => {
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: {
      redirectTo: "http://localhost:5173", // change in production
    },
  });
  if (error) throw error;
  return data;
};

// 2. Get the current user
export const getCurrentUser = async () => {
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error) throw error;
  return user;
};

// 3. Save or update user in DB
export const saveUserToDB = async () => {
  const user = await getCurrentUser();
  if (!user) return null;

  const { id, email, user_metadata } = user;
  const name = user_metadata.full_name || "";
  const profilePicture = user_metadata.avatar_url || "";

  const { data, error } = await supabase.from("users").upsert({
    id,
    name,
    email,
    profile_picture: profilePicture,
  });

  if (error) throw error;
  return data;
};

// 4. Sign out
export const signOut = async () => {
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
};
