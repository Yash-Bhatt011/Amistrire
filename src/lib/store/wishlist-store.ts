import { create } from "zustand";
import { persist } from "zustand/middleware";

type WishlistState = {
  slugs: string[];
  toggle: (slug: string) => void;
  has: (slug: string) => boolean;
};

export const useWishlistStore = create<WishlistState>()(
  persist(
    (set, get) => ({
      slugs: [],
      toggle: (slug) =>
        set({
          slugs: get().slugs.includes(slug)
            ? get().slugs.filter((s) => s !== slug)
            : [...get().slugs, slug],
        }),
      has: (slug) => get().slugs.includes(slug),
    }),
    { name: "amistrie-wishlist" }
  )
);
