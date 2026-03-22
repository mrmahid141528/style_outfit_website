"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
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

    router.push("/admin");
    router.refresh();
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-brand-warm px-4 py-8">
      {/* Background pattern */}
      <div
        className="fixed inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }}
      />

      <div
        className="w-full max-w-md relative z-10 animate-scale-in"
        style={{ opacity: 0, animationFillMode: "forwards" }}
      >
        {/* Logo / Brand */}
        <div className="text-center mb-8 sm:mb-10">
          <h1
            className="text-4xl sm:text-5xl font-bold tracking-tighter mb-1"
            style={{ fontFamily: "var(--font-serif)" }}
          >
            STYLE
          </h1>
          <p className="text-brand-gray-medium text-xs tracking-[0.25em] uppercase">
            Admin Portal
          </p>
        </div>

        {/* Login Card */}
        <form
          onSubmit={handleLogin}
          className="bg-white p-6 sm:p-10 border border-brand-gray/30"
          style={{
            borderRadius: "var(--radius-card)",
            boxShadow: "var(--shadow-card)",
          }}
        >
          <h2
            className="text-lg sm:text-xl font-semibold mb-1"
            style={{ fontFamily: "var(--font-sans)" }}
          >
            Welcome back
          </h2>
          <p className="text-sm text-brand-gray-medium mb-6">
            Sign in to manage your lookbook.
          </p>

          {error && (
            <div
              className="mb-5 px-4 py-3 text-sm text-red-700 bg-red-50 border border-red-100 flex items-center gap-2"
              style={{ borderRadius: "var(--radius-input)" }}
            >
              <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              {error}
            </div>
          )}

          <div className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-brand-gray-dark mb-1.5">
                Email address
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-4 py-3 border border-brand-gray bg-brand-gray-light/50 text-brand-black placeholder-brand-gray-medium focus:outline-none focus:ring-2 focus:ring-brand-black/80 focus:border-transparent transition-all text-sm"
                style={{ borderRadius: "var(--radius-input)" }}
                placeholder="admin@example.com"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-brand-gray-dark mb-1.5">
                Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full px-4 py-3 border border-brand-gray bg-brand-gray-light/50 text-brand-black placeholder-brand-gray-medium focus:outline-none focus:ring-2 focus:ring-brand-black/80 focus:border-transparent transition-all text-sm"
                style={{ borderRadius: "var(--radius-input)" }}
                placeholder="••••••••"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn-premium w-full mt-6 py-3.5 bg-brand-black text-white font-semibold tracking-wide hover:bg-brand-gray-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-black transition-all disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer text-sm"
            style={{ borderRadius: "var(--radius-button)" }}
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                Signing in...
              </span>
            ) : (
              "Sign In"
            )}
          </button>
        </form>

        <p className="text-center mt-6 text-[11px] text-brand-gray-medium">
          Authorized administrators only
        </p>
      </div>
    </div>
  );
}
