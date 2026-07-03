"use client";

import { type FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [sendingReset, setSendingReset] = useState(false);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setMessage(null);

    if (
      !process.env.NEXT_PUBLIC_SUPABASE_URL ||
      !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    ) {
      setError("Supabase environment variables are not configured. Sign-in is unavailable.");
      setLoading(false);
      return;
    }

    const supabase = createClient();
    const { error: signInError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (signInError) {
      setError(signInError.message);
      setLoading(false);
      return;
    }

    router.push("/admin/projects");
    router.refresh();
  }

  async function handleForgotPassword() {
    setError(null);
    setMessage(null);

    if (!email.trim()) {
      setError("Enter your admin email first, then click Forgot password.");
      return;
    }

    if (
      !process.env.NEXT_PUBLIC_SUPABASE_URL ||
      !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    ) {
      setError("Supabase environment variables are not configured. Password reset is unavailable.");
      return;
    }

    setSendingReset(true);

    const supabase = createClient();
    const redirectTo = `${window.location.origin}/auth/callback?next=/admin/reset-password`;
    const { error: resetError } = await supabase.auth.resetPasswordForEmail(email.trim(), {
      redirectTo,
    });

    if (resetError) {
      setError(resetError.message);
      setSendingReset(false);
      return;
    }

    setMessage("Password reset email sent. Open the link to set a new password.");
    setSendingReset(false);
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-stone-50 px-6 text-stone-700">
      <div className="w-full max-w-sm">
        <h1 className="font-serif text-3xl text-stone-900">Admin Login</h1>
        <p className="mt-2 text-sm text-stone-500">Sign in with the admin email and password.</p>

        <form onSubmit={handleSubmit} className="mt-8 flex flex-col gap-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-stone-700">
              Email
            </label>
            <input
              id="email"
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 w-full rounded-md border border-stone-300 bg-white px-3 py-2 text-sm outline-none focus:border-stone-500"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-stone-700">
              Password
            </label>
            <input
              id="password"
              type="password"
              autoComplete="current-password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 w-full rounded-md border border-stone-300 bg-white px-3 py-2 text-sm outline-none focus:border-stone-500"
            />
          </div>

          {error ? (
            <p className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-600">{error}</p>
          ) : null}

          {message ? (
            <p className="rounded-md bg-emerald-50 px-3 py-2 text-sm text-emerald-700">
              {message}
            </p>
          ) : null}

          <button
            type="submit"
            disabled={loading}
            className="mt-2 rounded-md bg-stone-900 px-5 py-2 text-sm text-white transition-colors hover:bg-stone-700 disabled:opacity-60"
          >
            {loading ? "Signing in..." : "Sign In"}
          </button>

          <button
            type="button"
            onClick={handleForgotPassword}
            disabled={sendingReset}
            className="text-sm text-stone-500 underline-offset-2 transition-colors hover:text-stone-800 hover:underline disabled:opacity-60"
          >
            {sendingReset ? "Sending reset email..." : "Forgot password?"}
          </button>
        </form>
      </div>
    </div>
  );
}
