"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { cn } from "@/lib/utils";
import { useReducedMotion } from "@/hooks/use-reduced-motion";
import { useGalleryStore, type GalleryItem } from "@/lib/store/gallery-store";
import { ProductModelViewer } from "@/components/product/ProductModelViewer";

function GalleryTile({ item, i, reducedMotion }: { item: GalleryItem; i: number; reducedMotion: boolean }) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  // Alternate tiles drift at slightly different rates for a real parallax feel.
  const depth = (i % 3) * 10 + 10;
  const y = useTransform(scrollYProgress, [0, 1], [depth, -depth]);
  const accent = i % 2 === 0 ? "cyan" : "purple";

  return (
    <motion.div
      ref={ref}
      style={reducedMotion ? undefined : { y }}
      initial={{ opacity: 0, scale: 0.95 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.5, delay: (i % 6) * 0.06, ease: [0.16, 1, 0.3, 1] }}
      className={cn(
        "overflow-hidden rounded-2xl border border-studio-line bg-gradient-to-br",
        accent === "cyan" ? "from-accent-cyan/10 to-studio-panel" : "from-accent-purple/10 to-studio-panel",
        item.big ? "col-span-2 aspect-[2/1] sm:col-span-1 sm:aspect-square" : "aspect-square"
      )}
    >
      {item.kind === "image" && item.url && (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={item.url} alt="" className="h-full w-full object-cover" />
      )}
      {item.kind === "video" && item.url && (
        <video src={item.url} autoPlay muted loop playsInline className="h-full w-full object-cover" />
      )}
      {item.kind === "model" && item.url && <ProductModelViewer url={item.url} className="h-full w-full" />}
    </motion.div>
  );
}

export function GallerySection() {
  const reducedMotion = useReducedMotion();
  const items = useGalleryStore((s) => s.items ?? []);

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
          Gallery
        </p>
        <h2 className="mt-4 font-display text-3xl text-studio-ink sm:text-5xl">
          A look at what's left the studio.
        </h2>
      </motion.div>

      <div className="mx-auto mt-14 grid max-w-6xl grid-cols-2 gap-4 sm:grid-cols-3">
        {items.map((item, i) => (
          <GalleryTile key={item.id} item={item} i={i} reducedMotion={reducedMotion} />
        ))}
      </div>
    </section>
  );
}
