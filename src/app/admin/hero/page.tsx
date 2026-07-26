"use client";

import { useRef } from "react";
import { UploadCloud, RotateCcw, X } from "lucide-react";
import { useHeroShowcaseStore, type HeroShapeKind } from "@/lib/store/hero-showcase-store";

const SHAPE_OPTIONS: HeroShapeKind[] = ["torusKnot", "stackedRings", "gear", "vase", "spool", "facetedGem"];

export default function AdminHeroPage() {
  const slots = useHeroShowcaseStore((s) => s.slots ?? []);
  const updateSlot = useHeroShowcaseStore((s) => s.updateSlot);
  const setCustomModel = useHeroShowcaseStore((s) => s.setCustomModel);
  const clearCustomModel = useHeroShowcaseStore((s) => s.clearCustomModel);
  const resetToDefaults = useHeroShowcaseStore((s) => s.resetToDefaults);
  const fileInputs = useRef<Record<string, HTMLInputElement | null>>({});

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-display text-2xl text-studio-ink">Hero Floating Shapes</h1>
          <p className="mt-1 max-w-xl text-sm text-studio-ink/50">
            Controls the 6 shapes floating around the homepage headline. Upload a GLB/GLTF to
            replace any shape, or tune color, float, and spin for the built-in forms.
          </p>
        </div>
        <button
          onClick={() => confirm("Reset all shapes to their defaults?") && resetToDefaults()}
          className="flex items-center gap-1.5 rounded-full border border-studio-line px-3 py-2 text-xs text-studio-ink/60 hover:border-accent-cyan hover:text-accent-cyan"
        >
          <RotateCcw className="h-3.5 w-3.5" /> Reset All
        </button>
      </div>

      <div className="mt-4 rounded-xl border border-accent-purple/30 bg-accent-purple/5 p-4 text-xs text-studio-ink/60">
        Same rule as the 3D Showcase: uploaded models preview instantly in this tab, but won't
        survive a reload or show up for other visitors until real file storage is connected.
      </div>

      <div className="mt-6 grid grid-cols-1 gap-4 lg:grid-cols-2">
        {slots.map((slot) => (
          <div key={slot.id} className="rounded-2xl border border-studio-line bg-white p-5">
            <input
              value={slot.label}
              onChange={(e) => updateSlot(slot.id, { label: e.target.value })}
              className="w-full border-b border-transparent bg-transparent text-sm text-studio-ink focus:border-accent-cyan focus:outline-none"
            />

            <div className="mt-4 flex items-center gap-2">
              <input
                ref={(el) => {
                  fileInputs.current[slot.id] = el;
                }}
                type="file"
                accept=".glb,.gltf"
                className="sr-only"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) setCustomModel(slot.id, file);
                }}
              />
              <button
                onClick={() => fileInputs.current[slot.id]?.click()}
                className="flex flex-1 items-center justify-center gap-2 rounded-lg border border-dashed border-studio-line py-2.5 text-xs text-studio-ink/50 hover:border-accent-cyan hover:text-accent-cyan"
              >
                <UploadCloud className="h-3.5 w-3.5" />
                {slot.kind === "custom" ? "Replace model" : "Upload GLB/GLTF"}
              </button>
              {slot.kind === "custom" && (
                <button
                  onClick={() => clearCustomModel(slot.id)}
                  aria-label="Remove custom model"
                  className="rounded-lg border border-studio-line p-2.5 text-studio-ink/40 hover:text-rose-500"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              )}
            </div>
            {slot.customModelName && (
              <p className="mt-1.5 truncate text-[11px] text-studio-ink/40">
                {slot.kind === "custom" ? "Active: " : "Last uploaded (needs re-upload): "}
                {slot.customModelName}
              </p>
            )}

            {slot.kind !== "custom" && (
              <div className="mt-4 grid grid-cols-2 gap-3">
                <div>
                  <label className="mb-1.5 block text-[11px] uppercase tracking-wider text-studio-ink/40">Shape</label>
                  <select
                    value={slot.kind}
                    onChange={(e) => updateSlot(slot.id, { kind: e.target.value as HeroShapeKind })}
                    className="w-full rounded-lg border border-studio-line bg-white px-3 py-2 text-sm text-studio-ink focus:border-accent-cyan focus:outline-none"
                  >
                    {SHAPE_OPTIONS.map((k) => (
                      <option key={k} value={k}>{k}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="mb-1.5 block text-[11px] uppercase tracking-wider text-studio-ink/40">Color</label>
                  <input
                    type="color"
                    value={slot.color}
                    onChange={(e) => updateSlot(slot.id, { color: e.target.value })}
                    className="h-[38px] w-full rounded-lg border border-studio-line bg-white px-1"
                  />
                </div>
              </div>
            )}

            <div className="mt-3">
              <label className="mb-1.5 block text-[11px] uppercase tracking-wider text-studio-ink/40">
                Scale ({slot.scale.toFixed(2)})
              </label>
              <input
                type="range"
                min={0.3}
                max={1.6}
                step={0.05}
                value={slot.scale}
                onChange={(e) => updateSlot(slot.id, { scale: Number(e.target.value) })}
                className="w-full accent-accent-cyan"
              />
            </div>

            <div className="mt-3 grid grid-cols-3 gap-2">
              {(["x", "y", "z"] as const).map((axis, axisIndex) => (
                <div key={axis}>
                  <label className="mb-1 block text-[10px] uppercase tracking-wider text-studio-ink/30">{axis}</label>
                  <input
                    type="number"
                    step={0.1}
                    value={slot.position[axisIndex]}
                    onChange={(e) => {
                      const next: [number, number, number] = [...slot.position];
                      next[axisIndex] = Number(e.target.value);
                      updateSlot(slot.id, { position: next });
                    }}
                    className="w-full rounded-lg border border-studio-line bg-white px-2 py-1.5 text-xs text-studio-ink focus:border-accent-cyan focus:outline-none"
                  />
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
