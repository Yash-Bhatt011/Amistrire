"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import { motion } from "framer-motion";
import { Star } from "lucide-react";
import { Magnetic } from "@/components/ui/Magnetic";
import { REVIEWS } from "@/lib/promo-data";

const FloatingProducts = dynamic(
  () => import("@/components/scene/FloatingProducts").then((m) => m.FloatingProducts),
  { ssr: false }
);

const avgRating = (REVIEWS.reduce((sum, r) => sum + r.rating, 0) / REVIEWS.length).toFixed(1);

export function HeroSection() {
  return (
    <section className="relative flex min-h-screen w-full items-center justify-center overflow-hidden bg-white">
      {/* Giant background wordmark, matching the reference composition */}
      <div className="pointer-events-none absolute inset-0 flex select-none items-center justify-center overflow-hidden">
        <span className="whitespace-nowrap font-display text-[22vw] font-bold leading-none tracking-tight text-studio-ink/[0.06] sm:text-[16vw]">
          AMISTRIÉ
        </span>
      </div>

      {/* Floating 3D printed forms scattered around the content */}
      <div className="pointer-events-none absolute inset-0">
        <FloatingProducts mobile={false} />
      </div>

      {/* Centered content card */}
      <div className="relative z-10 mx-auto flex max-w-xl flex-col items-center px-6 pt-24 text-center sm:pt-16">
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="font-mono text-xs uppercase tracking-[0.2em] text-accent-cyan"
        >
          Precision Manufacturing, On Demand
        </motion.p>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          className="mt-4 font-display text-4xl leading-[1.05] tracking-tight text-studio-ink sm:text-6xl"
        >
          Every layer, <span className="text-gradient">engineered.</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          className="mt-5 max-w-md text-sm text-studio-ink/60 sm:text-base"
        >
          Custom 3D printing in premium materials — from a single personalized
          keychain to a full production run, designed, configured, and
          shipped worldwide.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.35, ease: [0.16, 1, 0.3, 1] }}
          className="mt-6 flex items-center gap-2 text-xs text-studio-ink/50"
        >
          <Star className="h-3.5 w-3.5 fill-accent-cyan text-accent-cyan" />
          {avgRating} average rating from makers and collectors
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.45, ease: [0.16, 1, 0.3, 1] }}
          className="mt-8 flex flex-wrap items-center justify-center gap-3"
        >
          <Magnetic>
            <Link
              href="/products"
              className="rounded-full bg-gradient-to-r from-accent-cyan to-accent-purple px-7 py-3 text-xs font-medium uppercase tracking-wider text-white transition-transform hover:scale-[1.02]"
            >
              Shop Products
            </Link>
          </Magnetic>
          <Magnetic>
            <Link
              href="/custom-orders"
              className="rounded-full border border-studio-line px-7 py-3 text-xs font-medium uppercase tracking-wider text-studio-ink transition-colors hover:border-accent-cyan hover:text-accent-cyan"
            >
              Start a Custom Order
            </Link>
          </Magnetic>
        </motion.div>
      </div>
    </section>
  );
}
