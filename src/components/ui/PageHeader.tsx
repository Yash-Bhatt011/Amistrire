"use client";

import { motion } from "framer-motion";

export function PageHeader({ eyebrow, title, description }: { eyebrow: string; title: string; description?: string }) {
  return (
    <div className="border-b border-studio-line bg-studio-concrete px-6 pb-16 pt-32 sm:px-12 sm:pt-40">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="mx-auto max-w-3xl text-center"
      >
        <p className="font-mono text-xs uppercase tracking-[0.2em] text-accent-cyan">{eyebrow}</p>
        <h1 className="mt-4 font-display text-3xl text-studio-ink sm:text-5xl">{title}</h1>
        {description && <p className="mx-auto mt-4 max-w-xl text-sm text-studio-ink/60">{description}</p>}
      </motion.div>
    </div>
  );
}
