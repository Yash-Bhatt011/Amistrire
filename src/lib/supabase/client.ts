import { createBrowserClient } from "@supabase/ssr";
import type { Database } from "./types";

/**
 * Client-side Supabase client. Uses ONLY the public anon key — safe to ship
 * to the browser. Every table this touches must have Row Level Security
 * enabled (see supabase/schema.sql), since the anon key alone grants no
 * access beyond what RLS policies explicitly allow.
 */
export function createClient() {
  return createBrowserClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}
