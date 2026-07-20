"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Product, Category } from "../types";
import { PRODUCTS as SEED_PRODUCTS, CATEGORIES as SEED_CATEGORIES } from "../product-data";

export type CatalogState = {
  products: Product[];
  categories: Category[];
  addProduct: (p: Product) => void;
  updateProduct: (slug: string, patch: Partial<Product>) => void;
  deleteProduct: (slug: string) => void;
  duplicateProduct: (slug: string) => void;
  toggleArchiveProduct: (slug: string) => void;
  addCategory: (c: Category) => void;
  updateCategory: (slug: string, patch: Partial<Category>) => void;
  deleteCategory: (slug: string) => void;
  resetToSeed: () => void;
};

export const useCatalogStore = create<CatalogState>()(
  persist(
    (set, get) => ({
      products: SEED_PRODUCTS,
      categories: SEED_CATEGORIES,

      addProduct: (p) => set({ products: [...get().products, p] }),

      updateProduct: (slug, patch) =>
        set({ products: get().products.map((p) => (p.slug === slug ? { ...p, ...patch } : p)) }),

      deleteProduct: (slug) => set({ products: get().products.filter((p) => p.slug !== slug) }),

      duplicateProduct: (slug) => {
        const source = get().products.find((p) => p.slug === slug);
        if (!source) return;
        const suffix = Date.now().toString().slice(-5);
        const copy: Product = {
          ...source,
          slug: `${source.slug}-copy-${suffix}`,
          name: `${source.name} (Copy)`,
          badges: undefined,
          featured: false,
        };
        set({ products: [...get().products, copy] });
      },

      toggleArchiveProduct: (slug) =>
        set({
          products: get().products.map((p) => (p.slug === slug ? { ...p, archived: !p.archived } : p)),
        }),

      addCategory: (c) => set({ categories: [...get().categories, c] }),

      updateCategory: (slug, patch) =>
        set({ categories: get().categories.map((c) => (c.slug === slug ? { ...c, ...patch } : c)) }),

      deleteCategory: (slug) => set({ categories: get().categories.filter((c) => c.slug !== slug) }),

      resetToSeed: () => set({ products: SEED_PRODUCTS, categories: SEED_CATEGORIES }),
    }),
    {
      name: "amistrie-catalog",
      version: 1,
      // Guards against stale/incompatible localStorage from earlier builds —
      // if a persisted field is missing or the wrong shape, fall back to the
      // current in-memory (seed) value instead of overwriting it with
      // undefined. This is what actually crashed useCategories/useActiveProducts
      // when an older cached blob didn't carry a `categories` array.
      merge: (persisted, current) => {
        const p = (persisted ?? {}) as Partial<CatalogState>;
        return {
          ...current,
          products: Array.isArray(p.products) ? p.products : current.products,
          categories: Array.isArray(p.categories) ? p.categories : current.categories,
        };
      },
    }
  )
);

// Non-hook read helpers for use in places that already have the live array
// (kept separate from the seed helpers in product-data.ts, which remain the
// static fallback/defaults used only to initialize this store).
export function activeProducts(products: Product[]): Product[] {
  return products.filter((p) => !p.archived);
}
