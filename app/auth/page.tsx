"use client";

import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import { useAuth } from "@/lib/auth-context";

type Mode = "login" | "signup" | "magic";

function AuthForm() {
  const { user, loginWithGoogle, loginWithEmail, signupWithEmail, sendMagicLink, loginAnonymously } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams.get("redirect") || "/";

  const [mode, setMode] = useState<Mode>("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [magicSent, setMagicSent] = useState(false);

  // If already logged in, redirect
  if (user) {
    router.push(redirect);
    return null;
  }

  const handleGoogle = async () => {
    setError("");
    try {
      await loginWithGoogle();
      router.push(redirect);
    } catch (err: any) {
      setError(err.message || "Google sign-in failed");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      if (mode === "magic") {
        await sendMagicLink(email);
        setMagicSent(true);
      } else if (mode === "signup") {
        await signupWithEmail(email, password);
        router.push(redirect);
      } else {
        await loginWithEmail(email, password);
        router.push(redirect);
      }
    } catch (err: any) {
      setError(err.message || "Authentication failed");
    } finally {
      setLoading(false);
    }
  };

  const handleGuest = async () => {
    setError("");
    setLoading(true);
    try {
      await loginAnonymously();
      router.push(redirect);
    } catch (err: any) {
      setError(err.message || "Guest checkout failed");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-5 py-16">
      <div className="w-full max-w-md">
        <div className="flex flex-col items-center mb-10">
          <Image src="/logo.png" alt="Octopus" width={64} height={64} className="mb-4" />
          <h1 className="font-serif-display text-3xl md:text-4xl text-center">
            {mode === "signup" ? "Create Account" : mode === "magic" ? "Magic Link" : "Sign In"}
          </h1>
          <p className="text-muted text-sm mt-2 text-center">
            {mode === "signup"
              ? "Join Octopus for a seamless shopping experience"
              : mode === "magic"
              ? "We will send a sign-in link to your email"
              : "Welcome back to Octopus"}
          </p>
        </div>

        {/* Google Sign In */}
        <button
          onClick={handleGoogle}
          className="w-full flex items-center justify-center gap-3 border border-ink/20 py-3 text-sm hover:bg-ink/5 transition-colors mb-6"
        >
          <svg width="18" height="18" viewBox="0 0 48 48">
            <path fill="#FFC107" d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z" />
            <path fill="#FF3D00" d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z" />
            <path fill="#4CAF50" d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z" />
            <path fill="#1976D2" d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z" />
          </svg>
          Continue with Google
        </button>

        <div className="relative mb-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-ink/10" />
          </div>
          <div className="relative flex justify-center text-xs uppercase tracking-widest">
            <span className="bg-paper px-4 text-muted">or</span>
          </div>
        </div>

        {magicSent ? (
          <div className="text-center py-8">
            <p className="font-serif-display text-xl mb-2">Check your email</p>
            <p className="text-sm text-muted">We sent a sign-in link to <strong>{email}</strong>. Click the link to sign in.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label htmlFor="email" className="block text-xs uppercase tracking-widest text-muted mb-2">Email</label>
              <input
                required
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full border-b border-ink/20 py-2 bg-transparent focus:outline-none focus:border-ink transition-colors"
              />
            </div>
            {mode !== "magic" && (
              <div>
                <label htmlFor="password" className="block text-xs uppercase tracking-widest text-muted mb-2">Password</label>
                <input
                  required
                  type="password"
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  minLength={6}
                  className="w-full border-b border-ink/20 py-2 bg-transparent focus:outline-none focus:border-ink transition-colors"
                />
              </div>
            )}
            {error && <p className="text-red-600 text-xs">{error}</p>}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-ink text-paper py-3.5 text-[11px] tracking-[0.25em] uppercase hover:opacity-90 transition-opacity disabled:opacity-50"
            >
              {loading
                ? "Please wait..."
                : mode === "signup"
                ? "Create Account"
                : mode === "magic"
                ? "Send Magic Link"
                : "Sign In"}
            </button>
          </form>
        )}

        <div className="mt-8 text-center space-y-2">
          {mode === "login" && (
            <>
              <p className="text-sm text-muted">
                Don&apos;t have an account?{" "}
                <button onClick={() => { setMode("signup"); setError(""); }} className="underline text-ink">Sign Up</button>
              </p>
              <p className="text-sm text-muted">
                <button onClick={() => { setMode("magic"); setError(""); }} className="underline text-ink">Sign in with Magic Link</button>
              </p>
            </>
          )}
          {mode === "signup" && (
            <p className="text-sm text-muted">
              Already have an account?{" "}
              <button onClick={() => { setMode("login"); setError(""); }} className="underline text-ink">Sign In</button>
            </p>
          )}
          {mode === "magic" && (
            <p className="text-sm text-muted">
              <button onClick={() => { setMode("login"); setError(""); setMagicSent(false); }} className="underline text-ink">Back to Sign In</button>
            </p>
          )}

          {redirect === "/checkout" && (
            <div className="mt-6 pt-6 border-t border-ink/10">
              <p className="text-sm text-muted mb-3">Want to checkout without an account?</p>
              <button
                onClick={handleGuest}
                disabled={loading}
                className="w-full border border-ink py-3 text-[11px] tracking-[0.25em] uppercase hover:bg-ink hover:text-paper transition-colors disabled:opacity-50"
              >
                Continue as Guest
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function AuthPage() {
  return (
    <Suspense fallback={<div className="min-h-[80vh] flex items-center justify-center">Loading...</div>}>
      <AuthForm />
    </Suspense>
  );
}
