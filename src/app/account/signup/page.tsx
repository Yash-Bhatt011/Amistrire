"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Navbar } from "@/components/ui/Navbar";
import { Footer } from "@/components/ui/Footer";
import { useAuthStore } from "@/lib/store/auth-store";

export default function SignupPage() {
  const router = useRouter();
  const signUp = useAuthStore((s) => s.signUp);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const result = await signUp(name, email, password);
    if (!result.ok) {
      setError(result.error ?? "Something went wrong.");
      return;
    }
    setDone(true);
    setTimeout(() => router.push("/account"), 900);
  }

  return (
    <>
      <Navbar />
      <main className="mx-auto flex min-h-[70vh] max-w-sm flex-col justify-center px-6 py-32 sm:px-0">
        <p className="font-mono text-xs uppercase tracking-[0.2em] text-accent-purple">Join Amistrié</p>
        <h1 className="mt-3 font-display text-3xl text-studio-ink">Create Account</h1>

        {done ? (
          <div className="mt-8 rounded-lg border border-accent-cyan/30 bg-accent-cyan/10 p-4 text-sm text-accent-cyan">
            A verification link has been sent to {email}. Redirecting you to your account...
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="mt-8 flex flex-col gap-4">
            <input
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Full name"
              className="rounded-lg border border-studio-line bg-studio-panel px-4 py-3 text-sm text-studio-ink placeholder:text-studio-ink/30 focus:border-accent-cyan focus:outline-none"
            />
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
              minLength={6}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password (min. 6 characters)"
              className="rounded-lg border border-studio-line bg-studio-panel px-4 py-3 text-sm text-studio-ink placeholder:text-studio-ink/30 focus:border-accent-cyan focus:outline-none"
            />
            {error && <p className="text-xs text-rose-400">{error}</p>}
            <button
              type="submit"
              className="mt-2 rounded-full bg-gradient-to-r from-accent-cyan to-accent-purple py-3 text-xs font-medium uppercase tracking-wider text-studio-void hover:scale-[1.02]"
            >
              Sign Up
            </button>
          </form>
        )}

        <div className="mt-6 text-center text-xs text-studio-ink/40">
          Already have an account?{" "}
          <Link href="/account/login" className="text-accent-cyan hover:underline">Log in</Link>
        </div>
      </main>
      <Footer />
    </>
  );
}
