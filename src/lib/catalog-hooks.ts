"use client";

import { useMemo } from "react";
import { useShallow } from "zustand/react/shallow";
import { useCatalogStore } from "./store/catalog-store";
import type { Product, Category } from "./types";

// IMPORTANT: any selector that derives a new array/object (e.g. via .filter,
// .map, .slice) must be wrapped in useShallow. Without it, Zustand's
// useSyncExternalStore sees a new reference on every call and re-renders in
// an infinite loop ("Maximum update depth exceeded") even though the
// underlying state never changed.

export function useCategories(): Category[] {
  return useCatalogStore(useShallow((s) => (s.categories ?? []).filter((c) => !c.archived)));
}

export function useAllCategoriesIncludingArchived(): Category[] {
  return useCatalogStore((s) => s.categories ?? []);
}

export function useCategory(slug: string): Category | undefined {
  return useCatalogStore((s) => (s.categories ?? []).find((c) => c.slug === slug));
}

export function useActiveProducts(): Product[] {
  return useCatalogStore(useShallow((s) => (s.products ?? []).filter((p) => !p.archived)));
}

export function useAllProductsIncludingArchived(): Product[] {
  return useCatalogStore((s) => s.products ?? []);
}

export function useProductsByCategory(slug: string): Product[] {
  return useCatalogStore(
    useShallow((s) => (s.products ?? []).filter((p) => p.categorySlug === slug && !p.archived))
  );
}

export function useProduct(slug: string): Product | undefined {
  return useCatalogStore((s) => (s.products ?? []).find((p) => p.slug === slug));
}

export function useFeatured(): Product[] {
  return useCatalogStore(
    useShallow((s) => {
      const products = s.products ?? [];
      const flagged = products.filter((p) => !p.archived && p.featured);
      if (flagged.length > 0) return flagged.slice(0, 4);
      return products.filter((p) => !p.archived && p.badges?.includes("bestseller")).slice(0, 4);
    })
  );
}

export function useTrending(): Product[] {
  return useCatalogStore(
    useShallow((s) => (s.products ?? []).filter((p) => !p.archived && p.badges?.includes("trending")))
  );
}

export function useNewArrivals(): Product[] {
  return useCatalogStore(
    useShallow((s) => (s.products ?? []).filter((p) => !p.archived && p.badges?.includes("new")))
  );
}

export function useBestSellers(): Product[] {
  return useCatalogStore(
    useShallow((s) => (s.products ?? []).filter((p) => !p.archived && p.badges?.includes("bestseller")))
  );
}

export function useRelated(product: Product | undefined, count = 4): Product[] {
  const products = useCatalogStore((s) => s.products ?? []);
  return useMemo(() => {
    if (!product) return [];
    return products
      .filter((p) => p.categorySlug === product.categorySlug && p.slug !== product.slug && !p.archived)
      .slice(0, count);
  }, [products, product, count]);
}

export function useSearchProducts(query: string): Product[] {
  const products = useCatalogStore((s) => s.products ?? []);
  return useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return [];
    return products.filter(
      (p) =>
        !p.archived &&
        (p.name.toLowerCase().includes(q) ||
          p.tagline.toLowerCase().includes(q) ||
          p.categorySlug.includes(q))
    );
  }, [products, query]);
}

// Non-hook lookup for contexts where a hook can't be called (e.g. inside a
// callback or a plain helper function already inside a component body that
// has read the full products array via useAllProductsIncludingArchived/useActiveProducts).
export function findProduct(products: Product[], slug: string): Product | undefined {
  return (products ?? []).find((p) => p.slug === slug);
}
