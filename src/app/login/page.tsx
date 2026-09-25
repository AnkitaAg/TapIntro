"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleLogin(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setError("");
    setLoading(true);

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setError(error.message);
      setLoading(false);
      return;
    }

    const {
  data: { user },
} = await supabase.auth.getUser();

if (!user) {
  setError("Could not find your account.");
  setLoading(false);
  return;
}

const { data: profile } = await supabase
  .from("profiles")
  .select("username")
  .eq("user_id", user.id)
  .single();

if (profile) {
  router.push(`/${profile.username}`);
} else {
  router.push("/create-profile");
}
  }

  return (
    <main className="min-h-screen bg-white text-gray-900">
      <div className="mx-auto max-w-md px-6 py-20">
        <p className="text-sm font-medium uppercase tracking-widest text-gray-500">
          TapIntro
        </p>

        <h1 className="mt-4 text-4xl font-bold">
          Welcome back
        </h1>

        <p className="mt-3 text-gray-600">
          Sign in to manage your introduction.
        </p>

        <form onSubmit={handleLogin} className="mt-10 space-y-6">
          <div>
            <label className="block text-sm font-medium">
              Email
            </label>

            <input
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              required
              className="mt-2 w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-gray-900"
              placeholder="you@example.com"
            />
          </div>

          <div>
            <label className="block text-sm font-medium">
              Password
            </label>

            <input
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              required
              className="mt-2 w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-gray-900"
              placeholder="••••••••"
            />
          </div>
            <div className="text-right">
            <a
              href="/forgot-password"
             className="text-sm font-medium underline"
             >
              Forgot password?
            </a>
        </div>
          {error && (
            <p className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-gray-900 px-4 py-3 font-medium text-white hover:bg-gray-800 disabled:opacity-50"
          >
            {loading ? "Signing in..." : "Sign in"}
          </button>
        </form>

        <p className="mt-8 text-sm text-gray-500">
            Don't have an account?{" "}
            <a href="/signup" className="font-medium underline">
                Create an account
            </a>
        </p>
      </div>
    </main>
  );
}