"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { motion, AnimatePresence } from "framer-motion";
import { useReducedMotion } from "@/hooks/use-reduced-motion";

const IntroScene = dynamic(() => import("@/components/scene/IntroScene").then((m) => m.IntroScene), {
  ssr: false,
});

const SESSION_KEY = "amistrie-intro-seen";

// Keep these in sync with the animation durations inside IntroScene/below.
const REVEAL_MS = 1650; // letter scatter-to-assembled animation
const HOLD_MS = 450; // brief pause once assembled, before morphing away
const MORPH_MS = 700; // shrink-toward-nav transition

export function IntroGate({ children }: { children: React.ReactNode }) {
  const reducedMotion = useReducedMotion();
  const [phase, setPhase] = useState<"checking" | "revealing" | "morphing" | "done">("checking");

  useEffect(() => {
    if (reducedMotion) {
      setPhase("done");
      return;
    }
    const seen = typeof window !== "undefined" && sessionStorage.getItem(SESSION_KEY);
    if (seen) {
      setPhase("done");
      return;
    }
    setPhase("revealing");
    const toMorph = setTimeout(() => setPhase("morphing"), REVEAL_MS + HOLD_MS);
    return () => clearTimeout(toMorph);
  }, [reducedMotion]);

  useEffect(() => {
    if (phase !== "morphing") return;
    const toDone = setTimeout(() => {
      setPhase("done");
      sessionStorage.setItem(SESSION_KEY, "1");
    }, MORPH_MS);
    return () => clearTimeout(toDone);
  }, [phase]);

  useEffect(() => {
    document.body.style.overflow = phase === "revealing" || phase === "morphing" ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [phase]);

  return (
    <>
      <AnimatePresence>
        {(phase === "revealing" || phase === "morphing") && (
          <motion.div
            key="intro"
            className="fixed inset-0 z-[999] overflow-hidden bg-white"
            initial={{ opacity: 1, scale: 1, x: 0, y: 0 }}
            animate={
              phase === "morphing"
                ? { opacity: 0, scale: 0.35, x: "-43vw", y: "-45vh" }
                : { opacity: 1, scale: 1, x: 0, y: 0 }
            }
            transition={{ duration: MORPH_MS / 1000, ease: [0.65, 0, 0.35, 1] }}
          >
            <IntroScene />
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div
        animate={{ opacity: phase === "revealing" || phase === "checking" ? (reducedMotion ? 1 : 0) : 1 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      >
        {children}
      </motion.div>
    </>
  );
}
