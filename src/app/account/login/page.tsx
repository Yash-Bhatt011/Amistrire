"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Navbar } from "@/components/ui/Navbar";
import { Footer } from "@/components/ui/Footer";
import { useAuthStore } from "@/lib/store/auth-store";

export default function LoginPage() {
  const router = useRouter();
  const logIn = useAuthStore((s) => s.logIn);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    // One shared Supabase login — staff and customers are both normal
    // accounts, just distinguished by profile role. Route accordingly.
    const result = await logIn(email, password);
    if (!result.ok) {
      setError(result.error ?? "Something went wrong.");
      return;
    }

    router.push(result.user?.role === "staff" ? "/admin" : "/account");
  }

  return (
    <>
      <Navbar />
      <main className="mx-auto flex min-h-[70vh] max-w-sm flex-col justify-center px-6 py-32 sm:px-0">
        <p className="font-mono text-xs uppercase tracking-[0.2em] text-accent-cyan">Welcome Back</p>
        <h1 className="mt-3 font-display text-3xl text-studio-ink">Log In</h1>

        <form onSubmit={handleSubmit} className="mt-8 flex flex-col gap-4">
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            className="rounded-lg border border-studio-line bg-studio-panel px-4 py-3 text-sm text-studio-ink placeholder:text-studio-ink/30 focus:border-accent-cyan focus:outline-none"
          />
          <input
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            className="rounded-lg border border-studio-line bg-studio-panel px-4 py-3 text-sm text-studio-ink placeholder:text-studio-ink/30 focus:border-accent-cyan focus:outline-none"
          />
          {error && <p className="text-xs text-rose-400">{error}</p>}
          <button
            type="submit"
            className="mt-2 rounded-full bg-gradient-to-r from-accent-cyan to-accent-purple py-3 text-xs font-medium uppercase tracking-wider text-studio-void hover:scale-[1.02]"
          >
            Log In
          </button>
        </form>

        <div className="mt-6 flex justify-between text-xs text-studio-ink/40">
          <Link href="/account/forgot-password" className="hover:text-studio-ink">Forgot password?</Link>
          <Link href="/account/signup" className="hover:text-studio-ink">Create an account</Link>
        </div>
      </main>
      <Footer />
    </>
  );
}
