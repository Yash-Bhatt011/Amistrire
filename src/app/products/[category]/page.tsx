"use client";

import { use } from "react";
import { notFound } from "next/navigation";
import dynamic from "next/dynamic";
import { Navbar } from "@/components/ui/Navbar";
import { Footer } from "@/components/ui/Footer";
import { PageHeader } from "@/components/ui/PageHeader";
import { ProductCard } from "@/components/product/ProductCard";
import { useCategory, useProductsByCategory } from "@/lib/catalog-hooks";

const MiniShape3D = dynamic(() => import("@/components/scene/MiniShape3D").then((m) => m.MiniShape3D), {
  ssr: false,
});

export default function CategoryPage({ params }: { params: Promise<{ category: string }> }) {
  const { category: categorySlug } = use(params);
  const category = useCategory(categorySlug);
  const products = useProductsByCategory(categorySlug);

  if (!category) notFound();

  return (
    <>
      <Navbar />
      {category.banner3DShape ? (
        <div className="relative h-64 w-full overflow-hidden bg-gradient-to-br from-accent-cyan/10 to-accent-purple/10 pt-20">
          <MiniShape3D kind={category.banner3DShape} color="#2997ff" />
          <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center bg-gradient-to-t from-studio-void/70 via-transparent to-transparent pt-20 text-center">
            <p className="font-mono text-xs uppercase tracking-[0.2em] text-accent-cyan">Category</p>
            <h1 className="mt-2 font-display text-3xl text-studio-ink sm:text-5xl">{category.name}</h1>
            <p className="mt-2 text-sm text-studio-ink/60">{category.tagline}</p>
          </div>
        </div>
      ) : category.bannerImage ? (
        <div className="relative h-64 w-full overflow-hidden">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={category.bannerImage} alt="" className="h-full w-full object-cover" />
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/40 text-center">
            <p className="font-mono text-xs uppercase tracking-[0.2em] text-accent-cyan">Category</p>
            <h1 className="mt-2 font-display text-3xl text-white sm:text-5xl">{category.name}</h1>
            <p className="mt-2 text-sm text-white/70">{category.tagline}</p>
          </div>
        </div>
      ) : (
        <PageHeader eyebrow="Category" title={category.name} description={category.tagline} />
      )}
      <main className="mx-auto max-w-6xl px-6 py-16 sm:px-12">
        {products.length === 0 ? (
          <p className="py-16 text-center text-sm text-studio-ink/40">
            No products in this category yet — check back soon, or start a custom order.
          </p>
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
