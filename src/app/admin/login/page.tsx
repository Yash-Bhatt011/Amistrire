"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAdminAuthStore } from "@/lib/store/admin-auth-store";

export default function AdminLoginPage() {
  const router = useRouter();
  const logIn = useAdminAuthStore((s) => s.logIn);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const result = await logIn(email, password);
    if (!result.ok) {
      setError(result.error ?? "Something went wrong.");
      return;
    }
    router.push("/admin");
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-studio-void px-6">
      <div className="w-full max-w-sm">
        <p className="font-wordmark text-2xl text-studio-ink">
          <span className="text-accent-cyan">A</span>
          <span className="text-accent-purple">M</span>ISTRIÉ
        </p>
        <p className="mt-1 text-xs uppercase tracking-wider text-studio-ink/40">Admin Panel</p>

        <form onSubmit={handleSubmit} className="mt-8 flex flex-col gap-4">
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            className="rounded-lg border border-studio-line bg-white px-4 py-3 text-sm text-studio-ink placeholder:text-studio-ink/30 focus:border-accent-cyan focus:outline-none"
          />
          <input
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            className="rounded-lg border border-studio-line bg-white px-4 py-3 text-sm text-studio-ink placeholder:text-studio-ink/30 focus:border-accent-cyan focus:outline-none"
          />
          {error && <p className="text-xs text-rose-500">{error}</p>}
          <button
            type="submit"
            className="mt-2 rounded-full bg-gradient-to-r from-accent-cyan to-accent-purple py-3 text-xs font-medium uppercase tracking-wider text-white hover:scale-[1.02]"
          >
            Log In
          </button>
        </form>

        <div className="mt-6 rounded-lg border border-studio-line bg-studio-concrete p-4 text-xs text-studio-ink/50">
          Sign in with any account whose profile has been promoted to staff
          (see <span className="font-mono text-studio-ink">supabase/schema.sql</span>).
          You can also sign in from the regular{" "}
          <a href="/account/login" className="text-accent-cyan hover:underline">login page</a> —
          it recognizes staff accounts automatically.
        </div>
      </div>
    </div>
  );
}
