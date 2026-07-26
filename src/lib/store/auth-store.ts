import { create } from "zustand";
import { createClient } from "@/lib/supabase/client";

/**
 * Real authentication backed by Supabase Auth + the `profiles` table.
 * Replaces the old localStorage-only mock. The public shape (currentUser(),
 * signUp, logIn, logOut, markOrdered) is kept the same so existing pages
 * don't need to be rewritten from scratch — signUp/logIn are now async and
 * must be awaited by callers.
 */

export type AuthedUser = {
  id: string;
  name: string;
  email: string;
  role: "customer" | "staff";
  staffRole: "owner" | "manager" | "staff" | null;
  hasOrderedBefore: boolean;
  emailOptIn: boolean;
  createdAt: string;
};

type AuthState = {
  user: AuthedUser | null;
  initialized: boolean;
  init: () => Promise<void>;
  signUp: (name: string, email: string, password: string) => Promise<{ ok: boolean; error?: string; user?: AuthedUser | null }>;
  logIn: (email: string, password: string) => Promise<{ ok: boolean; error?: string; user?: AuthedUser | null }>;
  logOut: () => Promise<void>;
  markOrdered: (email: string) => Promise<void>;
  changePassword: (newPassword: string) => Promise<{ ok: boolean; error?: string }>;
  setEmailOptIn: (value: boolean) => Promise<{ ok: boolean; error?: string }>;
  currentUser: () => AuthedUser | null;
};

async function loadProfile(supabase: ReturnType<typeof createClient>, userId: string, email: string): Promise<AuthedUser | null> {
  const { data, error } = await supabase.from("profiles").select("*").eq("id", userId).single();
  if (error || !data) return null;
  return {
    id: data.id,
    name: data.name ?? email,
    email: data.email,
    role: data.role,
    staffRole: data.staff_role,
    hasOrderedBefore: data.has_ordered_before,
    emailOptIn: data.email_opt_in ?? true,
    createdAt: data.created_at,
  };
}

export const useAuthStore = create<AuthState>()((set, get) => ({
  user: null,
  initialized: false,

  init: async () => {
    if (get().initialized) return;
    const supabase = createClient();

    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (session?.user) {
      const profile = await loadProfile(supabase, session.user.id, session.user.email ?? "");
      set({ user: profile, initialized: true });
    } else {
      set({ user: null, initialized: true });
    }

    supabase.auth.onAuthStateChange(async (_event, newSession) => {
      if (newSession?.user) {
        const profile = await loadProfile(supabase, newSession.user.id, newSession.user.email ?? "");
        set({ user: profile });
      } else {
        set({ user: null });
      }
    });
  },

  signUp: async (name, email, password) => {
    const supabase = createClient();
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { name } },
    });
    if (error) return { ok: false, error: error.message };
    if (data.user) {
      // If "confirm email" is off in your Supabase Auth settings, a session
      // comes back immediately. If it's on, the user must click the emailed
      // link before data.session exists.
      if (data.session) {
        const profile = await loadProfile(supabase, data.user.id, email);
        set({ user: profile });
      }
    }
    return { ok: true };
  },

  logIn: async (email, password) => {
    const supabase = createClient();
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) return { ok: false, error: error.message };
    if (!data.user) return { ok: false, error: "Something went wrong." };
    const profile = await loadProfile(supabase, data.user.id, email);
    set({ user: profile });
    return { ok: true, user: profile };
  },

  logOut: async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    set({ user: null });
  },

  markOrdered: async () => {
    const user = get().user;
    if (!user) return;
    const supabase = createClient();
    await supabase.from("profiles").update({ has_ordered_before: true }).eq("id", user.id);
    set({ user: { ...user, hasOrderedBefore: true } });
  },

  changePassword: async (newPassword) => {
    const supabase = createClient();
    const { error } = await supabase.auth.updateUser({ password: newPassword });
    if (error) return { ok: false, error: error.message };
    return { ok: true };
  },

  setEmailOptIn: async (value) => {
    const user = get().user;
    if (!user) return { ok: false, error: "Not logged in." };
    const previous = user.emailOptIn;
    set({ user: { ...user, emailOptIn: value } }); // optimistic
    const supabase = createClient();
    const { error } = await supabase.from("profiles").update({ email_opt_in: value }).eq("id", user.id);
    if (error) {
      set({ user: { ...user, emailOptIn: previous } }); // revert
      return { ok: false, error: error.message };
    }
    return { ok: true };
  },

  currentUser: () => get().user,
}));
