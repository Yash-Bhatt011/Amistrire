"use client";

import { motion } from "framer-motion";
import { useSceneStore, FILAMENTS, FilamentType } from "@/lib/scene-store";
import { cn } from "@/lib/utils";

const FILAMENT_ORDER: FilamentType[] = ["PLA", "PETG", "TPU", "ABS", "Silk PLA", "Carbon Fiber PLA"];

export function FilamentSection() {
  const filament = useSceneStore((s) => s.filament);
  const setFilament = useSceneStore((s) => s.setFilament);

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
          Materials
        </p>
        <h2 className="mt-4 font-display text-3xl text-studio-ink sm:text-5xl">
          Six materials. One switch.
        </h2>
        <p className="mx-auto mt-4 max-w-lg text-sm text-studio-ink/60">
          Pick a filament — the printer and every product above updates
          instantly, in real time.
        </p>
      </motion.div>

      <div className="mx-auto mt-12 grid max-w-3xl grid-cols-2 gap-3 sm:grid-cols-3">
        {FILAMENT_ORDER.map((key) => {
          const f = FILAMENTS[key];
          const active = filament === key;
          return (
            <button
              key={key}
              onClick={() => setFilament(key)}
              className={cn(
                "group relative flex flex-col items-center gap-3 rounded-xl border p-5 transition-all duration-300",
                active
                  ? "border-accent-cyan bg-accent-cyan/5"
                  : "border-studio-line bg-studio-panel hover:border-accent-cyan/40"
              )}
            >
              <span
                className="h-10 w-10 rounded-full border border-studio-line"
                style={{
                  background: f.color,
                  boxShadow: active ? `0 0 20px ${f.color}66` : "none",
                  opacity: f.metalness > 0.2 ? 0.85 : 1,
                }}
              />
              <span className={cn("text-sm", active ? "text-studio-ink" : "text-studio-ink/60")}>
                {f.label}
              </span>
              {active && (
                <motion.span
                  layoutId="filament-active-dot"
                  className="absolute right-3 top-3 h-1.5 w-1.5 rounded-full bg-accent-cyan"
                />
              )}
            </button>
          );
        })}
      </div>
    </section>
  );
}
