"use client";

import { motion } from "framer-motion";
import { ShieldCheck, Gauge, PackageCheck, Sparkles } from "lucide-react";

const POINTS = [
  {
    icon: ShieldCheck,
    title: "Quality Checked",
    text: "Every print is visually inspected before it ships — no exceptions.",
  },
  {
    icon: Gauge,
    title: "Fast Turnaround",
    text: "Most in-stock items ship within 48 hours of ordering.",
  },
  {
    icon: PackageCheck,
    title: "Careful Packaging",
    text: "Foam-lined boxes sized to the part, not a generic mailer.",
  },
  {
    icon: Sparkles,
    title: "Real Customization",
    text: "Color, material, and finish options that actually change the print.",
  },
];

export function WhyChooseUsSection() {
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
          Why Choose Us
        </p>
        <h2 className="mt-4 font-display text-3xl text-studio-ink sm:text-5xl">
          Built like a studio, run like a shop.
        </h2>
      </motion.div>

      <div className="mx-auto mt-14 grid max-w-5xl grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {POINTS.map((point, i) => (
          <motion.div
            key={point.title}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.5, delay: i * 0.08, ease: [0.16, 1, 0.3, 1] }}
            className="rounded-2xl border border-studio-line bg-studio-panel p-6"
          >
            <point.icon className="h-5 w-5 text-accent-cyan" />
            <p className="mt-4 font-display text-sm text-studio-ink">{point.title}</p>
            <p className="mt-2 text-xs text-studio-ink/50">{point.text}</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
