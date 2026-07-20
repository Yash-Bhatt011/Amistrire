"use client";

import { motion } from "framer-motion";
import { Star, Quote } from "lucide-react";
import { REVIEWS } from "@/lib/promo-data";

export function ReviewsSection() {
  return (
    <section className="relative bg-studio-concrete px-6 py-24 sm:px-12">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        className="mx-auto max-w-3xl text-center"
      >
        <p className="font-mono text-xs uppercase tracking-[0.2em] text-accent-cyan">
          Customer Reviews
        </p>
        <h2 className="mt-4 font-display text-3xl text-studio-ink sm:text-5xl">
          Trusted by makers and collectors alike.
        </h2>
      </motion.div>

      <div className="mx-auto mt-14 grid max-w-6xl grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {REVIEWS.map((review, i) => (
          <motion.div
            key={review.id}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.5, delay: (i % 3) * 0.08, ease: [0.16, 1, 0.3, 1] }}
            className="rounded-2xl border border-studio-line bg-studio-panel p-6"
          >
            <Quote className="h-4 w-4 text-accent-purple/60" />
            <p className="mt-3 text-sm text-studio-ink/70">{review.text}</p>
            <div className="mt-5 flex items-center justify-between">
              <div>
                <p className="text-xs text-studio-ink">{review.name}</p>
                <p className="text-[11px] text-studio-ink/40">{review.location}</p>
              </div>
              <div className="flex gap-0.5">
                {Array.from({ length: 5 }).map((_, s) => (
                  <Star
                    key={s}
                    className={`h-3 w-3 ${s < review.rating ? "fill-accent-cyan text-accent-cyan" : "text-studio-ink/20"}`}
                  />
                ))}
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
