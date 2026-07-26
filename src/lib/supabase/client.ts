import { createBrowserClient } from "@supabase/ssr";
import type { Database } from "./types";

/**
 * Client-side Supabase client — a SINGLETON. Creating a new client on every
 * call (the previous version of this file) leads to multiple GoTrueClient
 * instances each independently tracking auth state, which desyncs: stale
 * role reads right after login, logout that doesn't actually stick, etc.
 * One shared instance for the whole browser tab avoids all of that.
 *
 * Uses ONLY the public anon key — safe to ship to the browser. Every table
 * this touches must have Row Level Security enabled (see
 * supabase/schema.sql), since the anon key alone grants no access beyond
 * what RLS policies explicitly allow.
 */
let browserClient: ReturnType<typeof createBrowserClient<Database>> | undefined;

export function createClient() {
  if (!browserClient) {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (!url || !anonKey) {
      // This almost always means the env vars are set locally (.env.local)
      // but were never added to the deployment host — .env.local is
      // gitignored on purpose, so it never reaches Vercel/etc. on its own.
      // Symptoms without this check: uploads that don't persist, and being
      // logged out on every refresh, both with no obvious error.
      console.error(
        "[Supabase] NEXT_PUBLIC_SUPABASE_URL / NEXT_PUBLIC_SUPABASE_ANON_KEY are missing. " +
          "If this is a deployed site, add them in your host's environment variable settings " +
          "and redeploy — .env.local is not automatically picked up by Vercel/etc."
      );
    }

    browserClient = createBrowserClient<Database>(url ?? "", anonKey ?? "");
  }
  return browserClient;
}
