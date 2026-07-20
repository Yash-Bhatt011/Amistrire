"use client";

import { useState } from "react";
import Link from "next/link";
import { Navbar } from "@/components/ui/Navbar";
import { Footer } from "@/components/ui/Footer";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);

  return (
    <>
      <Navbar />
      <main className="mx-auto flex min-h-[70vh] max-w-sm flex-col justify-center px-6 py-32 sm:px-0">
        <p className="font-mono text-xs uppercase tracking-[0.2em] text-accent-cyan">Account Recovery</p>
        <h1 className="mt-3 font-display text-3xl text-studio-ink">Forgot Password</h1>
        <p className="mt-3 text-sm text-studio-ink/50">
          Enter the email on your account and we'll send a reset link.
        </p>

        {sent ? (
          <div className="mt-8 rounded-lg border border-accent-cyan/30 bg-accent-cyan/10 p-4 text-sm text-accent-cyan">
            If an account exists for {email}, a reset link is on its way.
          </div>
        ) : (
          <form
            onSubmit={(e) => {
              e.preventDefault();
              setSent(true);
            }}
            className="mt-8 flex flex-col gap-4"
          >
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email"
              className="rounded-lg border border-studio-line bg-studio-panel px-4 py-3 text-sm text-studio-ink placeholder:text-studio-ink/30 focus:border-accent-cyan focus:outline-none"
            />
            <button
              type="submit"
              className="mt-2 rounded-full bg-gradient-to-r from-accent-cyan to-accent-purple py-3 text-xs font-medium uppercase tracking-wider text-studio-void hover:scale-[1.02]"
            >
              Send Reset Link
            </button>
          </form>
        )}

        <Link href="/account/login" className="mt-6 text-center text-xs text-studio-ink/40 hover:text-studio-ink">
          Back to log in
        </Link>
      </main>
      <Footer />
    </>
  );
}
