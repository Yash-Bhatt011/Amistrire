"use client";

import { useEffect, useState } from "react";

/**
 * Any section that should flip the fixed navbar into "light text on
 * transparent" mode should carry data-theater="true". This hook reports
 * true whenever such a section currently occupies the thin strip at the
 * very top of the viewport where the fixed nav sits.
 */
export function useIsOverDarkSection(): boolean {
  const [overDark, setOverDark] = useState(false);

  useEffect(() => {
    const sections = Array.from(document.querySelectorAll('[data-theater="true"]'));
    if (sections.length === 0) return;

    const intersecting = new Set<Element>();

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) intersecting.add(entry.target);
          else intersecting.delete(entry.target);
        }
        setOverDark(intersecting.size > 0);
      },
      // Only count a section as "covering the nav" when it overlaps the very
      // top sliver of the viewport (roughly where the fixed header sits).
      { rootMargin: "0px 0px -94% 0px", threshold: 0 }
    );

    sections.forEach((s) => observer.observe(s));
    return () => observer.disconnect();
  }, []);

  return overDark;
}
