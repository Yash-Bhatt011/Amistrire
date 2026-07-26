"use client";

import { AnimatePresence, motion } from "framer-motion";

const COLORS = ["#2997ff", "#bf5af2", "#1d1d1f", "#2997ff", "#bf5af2"];

export function ConfettiBurst({ active }: { active: boolean }) {
  const particles = Array.from({ length: 10 }, (_, i) => i);

  return (
    <AnimatePresence>
      {active && (
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center overflow-visible">
          {particles.map((i) => {
            const angle = (i / particles.length) * Math.PI * 2;
            const distance = 40 + (i % 3) * 14;
            return (
              <motion.span
                key={i}
                initial={{ x: 0, y: 0, opacity: 1, scale: 1 }}
                animate={{
                  x: Math.cos(angle) * distance,
                  y: Math.sin(angle) * distance - 10,
                  opacity: 0,
                  scale: 0.4,
                }}
                transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
                className="absolute h-1.5 w-1.5 rounded-full"
                style={{ backgroundColor: COLORS[i % COLORS.length] }}
              />
            );
          })}
        </div>
      )}
    </AnimatePresence>
  );
}
