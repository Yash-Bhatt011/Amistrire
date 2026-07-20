import { create } from "zustand";
import { persist } from "zustand/middleware";

type RecentlyViewedState = {
  slugs: string[];
  record: (slug: string) => void;
};

export const useRecentlyViewedStore = create<RecentlyViewedState>()(
  persist(
    (set, get) => ({
      slugs: [],
      record: (slug) => {
        const filtered = get().slugs.filter((s) => s !== slug);
        set({ slugs: [slug, ...filtered].slice(0, 8) });
      },
    }),
    { name: "amistrie-recently-viewed" }
  )
);
