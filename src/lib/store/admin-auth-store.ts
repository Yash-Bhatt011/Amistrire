import { create } from "zustand";
import { createClient } from "@/lib/supabase/client";
import { useAuthStore } from "./auth-store";

/**
 * Admin/staff auth. There's only one login system now (Supabase Auth) —
 * this store just checks the logged-in profile's `role`. Signing in here
 * uses the exact same Supabase credentials as a normal customer login; the
 * only difference is we reject (and sign back out) if the account isn't
 * marked role = 'staff' in the profiles table.
 */

export type StaffRole = "owner" | "manager" | "staff";

type AdminAuthState = {
  logIn: (email: string, password: string) => Promise<{ ok: boolean; error?: string }>;
  logOut: () => Promise<void>;
  currentStaff: () => { name: string; email: string; role: StaffRole } | null;
};

export const useAdminAuthStore = create<AdminAuthState>()((_set, _get) => ({
  logIn: async (email, password) => {
    const result = await useAuthStore.getState().logIn(email, password);
    if (!result.ok) return result;

    const user = result.user;
    if (!user || user.role !== "staff") {
      // Valid account, but not a staff/admin account — sign back out so a
      // customer session isn't left half-authenticated on the admin flow.
      const supabase = createClient();
      await supabase.auth.signOut();
      useAuthStore.setState({ user: null });
      return { ok: false, error: "This account doesn't have admin access." };
    }
    return { ok: true };
  },

  logOut: async () => {
    await useAuthStore.getState().logOut();
  },

  currentStaff: () => {
    const user = useAuthStore.getState().currentUser();
    if (!user || user.role !== "staff") return null;
    return { name: user.name, email: user.email, role: (user.staffRole ?? "staff") as StaffRole };
  },
}));
