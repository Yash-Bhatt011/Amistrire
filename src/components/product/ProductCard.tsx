"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import { motion, type PanInfo } from "framer-motion";
import { Heart, Star, ChevronLeft, ChevronRight, Box } from "lucide-react";
import type { Product } from "@/lib/types";
import { formatINR, cn } from "@/lib/utils";
import { Badge } from "@/components/ui/Badge";
import { useWishlistStore } from "@/lib/store/wishlist-store";
import { useQuickViewStore } from "@/lib/store/quick-view-store";
import { ProductModelViewer } from "./ProductModelViewer";

export function ProductCard({ product, index = 0 }: { product: Product; index?: number }) {
  const wishlisted = useWishlistStore((s) => s.has(product.slug));
  const toggleWishlist = useWishlistStore((s) => s.toggle);
  const openQuickView = useQuickViewStore((s) => s.open);

  const images = product.media?.images ?? [];
  const modelUrl = product.media?.modelUrl;

  const [imgIndex, setImgIndex] = useState(0);
  const [showModel, setShowModel] = useState(false);
  const draggedRef = useRef(false);

  function next() {
    setImgIndex((i) => (i + 1) % images.length);
  }
  function prev() {
    setImgIndex((i) => (i - 1 + images.length) % images.length);
  }

  function handleDragEnd(_e: unknown, info: PanInfo) {
    if (Math.abs(info.offset.x) > 40) {
      draggedRef.current = true;
      if (info.offset.x < 0) next();
      else prev();
    }
  }

  // Swallow the click that follows a drag so it doesn't also trigger the
  // card's <Link> navigation.
  function handleClickCapture(e: React.MouseEvent) {
    if (draggedRef.current) {
      e.preventDefault();
      e.stopPropagation();
      draggedRef.current = false;
    }
  }

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

      <Link
        href={`/products/${product.categorySlug}/${product.slug}`}
        className="block"
        onClickCapture={handleClickCapture}
      >
        <div
          onMouseEnter={() => modelUrl && setShowModel(true)}
          onMouseLeave={() => setShowModel(false)}
          className={cn(
            "relative flex h-44 items-center justify-center overflow-hidden touch-pan-y",
            product.accent === "purple"
              ? "bg-gradient-to-br from-accent-purple/15 via-studio-panel to-studio-panel"
              : "bg-gradient-to-br from-accent-cyan/15 via-studio-panel to-studio-panel"
          )}
        >
          {showModel && modelUrl ? (
            <ProductModelViewer url={modelUrl} className="h-full w-full" />
          ) : images.length > 0 ? (
            <motion.div
              drag={images.length > 1 ? "x" : false}
              dragConstraints={{ left: 0, right: 0 }}
              dragElastic={0.15}
              onDragEnd={handleDragEnd}
              className="h-full w-full cursor-grab active:cursor-grabbing"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={images[imgIndex]}
                alt={product.seo?.imageAlt ?? product.name}
                loading="lazy"
                draggable={false}
                className="h-full w-full select-none object-cover transition-transform duration-500 ease-cinematic group-hover:scale-110"
              />
            </motion.div>
          ) : (
            <div
              className={cn(
                "h-20 w-20 rounded-2xl border transition-transform duration-500 ease-cinematic group-hover:scale-110 group-hover:rotate-6",
                product.accent === "purple" ? "border-accent-purple/40 bg-accent-purple/10" : "border-accent-cyan/40 bg-accent-cyan/10"
              )}
            />
          )}

          {/* Image swipe arrows + dots (only when there are multiple images and the model isn't showing) */}
          {!showModel && images.length > 1 && (
            <>
              <button
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  prev();
                }}
                aria-label="Previous image"
                className="absolute left-1.5 top-1/2 z-10 -translate-y-1/2 rounded-full bg-black/40 p-1 text-white opacity-0 backdrop-blur-sm transition-opacity group-hover:opacity-100"
              >
                <ChevronLeft className="h-3.5 w-3.5" />
              </button>
              <button
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  next();
                }}
                aria-label="Next image"
                className="absolute right-1.5 top-1/2 z-10 -translate-y-1/2 rounded-full bg-black/40 p-1 text-white opacity-0 backdrop-blur-sm transition-opacity group-hover:opacity-100"
              >
                <ChevronRight className="h-3.5 w-3.5" />
              </button>
              <div className="absolute bottom-8 left-1/2 z-10 flex -translate-x-1/2 gap-1">
                {images.map((_, i) => (
                  <span
                    key={i}
                    className={cn("h-1 w-1 rounded-full", i === imgIndex ? "bg-white" : "bg-white/40")}
                  />
                ))}
              </div>
            </>
          )}

          {/* Tap-to-view-model badge for touch devices (hover doesn't apply there) */}
          {modelUrl && (
            <button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setShowModel((v) => !v);
              }}
              aria-label="Toggle 3D view"
              className={cn(
                "absolute bottom-2 right-2 z-10 flex items-center gap-1 rounded-full border border-white/15 bg-black/50 px-2 py-1 text-[10px] uppercase tracking-wider text-white backdrop-blur-sm transition-opacity",
                showModel ? "opacity-100" : "opacity-0 group-hover:opacity-100 sm:opacity-0"
              )}
            >
              <Box className="h-3 w-3" /> {showModel ? "Photos" : "3D"}
            </button>
          )}

          {product.badges?.[0] && (
            <div className="absolute left-3 top-3">
              <Badge kind={product.badges[0]} />
            </div>
          )}
          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
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
