"use client";

import { useState, useCallback } from "react";
import dynamic from "next/dynamic";
import { motion } from "framer-motion";
import { UploadCloud, FileBox } from "lucide-react";
import { cn } from "@/lib/utils";
import type { GeometryStats } from "@/components/scene/UploadedModelViewer";

const UploadedModelViewer = dynamic(
  () => import("@/components/scene/UploadedModelViewer").then((m) => m.UploadedModelViewer),
  { ssr: false }
);

type Estimate = {
  fileName: string;
  sizeMB: number;
  printTimeHrs: number;
  materialGrams: number;
  costUsd: number;
  realGeometry: boolean;
};

const PLA_DENSITY_G_CM3 = 1.24;
const ASSUMED_INFILL_FACTOR = 0.35; // rough shell + partial-infill fraction of true solid volume
const GRAMS_PER_HOUR_THROUGHPUT = 14; // typical FDM print rate for a 0.2mm layer

function estimateFromGeometry(file: File, stats: GeometryStats): Estimate {
  const sizeMB = file.size / (1024 * 1024);
  const materialGrams = Math.max(3, Math.round(stats.volumeCm3 * PLA_DENSITY_G_CM3 * ASSUMED_INFILL_FACTOR));
  const printTimeHrs = Math.max(0.3, Math.round((materialGrams / GRAMS_PER_HOUR_THROUGHPUT) * 10) / 10);
  const costUsd = Math.max(4, Math.round(materialGrams * 0.045 + printTimeHrs * 1.8));
  return { fileName: file.name, sizeMB: Math.round(sizeMB * 10) / 10, printTimeHrs, materialGrams, costUsd, realGeometry: true };
}

/** Fallback for files we can't parse into real geometry (e.g. a corrupt/unsupported 3MF). */
function fakeEstimate(file: File): Estimate {
  const sizeMB = file.size / (1024 * 1024);
  const materialGrams = Math.max(8, Math.round(sizeMB * 18));
  const printTimeHrs = Math.max(0.5, Math.round(sizeMB * 0.9 * 10) / 10);
  const costUsd = Math.max(4, Math.round(materialGrams * 0.045 + printTimeHrs * 1.8));
  return { fileName: file.name, sizeMB: Math.round(sizeMB * 10) / 10, printTimeHrs, materialGrams, costUsd, realGeometry: false };
}

export function CustomPrintingSection() {
  const [file, setFile] = useState<File | null>(null);
  const [stats, setStats] = useState<GeometryStats | null | undefined>(undefined);
  const [dragOver, setDragOver] = useState(false);

  const handleFile = useCallback((f: File | undefined) => {
    if (!f) return;
    const validExt = /\.(stl|obj|3mf)$/i.test(f.name);
    if (!validExt) return;
    setFile(f);
    setStats(undefined);
  }, []);

  const estimate: Estimate | null =
    file && stats === null ? fakeEstimate(file) : file && stats ? estimateFromGeometry(file, stats) : null;

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
          Upload an STL, OBJ, or 3MF to see it rendered in 3D with a real estimate calculated from
          its actual geometry. Final pricing is confirmed after our team reviews your file.
        </p>
      </motion.div>

      {!file ? (
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
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="mx-auto mt-10 grid max-w-4xl gap-6 lg:grid-cols-2"
        >
          <div className="aspect-square overflow-hidden rounded-2xl border border-studio-line bg-studio-panel">
            <UploadedModelViewer
              file={file}
              onStats={(s) => setStats(s?.supported ? s : null)}
              className="h-full w-full"
            />
          </div>

          <div className="rounded-2xl border border-studio-line bg-studio-panel p-6">
            <div className="flex items-center gap-3">
              <FileBox className="h-5 w-5 text-accent-cyan" />
              <div>
                <p className="text-sm text-studio-ink">{file.name}</p>
                <p className="text-xs text-studio-ink/40">
                  {estimate ? `${estimate.sizeMB} MB` : "Analyzing geometry..."}
                </p>
              </div>
            </div>

            {stats && stats.supported && (
              <p className="mt-3 text-xs text-studio-ink/50">
                {stats.widthMm} × {stats.depthMm} × {stats.heightMm} mm · {stats.volumeCm3} cm³
              </p>
            )}

            {estimate && (
              <>
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
                  {estimate.realGeometry
                    ? "Calculated from your file's actual volume at 20% infill PLA — still an estimate, not a final slice."
                    : "Rough estimate based on file size only — we couldn't parse this file's geometry directly."}
                </p>
              </>
            )}

            <button
              onClick={() => {
                setFile(null);
                setStats(undefined);
              }}
              className="mt-5 w-full rounded-full border border-studio-line py-2.5 text-xs uppercase tracking-wider text-studio-ink/60 hover:border-accent-cyan hover:text-accent-cyan"
            >
              Upload a different file
            </button>
          </div>
        </motion.div>
      )}
    </section>
  );
}
