"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { cn } from "@/lib/utils";
import { useReducedMotion } from "@/hooks/use-reduced-motion";

const TILES = [
  { accent: "cyan", big: true },
  { accent: "purple", big: false },
  { accent: "purple", big: false },
  { accent: "cyan", big: false },
  { accent: "purple", big: true },
  { accent: "cyan", big: false },
] as const;

function ParallaxTile({
  tile,
  i,
  reducedMotion,
}: {
  tile: (typeof TILES)[number];
  i: number;
  reducedMotion: boolean;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  // Alternate tiles drift at slightly different rates for a real parallax feel.
  const depth = (i % 3) * 10 + 10;
  const y = useTransform(scrollYProgress, [0, 1], [depth, -depth]);

  return (
    <motion.div
      ref={ref}
      style={reducedMotion ? undefined : { y }}
      initial={{ opacity: 0, scale: 0.95 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.5, delay: (i % 6) * 0.06, ease: [0.16, 1, 0.3, 1] }}
      className={cn(
        "rounded-2xl border border-studio-line bg-gradient-to-br",
        tile.accent === "cyan" ? "from-accent-cyan/10 to-studio-panel" : "from-accent-purple/10 to-studio-panel",
        tile.big ? "col-span-2 aspect-[2/1] sm:col-span-1 sm:aspect-square" : "aspect-square"
      )}
    />
  );
}

export function GallerySection() {
  const reducedMotion = useReducedMotion();

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
        {TILES.map((tile, i) => (
          <ParallaxTile key={i} tile={tile} i={i} reducedMotion={reducedMotion} />
        ))}
      </div>
    </section>
  );
}
