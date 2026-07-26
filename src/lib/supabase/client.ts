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
    browserClient = createBrowserClient<Database>(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );
  }
  return browserClient;
}
