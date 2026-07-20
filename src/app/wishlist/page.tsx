"use client";

import Link from "next/link";
import { Heart } from "lucide-react";
import { Navbar } from "@/components/ui/Navbar";
import { Footer } from "@/components/ui/Footer";
import { PageHeader } from "@/components/ui/PageHeader";
import { ProductCard } from "@/components/product/ProductCard";
import { useWishlistStore } from "@/lib/store/wishlist-store";
import { useAllProductsIncludingArchived, findProduct } from "@/lib/catalog-hooks";

export default function WishlistPage() {
  const slugs = useWishlistStore((s) => s.slugs);
  const allProducts = useAllProductsIncludingArchived();
  const products = slugs
    .map((slug) => findProduct(allProducts, slug))
    .filter((p): p is NonNullable<typeof p> => Boolean(p));

  return (
    <>
      <Navbar />
      <PageHeader eyebrow="Saved Items" title="Wishlist" />
      <main className="mx-auto max-w-6xl px-6 py-12 sm:px-12">
        {products.length === 0 ? (
          <div className="flex flex-col items-center py-16 text-center text-studio-ink/40">
            <Heart className="h-10 w-10" />
            <p className="mt-4 text-sm">Nothing saved yet.</p>
            <Link href="/products" className="mt-4 rounded-full border border-studio-line px-5 py-2 text-xs text-studio-ink hover:border-accent-cyan hover:text-accent-cyan">
              Browse Products
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {products.map((p, i) => (
              <ProductCard key={p.slug} product={p} index={i} />
            ))}
          </div>
        )}
      </main>
      <Footer />
    </>
  );
}
