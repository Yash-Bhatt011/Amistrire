import type { Product } from "@/lib/types";
import { ProductCard } from "./ProductCard";

export function RelatedProducts({ products, title = "Related Products" }: { products: Product[]; title?: string }) {
  if (products.length === 0) return null;
  return (
    <div className="mx-auto max-w-6xl px-6 py-16 sm:px-12">
      <p className="mb-6 font-display text-xl text-studio-ink">{title}</p>
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
        {products.map((p, i) => (
          <ProductCard key={p.slug} product={p} index={i} />
        ))}
      </div>
    </div>
  );
}
