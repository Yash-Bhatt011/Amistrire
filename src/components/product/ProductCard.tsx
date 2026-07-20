"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Heart, Star } from "lucide-react";
import type { Product } from "@/lib/types";
import { formatINR, cn } from "@/lib/utils";
import { Badge } from "@/components/ui/Badge";
import { useWishlistStore } from "@/lib/store/wishlist-store";
import { useQuickViewStore } from "@/lib/store/quick-view-store";

export function ProductCard({ product, index = 0 }: { product: Product; index?: number }) {
  const wishlisted = useWishlistStore((s) => s.has(product.slug));
  const toggleWishlist = useWishlistStore((s) => s.toggle);
  const openQuickView = useQuickViewStore((s) => s.open);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1], delay: (index % 4) * 0.06 }}
      className="group relative overflow-hidden rounded-2xl border border-studio-line bg-studio-panel"
    >
      <button
        onClick={(e) => {
          e.preventDefault();
          toggleWishlist(product.slug);
        }}
        aria-label="Toggle wishlist"
        className="absolute right-3 top-3 z-10 rounded-full border border-white/10 bg-black/40 p-2 backdrop-blur-sm transition-colors hover:border-accent-cyan"
      >
        <Heart
          className={cn("h-3.5 w-3.5", wishlisted ? "fill-accent-purple text-accent-purple" : "text-studio-ink/60")}
        />
      </button>

      <Link href={`/products/${product.categorySlug}/${product.slug}`} className="block">
        <div
          className={cn(
            "relative flex h-44 items-center justify-center overflow-hidden",
            product.accent === "purple"
              ? "bg-gradient-to-br from-accent-purple/15 via-studio-panel to-studio-panel"
              : "bg-gradient-to-br from-accent-cyan/15 via-studio-panel to-studio-panel"
          )}
        >
          <div
            className={cn(
              "h-20 w-20 rounded-2xl border transition-transform duration-500 ease-cinematic group-hover:scale-110 group-hover:rotate-6",
              product.accent === "purple" ? "border-accent-purple/40 bg-accent-purple/10" : "border-accent-cyan/40 bg-accent-cyan/10"
            )}
          />
          {product.badges?.[0] && (
            <div className="absolute left-3 top-3">
              <Badge kind={product.badges[0]} />
            </div>
          )}
          <button
            onClick={(e) => {
              e.preventDefault();
              openQuickView(product);
            }}
            className="absolute bottom-3 left-1/2 -translate-x-1/2 translate-y-2 rounded-full border border-white/15 bg-black/60 px-3 py-1.5 text-[10px] uppercase tracking-wider text-white opacity-0 backdrop-blur-sm transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100"
          >
            Quick View
          </button>
        </div>

        <div className="p-4">
          <div className="overflow-hidden">
            <motion.p
              initial={{ y: "100%" }}
              whileInView={{ y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              className="font-display text-sm text-studio-ink"
            >
              {product.name}
            </motion.p>
          </div>
          <p className="mt-1 text-xs text-studio-ink/50">{product.tagline}</p>

          <div className="mt-3 flex items-center justify-between">
            <span className="font-mono text-sm text-studio-ink">{formatINR(product.basePrice)}</span>
            <span className="flex items-center gap-1 text-[11px] text-studio-ink/40">
              <Star className="h-3 w-3 fill-accent-cyan text-accent-cyan" />
              {product.rating} ({product.reviewCount})
            </span>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
