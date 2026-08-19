"use client";

import { create } from "zustand";
import type { Coupon } from "../types";
import { createClient } from "../supabase/client";
import { rowToCoupon, couponToRow, couponPatchToRow } from "../supabase/mappers";

type CouponStoreState = {
  coupons: Coupon[];
  hydrated: boolean;
  hydrate: () => Promise<void>;
  addCoupon: (c: Coupon) => Promise<void>;
  updateCoupon: (code: string, patch: Partial<Coupon>) => Promise<void>;
  deleteCoupon: (code: string) => Promise<void>;
};

let couponHydratePromise: Promise<void> | null = null;

export const useCouponStore = create<CouponStoreState>()((set, get) => ({
  coupons: [],
  hydrated: false,

  hydrate: () => {
    if (couponHydratePromise) return couponHydratePromise;
    couponHydratePromise = (async () => {
      const supabase = createClient();
      const { data } = await supabase.from("coupons").select("*");
      set({ coupons: (data ?? []).map(rowToCoupon), hydrated: true });
    })();
    return couponHydratePromise;
  },

  addCoupon: async (c) => {
    set({ coupons: [...get().coupons, c] }); // optimistic
    const supabase = createClient();
    const { error } = await supabase.from("coupons").insert(couponToRow(c));
    if (error) {
      console.error("addCoupon failed:", error.message);
      set({ coupons: get().coupons.filter((x) => x.code !== c.code) }); // revert
    }
  },

  updateCoupon: async (code, patch) => {
    const previous = get().coupons;
    set({ coupons: previous.map((c) => (c.code === code ? { ...c, ...patch } : c)) }); // optimistic
    const supabase = createClient();
    const { error } = await supabase.from("coupons").update(couponPatchToRow(patch)).eq("code", code);
    if (error) {
      console.error("updateCoupon failed:", error.message);
      set({ coupons: previous }); // revert
    }
  },

  deleteCoupon: async (code) => {
    const previous = get().coupons;
    set({ coupons: previous.filter((c) => c.code !== code) }); // optimistic
    const supabase = createClient();
    const { error } = await supabase.from("coupons").delete().eq("code", code);
    if (error) {
      console.error("deleteCoupon failed:", error.message);
      set({ coupons: previous }); // revert
    }
  },
}));
