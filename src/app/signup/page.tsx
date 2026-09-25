"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

export default function SignupPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSignup(event: React.FormEvent<HTMLFormElement>) {
  event.preventDefault();

  setError("");
  setMessage("");
  setLoading(true);

  const { error } = await supabase.auth.signUp({
    email,
    password,
  });

  if (error) {
    setError(error.message);
    setLoading(false);
    return;
  }

  setMessage(
    "Account created! Please check your email to confirm your account. Once confirmed, sign in to create your TapIntro profile."
  );

  setLoading(false);
}
  return (
    <main className="min-h-screen bg-white text-gray-900">
      <div className="mx-auto max-w-md px-6 py-20">
        <p className="text-sm font-medium uppercase tracking-widest text-gray-500">
          TapIntro
        </p>

        <h1 className="mt-4 text-4xl font-bold">
          Create your account
        </h1>

        <p className="mt-3 text-gray-600">
          Create your TapIntro profile and share it with one tap.
        </p>

        <form onSubmit={handleSignup} className="mt-10 space-y-6">
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
              minLength={6}
              className="mt-2 w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-gray-900"
              placeholder="At least 6 characters"
            />
          </div>

          {error && (
            <p className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">
              {error}
            </p>
          )}

          {message && (
            <p className="rounded-lg bg-green-50 px-4 py-3 text-sm text-green-700">
              {message}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-gray-900 px-4 py-3 font-medium text-white hover:bg-gray-800 disabled:opacity-50"
          >
            {loading ? "Creating account..." : "Create account"}
          </button>
        </form>

        <p className="mt-8 text-sm text-gray-500">
            Already have an account?{" "}
            <a href="/login" className="font-medium underline">
                Log in
            </a>
        </p>
      </div>
    </main>
  );
}
