"use client";

import { useState, useCallback } from "react";
import { motion } from "framer-motion";
import { UploadCloud, FileBox } from "lucide-react";
import { cn } from "@/lib/utils";

type Estimate = {
  fileName: string;
  sizeMB: number;
  printTimeHrs: number;
  materialGrams: number;
  costUsd: number;
};

/**
 * Rough, file-size-based estimate — NOT a real slicer. An actual slicing
 * engine (e.g. a WASM build of a slicer, or a backend service) is required
 * for accurate layer preview, time, and material calculations. This gives
 * a plausible placeholder so the flow is demonstrable end-to-end.
 */
function fakeEstimate(file: File): Estimate {
  const sizeMB = file.size / (1024 * 1024);
  const materialGrams = Math.max(8, Math.round(sizeMB * 18));
  const printTimeHrs = Math.max(0.5, Math.round(sizeMB * 0.9 * 10) / 10);
  const costUsd = Math.max(4, Math.round(materialGrams * 0.045 + printTimeHrs * 1.8));
  return { fileName: file.name, sizeMB: Math.round(sizeMB * 10) / 10, printTimeHrs, materialGrams, costUsd };
}

export function CustomPrintingSection() {
  const [estimate, setEstimate] = useState<Estimate | null>(null);
  const [dragOver, setDragOver] = useState(false);

  const handleFile = useCallback((file: File | undefined) => {
    if (!file) return;
    const validExt = /\.(stl|obj|3mf)$/i.test(file.name);
    if (!validExt) return;
    setEstimate(fakeEstimate(file));
  }, []);

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
          Upload Your Own
        </p>
        <h2 className="mt-4 font-display text-3xl text-studio-ink sm:text-5xl">
          Bring your own model.
        </h2>
        <p className="mx-auto mt-4 max-w-lg text-sm text-studio-ink/60">
          Upload an STL, OBJ, or 3MF for an instant rough estimate. Final
          pricing is confirmed after our team reviews your file.
        </p>
      </motion.div>

      <div
        onDragOver={(e) => {
          e.preventDefault();
          setDragOver(true);
        }}
        onDragLeave={() => setDragOver(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragOver(false);
          handleFile(e.dataTransfer.files?.[0]);
        }}
        className={cn(
          "mx-auto mt-10 flex max-w-xl flex-col items-center gap-4 rounded-2xl border-2 border-dashed p-12 text-center transition-colors",
          dragOver ? "border-accent-cyan bg-accent-cyan/5" : "border-studio-line"
        )}
      >
        <UploadCloud className="h-8 w-8 text-studio-ink/40" />
        <p className="text-sm text-studio-ink/60">
          Drag a file here, or{" "}
          <label className="cursor-pointer text-accent-cyan underline underline-offset-2">
            browse
            <input
              type="file"
              accept=".stl,.obj,.3mf"
              className="sr-only"
              onChange={(e) => handleFile(e.target.files?.[0])}
            />
          </label>
        </p>
        <p className="text-xs text-studio-ink/30">STL, OBJ, or 3MF — up to 100MB</p>
      </div>

      {estimate && (
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="mx-auto mt-8 max-w-xl rounded-2xl border border-studio-line bg-studio-panel p-6"
        >
          <div className="flex items-center gap-3">
            <FileBox className="h-5 w-5 text-accent-cyan" />
            <div>
              <p className="text-sm text-studio-ink">{estimate.fileName}</p>
              <p className="text-xs text-studio-ink/40">{estimate.sizeMB} MB</p>
            </div>
          </div>

          <div className="mt-5 grid grid-cols-3 gap-4 text-center">
            <div>
              <p className="font-mono text-lg text-studio-ink">{estimate.printTimeHrs}h</p>
              <p className="mt-1 text-[10px] uppercase tracking-wider text-studio-ink/40">Est. Time</p>
            </div>
            <div>
              <p className="font-mono text-lg text-studio-ink">{estimate.materialGrams}g</p>
              <p className="mt-1 text-[10px] uppercase tracking-wider text-studio-ink/40">Material</p>
            </div>
            <div>
              <p className="font-mono text-lg text-studio-ink">${estimate.costUsd}</p>
              <p className="mt-1 text-[10px] uppercase tracking-wider text-studio-ink/40">Est. Cost</p>
            </div>
          </div>

          <p className="mt-5 text-center text-[11px] text-studio-ink/30">
            Rough estimate based on file size only — not a real slicer output.
            Accurate layer preview and pricing require a slicing engine
            (planned for a later phase).
          </p>
        </motion.div>
      )}
    </section>
  );
}
