import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { CartLine, CartLineOptions } from "../types";

type CartState = {
  lines: CartLine[];
  isMiniCartOpen: boolean;
  lastAdded: string | null;
  addLine: (productSlug: string, unitPrice: number, options: CartLineOptions, quantity?: number) => void;
  removeLine: (id: string) => void;
  setQuantity: (id: string, quantity: number) => void;
  clear: () => void;
  openMiniCart: () => void;
  closeMiniCart: () => void;
};

function lineId(productSlug: string, options: CartLineOptions) {
  return `${productSlug}::${JSON.stringify(options)}`;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      lines: [],
      isMiniCartOpen: false,
      lastAdded: null,
      addLine: (productSlug, unitPrice, options, quantity = 1) => {
        const id = lineId(productSlug, options);
        const existing = get().lines.find((l) => l.id === id);
        if (existing) {
          set({
            lines: get().lines.map((l) =>
              l.id === id ? { ...l, quantity: l.quantity + quantity } : l
            ),
            lastAdded: id,
            isMiniCartOpen: true,
          });
        } else {
          set({
            lines: [...get().lines, { id, productSlug, quantity, selectedOptions: options, unitPrice }],
            lastAdded: id,
            isMiniCartOpen: true,
          });
        }
      },
      removeLine: (id) => set({ lines: get().lines.filter((l) => l.id !== id) }),
      setQuantity: (id, quantity) =>
        set({
          lines: get().lines.map((l) => (l.id === id ? { ...l, quantity: Math.max(1, quantity) } : l)),
        }),
      clear: () => set({ lines: [] }),
      openMiniCart: () => set({ isMiniCartOpen: true }),
      closeMiniCart: () => set({ isMiniCartOpen: false }),
    }),
    { name: "amistrie-cart" }
  )
);

export function cartSubtotal(lines: CartLine[]): number {
  return lines.reduce((sum, l) => sum + l.unitPrice * l.quantity, 0);
}

export function cartItemCount(lines: CartLine[]): number {
  return lines.reduce((sum, l) => sum + l.quantity, 0);
}
