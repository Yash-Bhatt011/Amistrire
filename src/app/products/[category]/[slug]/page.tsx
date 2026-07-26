"use client";

import { use, useEffect, useState } from "react";
import { notFound } from "next/navigation";
import { Star, Heart, Play, Box } from "lucide-react";
import { Navbar } from "@/components/ui/Navbar";
import { Footer } from "@/components/ui/Footer";
import { ConfigPanel } from "@/components/product/ConfigPanel";
import { ProductModelViewer } from "@/components/product/ProductModelViewer";
import { ARViewButton } from "@/components/product/ARViewButton";
import { RelatedProducts } from "@/components/product/RelatedProducts";
import { Badge } from "@/components/ui/Badge";
import { useProduct, useRelated } from "@/lib/catalog-hooks";
import { useRecentlyViewedStore } from "@/lib/store/recently-viewed-store";
import { useWishlistStore } from "@/lib/store/wishlist-store";
import { cn } from "@/lib/utils";

type ViewMode = { kind: "model" } | { kind: "video" } | { kind: "image"; index: number } | { kind: "placeholder" };

export default function ProductDetailPage({
  params,
}: {
  params: Promise<{ category: string; slug: string }>;
}) {
  const { slug } = use(params);
  const product = useProduct(slug);
  const record = useRecentlyViewedStore((s) => s.record);
  const wishlisted = useWishlistStore((s) => s.has(product?.slug ?? ""));
  const toggleWishlist = useWishlistStore((s) => s.toggle);
  const related = useRelated(product);

  const images = product?.media?.images ?? [];
  const hasModel = Boolean(product?.media?.modelUrl);
  const hasVideo = Boolean(product?.media?.videoUrl);

  const [view, setView] = useState<ViewMode>(() =>
    hasModel ? { kind: "model" } : images.length > 0 ? { kind: "image", index: 0 } : { kind: "placeholder" }
  );

  useEffect(() => {
    if (product) record(product.slug);
  }, [product, record]);

  if (!product) notFound();

  return (
    <>
      <Navbar />
      <main className="px-6 pb-16 pt-28 sm:px-12 sm:pt-36">
        <div className="mx-auto grid max-w-6xl gap-10 lg:grid-cols-2">
          <div>
            <div
              className={cn(
                "relative flex aspect-square items-center justify-center overflow-hidden rounded-2xl border border-studio-line",
                product.accent === "purple"
                  ? "bg-gradient-to-br from-accent-purple/15 via-studio-panel to-studio-panel"
                  : "bg-gradient-to-br from-accent-cyan/15 via-studio-panel to-studio-panel"
              )}
            >
              {view.kind === "model" && product.media?.modelUrl ? (
                <ProductModelViewer url={product.media.modelUrl} className="h-full w-full" />
              ) : view.kind === "video" && product.media?.videoUrl ? (
                <video src={product.media.videoUrl} controls autoPlay className="h-full w-full object-cover" />
              ) : view.kind === "image" && images[view.index] ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={images[view.index]}
                  alt={product.seo?.imageAlt ?? product.name}
                  className="h-full w-full object-cover"
                />
              ) : (
                <div
                  className={cn(
                    "h-40 w-40 rounded-3xl border",
                    product.accent === "purple" ? "border-accent-purple/40 bg-accent-purple/10" : "border-accent-cyan/40 bg-accent-cyan/10"
                  )}
                />
              )}

              <button
                onClick={() => toggleWishlist(product.slug)}
                className="absolute right-4 top-4 rounded-full border border-white/10 bg-black/40 p-2.5 backdrop-blur-sm"
                aria-label="Toggle wishlist"
              >
                <Heart className={cn("h-4 w-4", wishlisted ? "fill-accent-purple text-accent-purple" : "text-white")} />
              </button>
              {product.badges?.[0] && (
                <div className="absolute left-4 top-4">
                  <Badge kind={product.badges[0]} />
                </div>
              )}
              {hasModel && view.kind !== "model" && (
                <span className="absolute bottom-4 left-4 flex items-center gap-1.5 rounded-full border border-white/15 bg-black/50 px-3 py-1.5 text-[11px] text-white backdrop-blur-sm">
                  <Box className="h-3 w-3" /> Drag to rotate in 3D view
                </span>
              )}
            </div>

            {(hasModel || hasVideo || images.length > 0) && (
              <div className="mt-3 flex gap-2">
                {hasModel && (
                  <button
                    onClick={() => setView({ kind: "model" })}
                    className={cn(
                      "flex h-16 w-16 shrink-0 items-center justify-center rounded-lg border",
                      view.kind === "model" ? "border-accent-cyan bg-accent-cyan/10" : "border-studio-line"
                    )}
                    aria-label="View 3D model"
                  >
                    <Box className={cn("h-5 w-5", view.kind === "model" ? "text-accent-cyan" : "text-studio-ink/40")} />
                  </button>
                )}
                {hasVideo && (
                  <button
                    onClick={() => setView({ kind: "video" })}
                    className={cn(
                      "flex h-16 w-16 shrink-0 items-center justify-center rounded-lg border",
                      view.kind === "video" ? "border-accent-cyan bg-accent-cyan/10" : "border-studio-line"
                    )}
                    aria-label="Play video"
                  >
                    <Play className={cn("h-5 w-5", view.kind === "video" ? "text-accent-cyan" : "text-studio-ink/40")} />
                  </button>
                )}
                {images.map((img, i) => (
                  <button
                    key={img + i}
                    onClick={() => setView({ kind: "image", index: i })}
                    className={cn(
                      "h-16 w-16 shrink-0 overflow-hidden rounded-lg border",
                      view.kind === "image" && view.index === i ? "border-accent-cyan" : "border-studio-line"
                    )}
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={img} alt="" className="h-full w-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          <div>
            <p className="font-mono text-xs uppercase tracking-[0.2em] text-accent-cyan">
              {product.categorySlug.replace(/-/g, " ")}
            </p>
            <h1 className="mt-3 font-display text-3xl text-studio-ink sm:text-4xl">{product.name}</h1>
            <p className="mt-2 text-sm text-studio-ink/60">{product.tagline}</p>

            <div className="mt-3 flex items-center gap-1.5">
              <Star className="h-3.5 w-3.5 fill-accent-cyan text-accent-cyan" />
              <span className="text-xs text-studio-ink/60">
                {product.rating} · {product.reviewCount} reviews
              </span>
            </div>

            <p className="mt-5 text-sm leading-relaxed text-studio-ink/60">{product.description}</p>

            {product.materialsUsed && product.materialsUsed.length > 0 && (
              <div className="mt-5 flex flex-wrap gap-2">
                {product.materialsUsed.map((m) => (
                  <span key={m} className="rounded-full border border-studio-line px-3 py-1 text-[11px] text-studio-ink/50">
                    {m}
                  </span>
                ))}
              </div>
            )}

            <div className="mt-8">
              <ConfigPanel product={product} />
            </div>

            {hasModel && product.media?.modelUrl && (
              <div className="mt-4">
                <ARViewButton modelUrl={product.media.modelUrl} alt={product.name} />
              </div>
            )}

            {product.specs && product.specs.length > 0 && (
              <div className="mt-8 rounded-2xl border border-studio-line bg-studio-panel p-5">
                <p className="mb-3 font-display text-sm text-studio-ink">Specifications</p>
                <dl className="flex flex-col gap-2">
                  {product.specs.map((s) => (
                    <div key={s.label} className="flex justify-between text-xs">
                      <dt className="text-studio-ink/40">{s.label}</dt>
                      <dd className="text-studio-ink/70">{s.value}</dd>
                    </div>
                  ))}
                </dl>
              </div>
            )}
          </div>
        </div>
      </main>

      <RelatedProducts products={related} />
      <Footer />
    </>
  );
}
