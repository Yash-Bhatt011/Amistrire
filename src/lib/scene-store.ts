import { create } from "zustand";

export type FilamentType = "PLA" | "PETG" | "TPU" | "ABS" | "Silk PLA" | "Carbon Fiber PLA";

export const FILAMENTS: Record<
  FilamentType,
  { color: string; roughness: number; metalness: number; label: string }
> = {
  PLA: { color: "#2997ff", roughness: 0.35, metalness: 0.0, label: "PLA" },
  PETG: { color: "#f4f4f5", roughness: 0.2, metalness: 0.0, label: "PETG" },
  TPU: { color: "#f97316", roughness: 0.6, metalness: 0.0, label: "TPU (Flexible)" },
  ABS: { color: "#18181b", roughness: 0.4, metalness: 0.0, label: "ABS" },
  "Silk PLA": { color: "#c4b5fd", roughness: 0.08, metalness: 0.15, label: "Silk PLA" },
  "Carbon Fiber PLA": { color: "#27272a", roughness: 0.45, metalness: 0.3, label: "Carbon Fiber PLA" },
};

type SceneState = {
  filament: FilamentType;
  setFilament: (f: FilamentType) => void;
  printProgress: number; // 0..1, driven by GSAP ScrollTrigger in the hero
  setPrintProgress: (p: number) => void;
};

export const useSceneStore = create<SceneState>((set) => ({
  filament: "PLA",
  setFilament: (f) => set({ filament: f }),
  printProgress: 0,
  setPrintProgress: (p) => set({ printProgress: p }),
}));
