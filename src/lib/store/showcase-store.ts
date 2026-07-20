import { create } from "zustand";
import { persist } from "zustand/middleware";

export type ShowcaseShapeKind =
  | "torusKnot"
  | "icosahedron"
  | "stackedBoxes"
  | "torus"
  | "cone"
  | "octahedron"
  | "cylinderPair"
  | "dodecahedron"
  | "custom";

export type ShowcaseSlot = {
  id: string;
  label: string;
  kind: ShowcaseShapeKind;
  rotationSpeed: number; // -1..1, sign controls direction
  scale: number;
  position: [number, number, number];
  autoRotate: boolean;
  customModelUrl?: string; // object URL — only valid for the current tab session
  customModelName?: string; // durable filename reference, survives reload even though the blob doesn't
};

const DEFAULT_SLOTS: ShowcaseSlot[] = [
  { id: "slot-1", label: "Keychains", kind: "torusKnot", rotationSpeed: 0.3, scale: 1, position: [-2.8, 0.2, -0.3], autoRotate: true },
  { id: "slot-2", label: "Home Decor", kind: "icosahedron", rotationSpeed: -0.22, scale: 1, position: [-2.0, -0.1, 0.6], autoRotate: true },
  { id: "slot-3", label: "Desk Accessories", kind: "stackedBoxes", rotationSpeed: 0.26, scale: 1, position: [-1.1, 0.15, -0.6], autoRotate: true },
  { id: "slot-4", label: "Miniatures", kind: "torus", rotationSpeed: -0.32, scale: 1, position: [-0.35, -0.05, 0.4], autoRotate: true },
  { id: "slot-5", label: "Art & Collectibles", kind: "cone", rotationSpeed: 0.24, scale: 1, position: [0.35, 0.1, -0.5], autoRotate: true },
  { id: "slot-6", label: "Gaming Accessories", kind: "octahedron", rotationSpeed: -0.28, scale: 1, position: [1.1, -0.1, 0.5], autoRotate: true },
  { id: "slot-7", label: "Organizers", kind: "cylinderPair", rotationSpeed: 0.2, scale: 1, position: [2.0, 0.15, -0.4], autoRotate: true },
  { id: "slot-8", label: "Business Products", kind: "dodecahedron", rotationSpeed: -0.25, scale: 1, position: [2.8, -0.05, 0.35], autoRotate: true },
];

type ShowcaseState = {
  slots: ShowcaseSlot[];
  updateSlot: (id: string, patch: Partial<ShowcaseSlot>) => void;
  moveSlot: (id: string, direction: "up" | "down") => void;
  setCustomModel: (id: string, file: File) => void;
  clearCustomModel: (id: string) => void;
  resetToDefaults: () => void;
};

export const useShowcaseStore = create<ShowcaseState>()(
  persist(
    (set, get) => ({
      slots: DEFAULT_SLOTS,

      updateSlot: (id, patch) =>
        set({ slots: (get().slots ?? []).map((s) => (s.id === id ? { ...s, ...patch } : s)) }),

      moveSlot: (id, direction) => {
        const slots = [...(get().slots ?? [])];
        const index = slots.findIndex((s) => s.id === id);
        if (index === -1) return;
        const target = direction === "up" ? index - 1 : index + 1;
        if (target < 0 || target >= slots.length) return;
        [slots[index], slots[target]] = [slots[target], slots[index]];
        set({ slots });
      },

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
      name: "amistrie-showcase",
      version: 1,
      merge: (persisted, current) => {
        const p = (persisted ?? {}) as Partial<ShowcaseState>;
        const slots = Array.isArray(p.slots) && p.slots.length > 0 ? p.slots : current.slots;
        // Object URL strings survive JSON serialization, but the blobs they
        // point to never survive a reload. Any slot that was "custom" must
        // fall back to its procedural shape (keeping customModelName so the
        // admin can see what needs re-uploading) rather than trying to load
        // a dead blob URL.
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
