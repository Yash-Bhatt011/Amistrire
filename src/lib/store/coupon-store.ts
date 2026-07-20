import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Coupon } from "../types";
import { COUPONS as SEED_COUPONS } from "../promo-data";

type CouponStoreState = {
  coupons: Coupon[];
  addCoupon: (c: Coupon) => void;
  updateCoupon: (code: string, patch: Partial<Coupon>) => void;
  deleteCoupon: (code: string) => void;
};

export const useCouponStore = create<CouponStoreState>()(
  persist(
    (set, get) => ({
      coupons: SEED_COUPONS,
      addCoupon: (c) => set({ coupons: [...(get().coupons ?? []), c] }),
      updateCoupon: (code, patch) =>
        set({ coupons: (get().coupons ?? []).map((c) => (c.code === code ? { ...c, ...patch } : c)) }),
      deleteCoupon: (code) => set({ coupons: (get().coupons ?? []).filter((c) => c.code !== code) }),
    }),
    {
      name: "amistrie-coupons",
      merge: (persisted, current) => {
        const p = (persisted ?? {}) as Partial<CouponStoreState>;
        return { ...current, coupons: Array.isArray(p.coupons) ? p.coupons : current.coupons };
      },
    }
  )
);
