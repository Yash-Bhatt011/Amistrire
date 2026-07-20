"use client";

import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { X, Star } from "lucide-react";
import type { Product } from "@/lib/types";
import { formatINR, cn } from "@/lib/utils";
import { useCartStore } from "@/lib/store/cart-store";

export function QuickViewModal({ product, onClose }: { product: Product | null; onClose: () => void }) {
  const addLine = useCartStore((s) => s.addLine);

  return (
    <AnimatePresence>
      {product && (
        <motion.div
          key="quick-view-root"
          className="fixed inset-0 z-[95] flex items-center justify-center p-4"
        >
          <motion.div
            key="quick-view-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/70 backdrop-blur-sm"
          />
          <motion.div
            key="quick-view-panel"
            initial={{ opacity: 0, scale: 0.95, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 16 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="relative z-[96] w-full max-w-lg rounded-2xl border border-studio-line bg-studio-panel p-6 shadow-2xl shadow-black/20"
          >
            <button onClick={onClose} aria-label="Close quick view" className="absolute right-4 top-4 text-studio-ink/40 hover:text-studio-ink">
              <X className="h-4 w-4" />
            </button>

            <div
              className={cn(
                "flex h-40 items-center justify-center rounded-xl border",
                product.accent === "purple"
                  ? "border-accent-purple/30 bg-gradient-to-br from-accent-purple/15 to-studio-panel"
                  : "border-accent-cyan/30 bg-gradient-to-br from-accent-cyan/15 to-studio-panel"
              )}
            >
              <div className="h-16 w-16 rounded-2xl border border-studio-line bg-studio-concrete" />
            </div>

            <p className="mt-5 font-display text-xl text-studio-ink">{product.name}</p>
            <p className="mt-1 text-sm text-studio-ink/50">{product.tagline}</p>
            <div className="mt-2 flex items-center gap-1.5">
              <Star className="h-3.5 w-3.5 fill-accent-cyan text-accent-cyan" />
              <span className="text-xs text-studio-ink/50">{product.rating} ({product.reviewCount})</span>
            </div>

            <div className="mt-4 flex items-center justify-between">
              <span className="font-mono text-lg text-studio-ink">{formatINR(product.basePrice)}</span>
              <span className="text-xs text-studio-ink/40">{product.printTimeHrs[0]}-{product.printTimeHrs[1]}h print time</span>
            </div>

            <div className="mt-6 flex gap-3">
              <button
                onClick={() => {
                  addLine(product.slug, product.basePrice, {});
                  onClose();
                }}
                className="flex-1 rounded-full bg-gradient-to-r from-accent-cyan to-accent-purple py-2.5 text-xs font-medium uppercase tracking-wider text-white hover:scale-[1.02]"
              >
                Quick Add
              </button>
              <Link
                href={`/products/${product.categorySlug}/${product.slug}`}
                onClick={onClose}
                className="flex-1 rounded-full border border-studio-line py-2.5 text-center text-xs uppercase tracking-wider text-studio-ink hover:border-accent-cyan hover:text-accent-cyan"
              >
                Full Details
              </Link>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
