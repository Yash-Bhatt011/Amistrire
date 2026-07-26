import { create } from "zustand";
import { persist } from "zustand/middleware";

export type HeroShapeKind = "torusKnot" | "stackedRings" | "gear" | "vase" | "spool" | "facetedGem" | "custom";

export type HeroSlot = {
  id: string;
  label: string;
  kind: HeroShapeKind;
  color: string;
  position: [number, number, number];
  scale: number;
  floatSpeed: number;
  floatAmount: number;
  spinSpeed: [number, number];
  customModelUrl?: string; // object URL — only valid for the current tab session
  customModelName?: string; // durable filename reference, survives reload even though the blob doesn't
};

const DEFAULT_SLOTS: HeroSlot[] = [
  { id: "hero-1", label: "Torus Knot", kind: "torusKnot", color: "#2997ff", position: [-3.5, 1.5, -0.5], scale: 0.85, floatSpeed: 0.6, floatAmount: 0.18, spinSpeed: [0.25, 0.35] },
  { id: "hero-2", label: "Gear", kind: "gear", color: "#bf5af2", position: [3.4, 1.7, -0.8], scale: 0.9, floatSpeed: 0.5, floatAmount: 0.2, spinSpeed: [0.2, 0.3] },
  { id: "hero-3", label: "Spool", kind: "spool", color: "#1d1d1f", position: [-3.7, -1.4, -1], scale: 0.9, floatSpeed: 0.7, floatAmount: 0.15, spinSpeed: [0.15, 0.25] },
  { id: "hero-4", label: "Vase", kind: "vase", color: "#2997ff", position: [3.6, -1.3, -0.6], scale: 0.85, floatSpeed: 0.55, floatAmount: 0.22, spinSpeed: [0.2, 0.28] },
  { id: "hero-5", label: "Stacked Rings", kind: "stackedRings", color: "#bf5af2", position: [-2.2, -2.2, 0.3], scale: 0.65, floatSpeed: 0.8, floatAmount: 0.14, spinSpeed: [0.3, 0.2] },
  { id: "hero-6", label: "Faceted Gem", kind: "facetedGem", color: "#1d1d1f", position: [2.3, 2.3, 0.2], scale: 0.6, floatSpeed: 0.65, floatAmount: 0.16, spinSpeed: [0.28, 0.32] },
];

type HeroShowcaseState = {
  slots: HeroSlot[];
  updateSlot: (id: string, patch: Partial<HeroSlot>) => void;
  setCustomModel: (id: string, file: File) => void;
  clearCustomModel: (id: string) => void;
  resetToDefaults: () => void;
};

export const useHeroShowcaseStore = create<HeroShowcaseState>()(
  persist(
    (set, get) => ({
      slots: DEFAULT_SLOTS,

      updateSlot: (id, patch) =>
        set({ slots: (get().slots ?? []).map((s) => (s.id === id ? { ...s, ...patch } : s)) }),

      setCustomModel: (id, file) => {
        const url = URL.createObjectURL(file);
        set({
          slots: (get().slots ?? []).map((s) =>
            s.id === id ? { ...s, kind: "custom", customModelUrl: url, customModelName: file.name } : s
          ),
        });
      },

      clearCustomModel: (id) =>
        set({
          slots: (get().slots ?? []).map((s) =>
            s.id === id
              ? { ...s, kind: DEFAULT_SLOTS.find((d) => d.id === id)?.kind ?? "torusKnot", customModelUrl: undefined, customModelName: undefined }
              : s
          ),
        }),

      resetToDefaults: () => set({ slots: DEFAULT_SLOTS }),
    }),
    {
      name: "amistrie-hero-showcase",
      version: 1,
      merge: (persisted, current) => {
        const p = (persisted ?? {}) as Partial<HeroShowcaseState>;
        const slots = Array.isArray(p.slots) && p.slots.length > 0 ? p.slots : current.slots;
        // Object URL strings survive serialization, but the blobs never
        // survive a reload — any "custom" slot must fall back to its
        // procedural shape (keeping the filename for display) rather than
        // trying to load a dead blob URL.
        const sanitized = slots.map((s) => ({
          ...s,
          customModelUrl: undefined,
          kind: s.kind === "custom" ? (DEFAULT_SLOTS.find((d) => d.id === s.id)?.kind ?? "torusKnot") : s.kind,
        }));
        return { ...current, slots: sanitized };
      },
    }
  )
);
