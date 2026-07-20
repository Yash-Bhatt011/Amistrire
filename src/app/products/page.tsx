"use client";

import { useMemo, useState } from "react";
import { Navbar } from "@/components/ui/Navbar";
import { Footer } from "@/components/ui/Footer";
import { PageHeader } from "@/components/ui/PageHeader";
import { ProductCard } from "@/components/product/ProductCard";
import { useActiveProducts, useCategories } from "@/lib/catalog-hooks";
import { cn } from "@/lib/utils";

const SORTS = [
  { key: "popular", label: "Popular" },
  { key: "newest", label: "Newest" },
  { key: "price-asc", label: "Price: Low to High" },
  { key: "price-desc", label: "Price: High to Low" },
] as const;

export default function ProductsPage() {
  const allProducts = useActiveProducts();
  const categories = useCategories();
  const [category, setCategory] = useState<string | null>(null);
  const [maxPrice, setMaxPrice] = useState(3000);
  const [sort, setSort] = useState<(typeof SORTS)[number]["key"]>("popular");

  const products = useMemo(() => {
    let list = allProducts.filter((p) => p.basePrice <= maxPrice);
    if (category) list = list.filter((p) => p.categorySlug === category);
    switch (sort) {
      case "newest":
        list = [...list].sort((a, b) => (b.badges?.includes("new") ? 1 : 0) - (a.badges?.includes("new") ? 1 : 0));
        break;
      case "price-asc":
        list = [...list].sort((a, b) => a.basePrice - b.basePrice);
        break;
      case "price-desc":
        list = [...list].sort((a, b) => b.basePrice - a.basePrice);
        break;
      default:
        list = [...list].sort((a, b) => b.rating - a.rating);
    }
    return list;
  }, [allProducts, category, maxPrice, sort]);

  return (
    <>
      <Navbar />
      <PageHeader eyebrow="Full Catalog" title="All Products" description="Every printable item we offer, filterable by category, price, and material." />

      <main className="mx-auto max-w-6xl px-6 py-12 sm:px-12">
        <div className="flex flex-col gap-8 lg:flex-row">
          <aside className="lg:w-56 lg:shrink-0">
            <p className="mb-3 text-xs uppercase tracking-wider text-studio-ink/30">Category</p>
            <div className="flex flex-col gap-1">
              <button
                onClick={() => setCategory(null)}
                className={cn("rounded-lg px-3 py-2 text-left text-xs", !category ? "bg-studio-concrete text-studio-ink" : "text-studio-ink/50 hover:text-studio-ink")}
              >
                All Categories
              </button>
              {categories.map((c) => (
                <button
                  key={c.slug}
                  onClick={() => setCategory(c.slug)}
                  className={cn(
                    "rounded-lg px-3 py-2 text-left text-xs",
                    category === c.slug ? "bg-studio-concrete text-studio-ink" : "text-studio-ink/50 hover:text-studio-ink"
                  )}
                >
                  {c.name}
                </button>
              ))}
            </div>

            <p className="mb-3 mt-8 text-xs uppercase tracking-wider text-studio-ink/30">Max Price: ₹{maxPrice}</p>
            <input
              type="range"
              min={200}
              max={3000}
              step={100}
              value={maxPrice}
              onChange={(e) => setMaxPrice(Number(e.target.value))}
              className="w-full accent-accent-cyan"
            />
          </aside>

          <div className="flex-1">
            <div className="mb-6 flex items-center justify-between">
              <p className="text-xs text-studio-ink/40">{products.length} products</p>
              <div className="flex gap-1 rounded-full border border-studio-line p-1">
                {SORTS.map((s) => (
                  <button
                    key={s.key}
                    onClick={() => setSort(s.key)}
                    className={cn(
                      "rounded-full px-3 py-1.5 text-[11px]",
                      sort === s.key ? "bg-accent-cyan/10 text-accent-cyan" : "text-studio-ink/40 hover:text-studio-ink"
                    )}
                  >
                    {s.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
              {products.map((p, i) => (
                <ProductCard key={p.slug} product={p} index={i} />
              ))}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
