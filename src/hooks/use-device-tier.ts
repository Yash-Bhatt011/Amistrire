"use client";

import { useEffect, useState } from "react";

/**
 * Coarse device-tier check used to scale particle counts, shadow map
 * resolution, and DPR. Not scientific — just enough to keep phones smooth
 * without a full capability-detection library.
 */
export function useDeviceTier(): "mobile" | "desktop" {
  const [tier, setTier] = useState<"mobile" | "desktop">("desktop");

  useEffect(() => {
    const check = () => {
      const isNarrow = window.innerWidth < 820;
      const isCoarsePointer = window.matchMedia("(pointer: coarse)").matches;
      setTier(isNarrow && isCoarsePointer ? "mobile" : "desktop");
    };
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  return tier;
}
