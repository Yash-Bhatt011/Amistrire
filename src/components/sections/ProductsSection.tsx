"use client";

import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";

const ProductShowcase = dynamic(
  () => import("@/components/scene/ProductShowcase").then((m) => m.ProductShowcase),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-full w-full items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-accent-purple/30 border-t-accent-purple" />
      </div>
    ),
  }
);

const CATEGORIES = [
  "Keychains",
  "Home Decor",
  "Desk Accessories",
  "Miniatures",
  "Art & Collectibles",
  "Gaming Accessories",
  "Organizers",
  "Business Products",
];

export function ProductsSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          observer.disconnect(); // mount once, never tear down/rebuild on scroll jitter
        }
      },
      { rootMargin: "200px" }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <section ref={containerRef} className="relative bg-studio-void px-6 py-24 sm:px-12">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        className="mx-auto max-w-4xl text-center"
      >
        <p className="font-mono text-xs uppercase tracking-[0.2em] text-accent-purple">
          Live From The Studio
        </p>
        <h2 className="mt-4 font-display text-3xl text-studio-ink sm:text-5xl">
          Real forms, rendered in real time.
        </h2>
        <p className="mx-auto mt-4 max-w-xl text-sm text-studio-ink/60">
          A live rotating preview spanning our catalog — each shape spins
          independently, in the material you currently have selected below.
        </p>
      </motion.div>

      <div className="mx-auto mt-12 flex h-[26rem] max-w-5xl items-center justify-center overflow-hidden rounded-2xl border border-studio-line bg-white shadow-sm shadow-black/5">
        {inView && <ProductShowcase />}
      </div>

      <div className="mx-auto mt-8 flex max-w-4xl flex-wrap justify-center gap-2">
        {CATEGORIES.map((c) => (
          <span
            key={c}
            className="rounded-full border border-studio-line px-3 py-1.5 text-xs text-studio-ink/50"
          >
            {c}
          </span>
        ))}
      </div>
    </section>
  );
}
