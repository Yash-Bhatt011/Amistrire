import { create } from "zustand";
import { persist } from "zustand/middleware";

/**
 * Client-side mock authentication. There is no backend behind this yet —
 * "accounts" live in localStorage on this device only. It exists so the
 * account/order-history/wishlist UI is fully wired end-to-end and ready to
 * swap onto real auth (e.g. Supabase) later without changing any component
 * that calls useAuthStore.
 */

type MockAccount = {
  name: string;
  email: string;
  password: string; // demo only — never do this with a real backend
  createdAt: string;
  hasOrderedBefore: boolean;
};

type AuthState = {
  accounts: MockAccount[];
  currentEmail: string | null;
  signUp: (name: string, email: string, password: string) => { ok: boolean; error?: string };
  logIn: (email: string, password: string) => { ok: boolean; error?: string };
  logOut: () => void;
  markOrdered: (email: string) => void;
  currentUser: () => MockAccount | null;
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      accounts: [],
      currentEmail: null,
      signUp: (name, email, password) => {
        const exists = get().accounts.some((a) => a.email.toLowerCase() === email.toLowerCase());
        if (exists) return { ok: false, error: "An account with this email already exists." };
        const account: MockAccount = {
          name,
          email,
          password,
          createdAt: new Date().toISOString(),
          hasOrderedBefore: false,
        };
        set({ accounts: [...get().accounts, account], currentEmail: email });
        return { ok: true };
      },
      logIn: (email, password) => {
        const account = get().accounts.find((a) => a.email.toLowerCase() === email.toLowerCase());
        if (!account) return { ok: false, error: "No account found with this email." };
        if (account.password !== password) return { ok: false, error: "Incorrect password." };
        set({ currentEmail: email });
        return { ok: true };
      },
      logOut: () => set({ currentEmail: null }),
      markOrdered: (email) =>
        set({
          accounts: get().accounts.map((a) =>
            a.email.toLowerCase() === email.toLowerCase() ? { ...a, hasOrderedBefore: true } : a
          ),
        }),
      currentUser: () => {
        const { accounts, currentEmail } = get();
        if (!currentEmail) return null;
        return accounts.find((a) => a.email.toLowerCase() === currentEmail.toLowerCase()) ?? null;
      },
    }),
    { name: "amistrie-auth" }
  )
);
