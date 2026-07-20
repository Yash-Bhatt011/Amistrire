import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Address, Order } from "../types";

type SavedDesign = {
  id: string;
  productSlug: string;
  name: string;
  selectedOptions: Record<string, string>;
  savedAt: string;
};

type AccountDataState = {
  addressesByEmail: Record<string, Address[]>;
  ordersByEmail: Record<string, Order[]>;
  savedDesignsByEmail: Record<string, SavedDesign[]>;
  addAddress: (email: string, address: Omit<Address, "id">) => void;
  removeAddress: (email: string, id: string) => void;
  addOrder: (email: string, order: Order) => void;
  saveDesign: (email: string, design: Omit<SavedDesign, "id" | "savedAt">) => void;
};

export const useAccountDataStore = create<AccountDataState>()(
  persist(
    (set, get) => ({
      addressesByEmail: {},
      ordersByEmail: {},
      savedDesignsByEmail: {},
      addAddress: (email, address) => {
        const list = get().addressesByEmail[email] ?? [];
        const withId: Address = { ...address, id: `addr_${Date.now()}` };
        set({ addressesByEmail: { ...get().addressesByEmail, [email]: [...list, withId] } });
      },
      removeAddress: (email, id) => {
        const list = get().addressesByEmail[email] ?? [];
        set({
          addressesByEmail: { ...get().addressesByEmail, [email]: list.filter((a) => a.id !== id) },
        });
      },
      addOrder: (email, order) => {
        const list = get().ordersByEmail[email] ?? [];
        set({ ordersByEmail: { ...get().ordersByEmail, [email]: [order, ...list] } });
      },
      saveDesign: (email, design) => {
        const list = get().savedDesignsByEmail[email] ?? [];
        const withId: SavedDesign = { ...design, id: `design_${Date.now()}`, savedAt: new Date().toISOString() };
        set({ savedDesignsByEmail: { ...get().savedDesignsByEmail, [email]: [...list, withId] } });
      },
    }),
    { name: "amistrie-account-data" }
  )
);
