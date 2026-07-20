"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { useFeatured, useBestSellers, useTrending, useNewArrivals } from "@/lib/catalog-hooks";
import { ProductCard } from "@/components/product/ProductCard";
import { cn } from "@/lib/utils";

const TAB_LABELS = [
  { key: "featured", label: "Featured Products" },
  { key: "bestsellers", label: "Best Sellers" },
  { key: "trending", label: "Trending Designs" },
  { key: "new", label: "Recently Added" },
] as const;

export function ProductShowcaseTabs() {
  const [active, setActive] = useState<(typeof TAB_LABELS)[number]["key"]>("featured");

  // Hooks must run unconditionally every render — pick the active result after.
  const featured = useFeatured();
  const bestsellers = useBestSellers();
  const trending = useTrending();
  const newArrivals = useNewArrivals();

  const products =
    active === "featured" ? featured : active === "bestsellers" ? bestsellers : active === "trending" ? trending : newArrivals;

  return (
    <section className="relative bg-studio-void px-6 py-24 sm:px-12">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        className="mx-auto max-w-3xl text-center"
      >
        <p className="font-mono text-xs uppercase tracking-[0.2em] text-accent-purple">
          The Shop
        </p>
        <h2 className="mt-4 font-display text-3xl text-studio-ink sm:text-5xl">
          What people are printing right now.
        </h2>
      </motion.div>

      <div className="mx-auto mt-10 flex max-w-3xl flex-wrap justify-center gap-2">
        {TAB_LABELS.map((t) => (
          <button
            key={t.key}
            onClick={() => setActive(t.key)}
            className={cn(
              "rounded-full border px-4 py-2 text-xs uppercase tracking-wider transition-colors",
              active === t.key
                ? "border-accent-cyan bg-accent-cyan/10 text-accent-cyan"
                : "border-studio-line text-studio-ink/50 hover:text-studio-ink"
            )}
          >
            {t.label}
          </button>
        ))}
      </div>

      <div className="mx-auto mt-10 grid max-w-6xl grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
        {products.length === 0 && (
          <p className="col-span-full py-10 text-center text-sm text-studio-ink/40">
            Nothing here yet — check back soon.
          </p>
        )}
        {products.map((p, i) => (
          <ProductCard key={p.slug} product={p} index={i} />
        ))}
      </div>

      <div className="mt-10 text-center">
        <Link
          href="/products"
          className="rounded-full border border-studio-line px-5 py-2 text-xs uppercase tracking-wider text-studio-ink transition-colors hover:border-accent-cyan hover:text-accent-cyan"
        >
          View All Products
        </Link>
      </div>
    </section>
  );
}
