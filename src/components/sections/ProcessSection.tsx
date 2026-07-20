"use client";

import { motion } from "framer-motion";

const STEPS = [
  { step: "01", title: "Design or Choose", text: "Pick a catalog item or upload your own STL/OBJ/3MF." },
  { step: "02", title: "Configure", text: "Set color, material, size, and finish — see the price update live." },
  { step: "03", title: "We Print", text: "Your part enters the queue and prints layer by layer, quality-checked as it goes." },
  { step: "04", title: "Ships to You", text: "Carefully packaged and shipped with tracking, straight to your door." },
];

export function ProcessSection() {
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
          The Printing Process
        </p>
        <h2 className="mt-4 font-display text-3xl text-studio-ink sm:text-5xl">
          From file to finished part.
        </h2>
      </motion.div>

      <div className="mx-auto mt-14 grid max-w-5xl grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {STEPS.map((s, i) => (
          <motion.div
            key={s.step}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.5, delay: i * 0.08, ease: [0.16, 1, 0.3, 1] }}
            className="relative rounded-2xl border border-studio-line bg-studio-panel p-6"
          >
            <p className="font-mono text-3xl text-studio-ink/10">{s.step}</p>
            <p className="mt-2 font-display text-sm text-studio-ink">{s.title}</p>
            <p className="mt-2 text-xs text-studio-ink/50">{s.text}</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
