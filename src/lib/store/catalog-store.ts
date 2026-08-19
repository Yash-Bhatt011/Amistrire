"use client";

import { create } from "zustand";
import type { Product, Category } from "../types";
import { createClient } from "../supabase/client";
import {
  rowToProduct,
  productToRow,
  productPatchToRow,
  rowToCategory,
  categoryToRow,
  categoryPatchToRow,
} from "../supabase/mappers";

/**
 * Real product/category catalog backed by Supabase (products + categories
 * tables). Kept as a zustand store purely as a client-side cache for
 * snappy, reactive UI — Supabase is the source of truth. All mutators are
 * async and update Supabase first, then the local cache. Public API
 * (addProduct, updateProduct, ...) is unchanged from the old mock version
 * so existing admin pages didn't need rewriting.
 */

export type CatalogState = {
  products: Product[];
  categories: Category[];
  hydrated: boolean;
  hydrate: () => Promise<void>;
  addProduct: (p: Product) => Promise<void>;
  updateProduct: (slug: string, patch: Partial<Product>) => Promise<void>;
  deleteProduct: (slug: string) => Promise<void>;
  duplicateProduct: (slug: string) => Promise<void>;
  toggleArchiveProduct: (slug: string) => Promise<void>;
  addCategory: (c: Category) => Promise<void>;
  updateCategory: (slug: string, patch: Partial<Category>) => Promise<void>;
  deleteCategory: (slug: string) => Promise<void>;
};

let catalogHydratePromise: Promise<void> | null = null;

export const useCatalogStore = create<CatalogState>()((set, get) => ({
  products: [],
  categories: [],
  hydrated: false,

  hydrate: () => {
    if (catalogHydratePromise) return catalogHydratePromise;
    catalogHydratePromise = (async () => {
      const supabase = createClient();
      const [{ data: productRows }, { data: categoryRows }] = await Promise.all([
        supabase.from("products").select("*"),
        supabase.from("categories").select("*"),
      ]);
      set({
        products: (productRows ?? []).map(rowToProduct),
        categories: (categoryRows ?? []).map(rowToCategory),
        hydrated: true,
      });
    })();
    return catalogHydratePromise;
  },

  addProduct: async (p) => {
    set({ products: [...get().products, p] }); // optimistic
    const supabase = createClient();
    const { error } = await supabase.from("products").insert(productToRow(p));
    if (error) {
      console.error("addProduct failed:", error.message);
      set({ products: get().products.filter((x) => x.slug !== p.slug) }); // revert
    }
  },

  updateProduct: async (slug, patch) => {
    const previous = get().products;
    set({ products: previous.map((p) => (p.slug === slug ? { ...p, ...patch } : p)) }); // optimistic
    const supabase = createClient();
    const { error } = await supabase.from("products").update(productPatchToRow(patch)).eq("slug", slug);
    if (error) {
      console.error("updateProduct failed:", error.message);
      set({ products: previous }); // revert
    }
  },

  deleteProduct: async (slug) => {
    const previous = get().products;
    set({ products: previous.filter((p) => p.slug !== slug) }); // optimistic
    const supabase = createClient();
    const { error } = await supabase.from("products").delete().eq("slug", slug);
    if (error) {
      console.error("deleteProduct failed:", error.message);
      set({ products: previous }); // revert
    }
  },

  duplicateProduct: async (slug) => {
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
    await get().addProduct(copy);
  },

  toggleArchiveProduct: async (slug) => {
    const product = get().products.find((p) => p.slug === slug);
    if (!product) return;
    await get().updateProduct(slug, { archived: !product.archived });
  },

  addCategory: async (c) => {
    set({ categories: [...get().categories, c] }); // optimistic
    const supabase = createClient();
    const { error } = await supabase.from("categories").insert(categoryToRow(c));
    if (error) {
      console.error("addCategory failed:", error.message);
      set({ categories: get().categories.filter((x) => x.slug !== c.slug) }); // revert
    }
  },

  updateCategory: async (slug, patch) => {
    const previous = get().categories;
    set({ categories: previous.map((c) => (c.slug === slug ? { ...c, ...patch } : c)) }); // optimistic
    const supabase = createClient();
    const { error } = await supabase.from("categories").update(categoryPatchToRow(patch)).eq("slug", slug);
    if (error) {
      console.error("updateCategory failed:", error.message);
      set({ categories: previous }); // revert
    }
  },

  deleteCategory: async (slug) => {
    const previous = get().categories;
    set({ categories: previous.filter((c) => c.slug !== slug) }); // optimistic
    const supabase = createClient();
    const { error } = await supabase.from("categories").delete().eq("slug", slug);
    if (error) {
      console.error("deleteCategory failed:", error.message);
      set({ categories: previous }); // revert
    }
  },
}));

// Non-hook read helper (unchanged).
export function activeProducts(products: Product[]): Product[] {
  return products.filter((p) => !p.archived);
}
