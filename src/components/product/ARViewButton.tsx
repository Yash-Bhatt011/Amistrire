"use client";

import { useEffect, useRef, useState } from "react";
import Script from "next/script";
import { View } from "lucide-react";

type ModelViewerElement = HTMLElement & { activateAR: () => Promise<void> };

export function ARViewButton({ modelUrl, alt }: { modelUrl: string; alt: string }) {
  const ref = useRef<ModelViewerElement | null>(null);
  const [scriptReady, setScriptReady] = useState(false);
  const [supported, setSupported] = useState(true);

  useEffect(() => {
    if (typeof customElements !== "undefined" && customElements.get("model-viewer")) {
      setScriptReady(true);
    }
  }, []);

  return (
    <>
      <Script
        type="module"
        src="https://unpkg.com/@google/model-viewer@3.5.0/dist/model-viewer.min.js"
        strategy="lazyOnload"
        onReady={() => setScriptReady(true)}
      />

      {/* model-viewer must exist in the DOM to activate AR, but doesn't need
          to be visually prominent — our own preview canvas already shows the
          model; this just supplies the native AR trigger. */}
      {scriptReady && (
        <model-viewer
          ref={ref as never}
          src={modelUrl}
          alt={alt}
          ar
          ar-modes="webxr scene-viewer quick-look"
          style={{ position: "absolute", width: 1, height: 1, opacity: 0, pointerEvents: "none" }}
          onError={() => setSupported(false)}
        />
      )}

      {scriptReady && supported && (
        <button
          onClick={() => ref.current?.activateAR()}
          className="flex items-center gap-2 rounded-full border border-studio-line px-4 py-2.5 text-xs uppercase tracking-wider text-studio-ink transition-colors hover:border-accent-cyan hover:text-accent-cyan"
        >
          <View className="h-3.5 w-3.5" /> View in Your Space
        </button>
      )}
    </>
  );
}
