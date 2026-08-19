import "server-only";
import { createClient as createSupabaseClient } from "@supabase/supabase-js";
import type { Database } from "./types";

/**
 * SERVER-ONLY. Uses the service_role key, which bypasses Row Level
 * Security entirely. The `server-only` import above makes Next.js throw a
 * build error if this file is ever accidentally imported from client
 * code — the service_role key must never reach the browser.
 *
 * Used only by API routes that need to write authoritative, server-computed
 * data (order pricing, payment status) that no ordinary user session
 * should be able to write directly.
 */
export function createAdminClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !serviceKey) {
    throw new Error("NEXT_PUBLIC_SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY are not set on the server.");
  }
  return createSupabaseClient<Database>(url, serviceKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
}
