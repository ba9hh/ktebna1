// src/components/Auth.js
import { useState } from "react";
import { supabase } from "../supabaseClient";

export default function SupabaseLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSignUp = async () => {
    setLoading(true);
    const { error } = await supabase.auth.signUp({ email, password });
    if (error) alert(error.message);
    else alert("Check your email for confirmation!");
    setLoading(false);
  };

  const handleLogin = async () => {
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) alert(error.message);
    else alert("Logged in!");
    setLoading(false);
  };

  return (
    <div className="p-4 flex flex-col gap-2">
      <input
        className="border p-2"
        type="email"
        placeholder="Email"
        onChange={(e) => setEmail(e.target.value)}
      />
      <input
        className="border p-2"
        type="password"
        placeholder="Password"
        onChange={(e) => setPassword(e.target.value)}
      />
      <button
        className="bg-blue-500 text-white p-2"
        onClick={handleSignUp}
        disabled={loading}
      >
        Sign Up
      </button>
      <button
        className="bg-green-500 text-white p-2"
        onClick={handleLogin}
        disabled={loading}
      >
        Login
      </button>
    </div>
  );
}
