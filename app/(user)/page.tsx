"use client";

import React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useGetCurrentUserQuery } from "@/redux/features/auth/authApi";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { logout } from "@/redux/features/auth/authSlice";

export default function HomePage() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { role, isAuthenticated } = useAppSelector((state) => state.auth);
  const { data: currentUser } = useGetCurrentUserQuery(undefined, {
    skip: !isAuthenticated,
  });

  const handleLogout = () => {
    // 1. Dispatch logout (clears Redux memory & tokenStorage cookies/localStorage)
    dispatch(logout());

    router.replace("/auth");
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      {/* Navbar */}
      <header className="border-b border-white/10 bg-white/5 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-linear-to-br from-indigo-500 to-purple-600 font-bold text-white shadow-md shadow-indigo-500/20">
              U
            </div>
            <div>
              <h1 className="text-lg font-semibold tracking-tight">User Portal</h1>
              <p className="text-xs text-slate-400">
                {isAuthenticated ? `Logged in as ${role || "User"}` : "Guest User"}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {isAuthenticated ? (
              <button
                onClick={handleLogout}
                className="inline-flex items-center gap-2 rounded-xl bg-red-500/10 border border-red-500/20 px-4 py-2 text-sm font-medium text-red-400 transition hover:bg-red-500/20 hover:text-red-300 active:scale-95"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                  />
                </svg>
                Logout
              </button>
            ) : (
              <Link
                href="/auth"
                className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-indigo-500 active:scale-95"
              >
                Login
              </Link>
            )}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="rounded-3xl border border-white/10 bg-white/5 p-8 sm:p-10 backdrop-blur-xl">
          <h2 className="text-2xl font-bold text-white">This is home page of user</h2>
          <p className="mt-2 text-slate-400">
            Welcome to the user portal. You can view your account status and navigate below.
          </p>

          <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
              <span className="text-xs text-slate-400 uppercase tracking-wider">Auth Status</span>
              <p className="mt-1 text-lg font-semibold text-emerald-400">
                {isAuthenticated ? "Logged In" : "Not Logged In"}
              </p>
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
              <span className="text-xs text-slate-400 uppercase tracking-wider">Role</span>
              <p className="mt-1 text-lg font-semibold text-indigo-400 capitalize">
                {role || "Guest"}
              </p>
            </div>
          </div>

          {currentUser && (
            <div className="mt-6 rounded-2xl border border-white/10 bg-black/20 p-4">
              <span className="text-xs text-slate-400 uppercase tracking-wider">Current User Info</span>
              <pre className="mt-2 text-xs text-slate-300 overflow-x-auto">
                {JSON.stringify(currentUser, null, 2)}
              </pre>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
