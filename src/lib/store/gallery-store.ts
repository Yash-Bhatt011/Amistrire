"use client";

import { create } from "zustand";
import { createClient } from "../supabase/client";
import { rowToGalleryItem } from "../supabase/mappers";

export type GalleryItemKind = "image" | "video" | "model";

export type GalleryItem = {
  id: string;
  kind: GalleryItemKind;
  url: string;
  big?: boolean;
};

type GalleryState = {
  items: GalleryItem[];
  hydrated: boolean;
  hydrate: () => Promise<void>;
  addItem: (item: Omit<GalleryItem, "id">) => Promise<void>;
  updateItem: (id: string, patch: Partial<GalleryItem>) => Promise<void>;
  removeItem: (id: string) => Promise<void>;
  moveItem: (id: string, direction: "up" | "down") => Promise<void>;
};

let galleryHydratePromise: Promise<void> | null = null;

export const useGalleryStore = create<GalleryState>()((set, get) => ({
  items: [],
  hydrated: false,

  hydrate: () => {
    if (galleryHydratePromise) return galleryHydratePromise;
    galleryHydratePromise = (async () => {
      const supabase = createClient();
      const { data } = await supabase.from("gallery").select("*").order("position", { ascending: true });
      set({ items: (data ?? []).map(rowToGalleryItem), hydrated: true });
    })();
    return galleryHydratePromise;
  },

  addItem: async (item) => {
    const supabase = createClient();
    const position = get().items.length;
    const { data, error } = await supabase
      .from("gallery")
      .insert({ kind: item.kind, url: item.url, big: item.big ?? false, position })
      .select()
      .single();
    if (error || !data) {
      console.error("addItem failed:", error?.message);
      return;
    }
    set({ items: [...get().items, rowToGalleryItem(data)] });
  },

  updateItem: async (id, patch) => {
    const previous = get().items;
    set({ items: previous.map((i) => (i.id === id ? { ...i, ...patch } : i)) }); // optimistic
    const supabase = createClient();
    const row: Record<string, unknown> = {};
    if ("kind" in patch) row.kind = patch.kind;
    if ("url" in patch) row.url = patch.url;
    if ("big" in patch) row.big = patch.big ?? false;
    const { error } = await supabase.from("gallery").update(row).eq("id", id);
    if (error) {
      console.error("updateItem failed:", error.message);
      set({ items: previous }); // revert
    }
  },

  removeItem: async (id) => {
    const previous = get().items;
    set({ items: previous.filter((i) => i.id !== id) }); // optimistic
    const supabase = createClient();
    const { error } = await supabase.from("gallery").delete().eq("id", id);
    if (error) {
      console.error("removeItem failed:", error.message);
      set({ items: previous }); // revert
    }
  },

  moveItem: async (id, direction) => {
    const items = [...get().items];
    const index = items.findIndex((i) => i.id === id);
    if (index === -1) return;
    const target = direction === "up" ? index - 1 : index + 1;
    if (target < 0 || target >= items.length) return;
    [items[index], items[target]] = [items[target], items[index]];
    set({ items }); // optimistic reorder

    // Persist the new order for just the two swapped rows.
    const supabase = createClient();
    const [a, b] = [items[index], items[target]];
    const results = await Promise.all([
      supabase.from("gallery").update({ position: index }).eq("id", a.id),
      supabase.from("gallery").update({ position: target }).eq("id", b.id),
    ]);
    if (results.some((r) => r.error)) {
      console.error("moveItem failed to persist order");
    }
  },
}));
