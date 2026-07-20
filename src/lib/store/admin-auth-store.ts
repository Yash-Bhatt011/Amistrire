import { create } from "zustand";
import { persist } from "zustand/middleware";

export type StaffRole = "owner" | "manager" | "staff";

type StaffAccount = {
  name: string;
  email: string;
  password: string; // demo only — never do this with a real backend
  role: StaffRole;
};

type AdminAuthState = {
  staff: StaffAccount[];
  currentEmail: string | null;
  logIn: (email: string, password: string) => { ok: boolean; error?: string };
  logOut: () => void;
  currentStaff: () => StaffAccount | null;
  inviteStaff: (name: string, email: string, password: string, role: StaffRole) => { ok: boolean; error?: string };
  removeStaff: (email: string) => void;
};

const DEFAULT_OWNER: StaffAccount = {
  name: "Owner",
  email: "owner@amistrie.com",
  password: "amistrie2026",
  role: "owner",
};

export const useAdminAuthStore = create<AdminAuthState>()(
  persist(
    (set, get) => ({
      staff: [DEFAULT_OWNER],
      currentEmail: null,

      logIn: (email, password) => {
        const staff = get().staff ?? [];
        const account = staff.find((a) => a.email.toLowerCase() === email.toLowerCase());
        if (!account) return { ok: false, error: "No staff account found with this email." };
        if (account.password !== password) return { ok: false, error: "Incorrect password." };
        set({ currentEmail: email });
        return { ok: true };
      },

      logOut: () => set({ currentEmail: null }),

      currentStaff: () => {
        const { staff, currentEmail } = get();
        if (!currentEmail) return null;
        return (staff ?? []).find((a) => a.email.toLowerCase() === currentEmail.toLowerCase()) ?? null;
      },

      inviteStaff: (name, email, password, role) => {
        const staff = get().staff ?? [];
        if (staff.some((a) => a.email.toLowerCase() === email.toLowerCase())) {
          return { ok: false, error: "A staff account with this email already exists." };
        }
        set({ staff: [...staff, { name, email, password, role }] });
        return { ok: true };
      },

      removeStaff: (email) => {
        set({ staff: (get().staff ?? []).filter((a) => a.email.toLowerCase() !== email.toLowerCase()) });
      },
    }),
    {
      name: "amistrie-admin-auth",
      merge: (persisted, current) => {
        const p = (persisted ?? {}) as Partial<AdminAuthState>;
        return {
          ...current,
          staff: Array.isArray(p.staff) && p.staff.length > 0 ? p.staff : current.staff,
          currentEmail: typeof p.currentEmail === "string" ? p.currentEmail : current.currentEmail,
        };
      },
    }
  )
);
