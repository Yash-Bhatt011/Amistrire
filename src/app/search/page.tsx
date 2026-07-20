"use client";

import { Suspense, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Search as SearchIcon } from "lucide-react";
import { Navbar } from "@/components/ui/Navbar";
import { Footer } from "@/components/ui/Footer";
import { PageHeader } from "@/components/ui/PageHeader";
import { ProductCard } from "@/components/product/ProductCard";
import { useSearchProducts } from "@/lib/catalog-hooks";

function SearchResults() {
  const params = useSearchParams();
  const [query, setQuery] = useState(params.get("q") ?? "");
  const results = useSearchProducts(query);

  return (
    <main className="mx-auto max-w-6xl px-6 py-12 sm:px-12">
      <div className="relative mx-auto mb-10 max-w-xl">
        <SearchIcon className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-studio-ink/30" />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search products..."
          className="w-full rounded-full border border-studio-line bg-studio-panel py-3 pl-11 pr-4 text-sm text-studio-ink placeholder:text-studio-ink/30 focus:border-accent-cyan focus:outline-none"
        />
      </div>

      {query.length === 0 ? (
        <p className="text-center text-sm text-studio-ink/40">Start typing to search the catalog.</p>
      ) : results.length === 0 ? (
        <p className="text-center text-sm text-studio-ink/40">No products match &ldquo;{query}&rdquo;.</p>
      ) : (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {results.map((p, i) => (
            <ProductCard key={p.slug} product={p} index={i} />
          ))}
        </div>
      )}
    </main>
  );
}

export default function SearchPage() {
  return (
    <>
      <Navbar />
      <PageHeader eyebrow="Search" title="Find a Product" />
      <Suspense fallback={null}>
        <SearchResults />
      </Suspense>
      <Footer />
    </>
  );
}
