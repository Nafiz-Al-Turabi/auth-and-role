"use client";

import { tokenStorage } from "@/lib/auth/tokenStorage";
import { useLoginMutation } from "@/redux/features/auth/authApi";
import React, { useState } from "react";
import { useAppDispatch } from "@/redux/hooks";
import { setCredentials } from "@/redux/features/auth/authSlice";
import { useRouter, useSearchParams } from "next/navigation";

export default function AuthPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isLogin, setIsLogin] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const [login, { isLoading }] = useLoginMutation();
  const dispatch = useAppDispatch();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrorMessage(null);

    const formData = new FormData(e.currentTarget);
    const email = (formData.get("email") as string)?.trim();
    const password = formData.get("password") as string;

    if (!isLogin) {
      // In registration mode, can alert or handle register when endpoint is ready
      return;
    }

    try {
      const response = await login({
        email,
        password,
      }).unwrap();

      const accessToken = response.authorization.access_token;
      const refreshToken = response.authorization.refresh_token;
      const role = response.role;

      // Persist tokens and role
      tokenStorage.setRefreshToken(refreshToken);
      tokenStorage.setAccessToken(accessToken);
      tokenStorage.setRole(role);

      // Access token Redux memory
      dispatch(
        setCredentials({
          accessToken,
          role,
        }),
      );

      // Redirect destination
      const redirectDestination = searchParams.get("redirect");
      if (redirectDestination) {
        // If regular user was attempting admin area, prevent redirecting back to forbidden admin page
        if (redirectDestination.startsWith("/dashboard") && role !== "admin") {
          router.push("/");
        } else {
          router.push(redirectDestination);
        }
      } else if (role === "admin") {
        router.push("/dashboard");
      } else {
        router.push("/");
      }
    } catch (error: any) {
      console.error(error);
      setErrorMessage(
        error?.data?.message ||
          error?.message ||
          "Failed to sign in. Please check your credentials.",
      );
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center px-4 py-10 relative overflow-hidden">
      {/* Background Glow */}
      <div className="absolute -top-32 -left-32 w-96 h-96 bg-indigo-600/30 rounded-full blur-3xl" />
      <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-purple-600/30 rounded-full blur-3xl" />

      {/* Auth Card */}
      <div className="relative w-full max-w-md">
        <div className="rounded-3xl border border-white/10 bg-white/6 backdrop-blur-2xl shadow-2xl p-8 sm:p-10">
          {/* Logo / Heading */}
          <div className="text-center mb-8">
            <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-linear-to-br from-indigo-500 to-purple-600 shadow-lg shadow-indigo-500/20">
              <span className="text-xl font-bold text-white">A</span>
            </div>

            <h1 className="text-3xl font-bold text-white">
              {isLogin ? "Welcome Back" : "Create Account"}
            </h1>

            <p className="mt-2 text-sm text-slate-400">
              {isLogin
                ? "Login to continue to your account"
                : "Create your account to get started"}
            </p>
          </div>

          {/* Error Message */}
          {errorMessage && (
            <div className="mb-5 rounded-xl border border-red-500/20 bg-red-500/10 p-3 text-center text-sm text-red-400">
              {errorMessage}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {!isLogin && (
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-300">
                  Full Name
                </label>

                <input
                  type="text"
                  name="name"
                  placeholder="John Doe"
                  required
                  className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-none placeholder:text-slate-500 transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
                />
              </div>
            )}

            <div>
              <label className="mb-2 block text-sm font-medium text-slate-300">
                Email
              </label>

              <input
                type="email"
                name="email"
                placeholder="you@example.com"
                required
                className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-none placeholder:text-slate-500 transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-slate-300">
                Password
              </label>

              <input
                type="password"
                name="password"
                placeholder="••••••••"
                required
                className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-none placeholder:text-slate-500 transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
              />
            </div>

            {isLogin && (
              <div className="flex items-center justify-between text-sm">
                <label className="flex items-center gap-2 text-slate-400">
                  <input
                    type="checkbox"
                    name="remember"
                    className="h-4 w-4 rounded border-white/10 bg-white/5"
                  />
                  Remember me
                </label>

                <button
                  type="button"
                  className="text-indigo-400 transition hover:text-indigo-300"
                  onClick={() => console.log("Forgot password clicked")}
                >
                  Forgot password?
                </button>
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full rounded-xl bg-linear-to-r from-indigo-500 to-purple-600 py-3.5 font-semibold text-white shadow-lg shadow-indigo-500/20 transition hover:scale-[1.01] hover:shadow-indigo-500/30 active:scale-[0.99] disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {isLoading ? "Signing In..." : isLogin ? "Sign In" : "Create Account"}
            </button>
          </form>

          {/* Divider */}
          <div className="my-7 flex items-center gap-4">
            <div className="h-px flex-1 bg-white/10" />
            <span className="text-xs text-slate-500">OR</span>
            <div className="h-px flex-1 bg-white/10" />
          </div>

          {/* Social Login */}
          <button
            type="button"
            onClick={() => console.log("Google login clicked")}
            className="flex w-full items-center justify-center gap-3 rounded-xl border border-white/10 bg-white/5 py-3 text-sm font-medium text-white transition hover:bg-white/10"
          >
            <span className="text-lg">G</span>
            Continue with Google
          </button>

          {/* Switch Login/Register */}
          <p className="mt-7 text-center text-sm text-slate-400">
            {isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
            <button
              type="button"
              onClick={() => setIsLogin(!isLogin)}
              className="font-semibold text-indigo-400 hover:text-indigo-300"
            >
              {isLogin ? "Create account" : "Sign in"}
            </button>
          </p>
        </div>

        <p className="mt-6 text-center text-xs text-slate-600">
          © 2026 Your Company. All rights reserved.
        </p>
      </div>
    </div>
  );
}
