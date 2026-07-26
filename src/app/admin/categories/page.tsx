"use client";

import { useState } from "react";
import { Plus, Trash2, Box } from "lucide-react";
import { useAllCategoriesIncludingArchived } from "@/lib/catalog-hooks";
import { useCatalogStore } from "@/lib/store/catalog-store";
import { uploadFile } from "@/lib/supabase/upload";
import type { Category } from "@/lib/types";

const SHAPE_OPTIONS: NonNullable<Category["banner3DShape"]>[] = [
  "torusKnot",
  "icosahedron",
  "stackedBoxes",
  "torus",
  "cone",
  "octahedron",
  "cylinderPair",
  "dodecahedron",
];

export default function AdminCategoriesPage() {
  const categories = useAllCategoriesIncludingArchived();
  const addCategory = useCatalogStore((s) => s.addCategory);
  const deleteCategory = useCatalogStore((s) => s.deleteCategory);
  const updateCategory = useCatalogStore((s) => s.updateCategory);

  const [name, setName] = useState("");
  const [tagline, setTagline] = useState("");

  const [uploadingBanner, setUploadingBanner] = useState<string | null>(null);

  function handleAdd(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim()) return;
    const slug = name.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
    addCategory({ slug, name, tagline, icon: "Box", isCollection: true });
    setName("");
    setTagline("");
  }

  async function handleBannerUpload(slug: string, file: File) {
    setUploadingBanner(slug);
    try {
      const url = await uploadFile("gallery", file);
      updateCategory(slug, { bannerImage: url, banner3DShape: undefined });
    } catch {
      alert("Upload failed — check you're logged in as staff and try again.");
    } finally {
      setUploadingBanner(null);
    }
  }

  return (
    <div>
      <h1 className="font-display text-2xl text-studio-ink">Categories &amp; Collections</h1>
      <p className="mt-1 text-sm text-studio-ink/50">{categories.length} total</p>

      <div className="mt-3 max-w-2xl rounded-xl border border-accent-purple/30 bg-accent-purple/5 p-4 text-xs text-studio-ink/60">
        Give a category a banner image, or try the 3D icon instead — a small rotating shape (same
        family used in the homepage showcase) that renders live instead of a flat picture. Only one
        applies at a time; 3D takes priority if both are set. Uploaded images are stored in
        Supabase and persist permanently, same as a pasted URL.
      </div>

      <form onSubmit={handleAdd} className="mt-6 flex max-w-xl gap-3">
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Category name"
          className="flex-1 rounded-lg border border-studio-line bg-white px-3 py-2.5 text-sm text-studio-ink focus:border-accent-cyan focus:outline-none"
        />
        <input
          value={tagline}
          onChange={(e) => setTagline(e.target.value)}
          placeholder="Tagline"
          className="flex-1 rounded-lg border border-studio-line bg-white px-3 py-2.5 text-sm text-studio-ink focus:border-accent-cyan focus:outline-none"
        />
        <button
          type="submit"
          className="flex items-center gap-1.5 rounded-full bg-gradient-to-r from-accent-cyan to-accent-purple px-4 py-2 text-xs font-medium uppercase tracking-wider text-white"
        >
          <Plus className="h-3.5 w-3.5" /> Add
        </button>
      </form>

      <div className="mt-6 flex flex-col gap-3">
        {categories.map((c) => (
          <div key={c.slug} className="rounded-xl border border-studio-line bg-white px-4 py-3">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-studio-ink">{c.name}</p>
                <p className="text-xs text-studio-ink/40">{c.tagline}</p>
              </div>
              <div className="flex items-center gap-3">
                <label className="flex items-center gap-1.5 text-xs text-studio-ink/50">
                  <input
                    type="checkbox"
                    checked={!c.archived}
                    onChange={(e) => updateCategory(c.slug, { archived: !e.target.checked })}
                  />
                  Visible
                </label>
                <button onClick={() => deleteCategory(c.slug)} className="text-studio-ink/40 hover:text-rose-500">
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>

            <div className="mt-3 flex flex-wrap items-center gap-3 border-t border-studio-line pt-3">
              <div className="flex items-center gap-1.5 text-xs text-studio-ink/40">
                <Box className="h-3.5 w-3.5" /> 3D Icon
              </div>
              <select
                value={c.banner3DShape ?? ""}
                onChange={(e) =>
                  updateCategory(c.slug, {
                    banner3DShape: e.target.value ? (e.target.value as Category["banner3DShape"]) : undefined,
                    bannerImage: e.target.value ? undefined : c.bannerImage,
                  })
                }
                className="rounded-lg border border-studio-line bg-white px-2 py-1.5 text-xs text-studio-ink focus:border-accent-cyan focus:outline-none"
              >
                <option value="">None</option>
                {SHAPE_OPTIONS.map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>

              <span className="text-xs text-studio-ink/30">or</span>

              <input
                defaultValue={c.bannerImage && !c.banner3DShape ? c.bannerImage : ""}
                onBlur={(e) => updateCategory(c.slug, { bannerImage: e.target.value || undefined, banner3DShape: e.target.value ? undefined : c.banner3DShape })}
                placeholder="Banner image URL"
                className="flex-1 rounded-lg border border-studio-line bg-white px-2 py-1.5 text-xs text-studio-ink focus:border-accent-cyan focus:outline-none"
              />
              <label className="cursor-pointer rounded-lg border border-dashed border-studio-line px-2 py-1.5 text-xs text-studio-ink/50 hover:border-accent-cyan hover:text-accent-cyan">
                {uploadingBanner === c.slug ? "Uploading..." : "Upload"}
                <input
                  type="file"
                  accept="image/*"
                  disabled={uploadingBanner === c.slug}
                  className="sr-only"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) handleBannerUpload(c.slug, file);
                  }}
                />
              </label>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
