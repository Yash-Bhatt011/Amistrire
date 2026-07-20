import { create } from "zustand";
import type { Coupon } from "./types";
import { useCartStore, cartSubtotal } from "./store/cart-store";

type CouponSessionState = {
  applied: Coupon[];
  apply: (coupon: Coupon) => void;
  remove: (code: string) => void;
  clearAll: () => void;
};

const useCouponSessionStore = create<CouponSessionState>((set, get) => ({
  applied: [],
  apply: (coupon) => set({ applied: [...get().applied, coupon] }),
  remove: (code) => set({ applied: get().applied.filter((c) => c.code !== code) }),
  clearAll: () => set({ applied: [] }),
}));

export function useCouponSession() {
  const applied = useCouponSessionStore((s) => s.applied);
  const apply = useCouponSessionStore((s) => s.apply);
  const remove = useCouponSessionStore((s) => s.remove);
  const clearAll = useCouponSessionStore((s) => s.clearAll);
  const lines = useCartStore((s) => s.lines);
  const subtotal = cartSubtotal(lines);

  const freeShipping = applied.some((c) => c.type === "free-shipping");
  const discount = applied.reduce((sum, c) => {
    if (c.type === "percentage") return sum + Math.round((subtotal * c.value) / 100);
    if (c.type === "fixed") return sum + c.value;
    return sum;
  }, 0);

  return { applied, apply, remove, clearAll, discount: Math.min(discount, subtotal), freeShipping };
}
