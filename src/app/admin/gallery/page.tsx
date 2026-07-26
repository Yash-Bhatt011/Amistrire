"use client";

import { useState } from "react";
import { ArrowUp, ArrowDown, Trash2, Plus, Upload } from "lucide-react";
import { useGalleryStore, type GalleryItemKind } from "@/lib/store/gallery-store";
import { uploadFile, type UploadBucket } from "@/lib/supabase/upload";

export default function AdminGalleryPage() {
  const items = useGalleryStore((s) => s.items ?? []);
  const addItem = useGalleryStore((s) => s.addItem);
  const updateItem = useGalleryStore((s) => s.updateItem);
  const removeItem = useGalleryStore((s) => s.removeItem);
  const moveItem = useGalleryStore((s) => s.moveItem);

  const [kind, setKind] = useState<GalleryItemKind>("image");
  const [url, setUrl] = useState("");
  const [uploading, setUploading] = useState(false);

  function handleAdd(e: React.FormEvent) {
    e.preventDefault();
    if (!url.trim()) return;
    addItem({ kind, url: url.trim(), big: false });
    setUrl("");
  }

  async function handleFileUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    e.target.value = "";
    setUploading(true);
    try {
      // Gallery bucket accepts photos, videos, and glb models alike.
      const uploadedUrl = await uploadFile("gallery" as UploadBucket, file);
      await addItem({ kind, url: uploadedUrl, big: false });
    } catch {
      alert("Upload failed — check you're logged in as staff and try again.");
    } finally {
      setUploading(false);
    }
  }

  return (
    <div>
      <h1 className="font-display text-2xl text-studio-ink">Homepage Gallery</h1>
      <p className="mt-1 max-w-xl text-sm text-studio-ink/50">
        The tile grid near the bottom of the homepage. Each tile can be a photo, a video, or a 3D
        model. Paste a URL or upload a file directly — both are stored permanently.
      </p>

      <form onSubmit={handleAdd} className="mt-6 flex max-w-2xl flex-wrap items-end gap-3">
        <div>
          <label className="mb-1.5 block text-xs uppercase tracking-wider text-studio-ink/40">Type</label>
          <select
            value={kind}
            onChange={(e) => setKind(e.target.value as GalleryItemKind)}
            className="rounded-lg border border-studio-line bg-white px-3 py-2.5 text-sm text-studio-ink focus:border-accent-cyan focus:outline-none"
          >
            <option value="image">Photo</option>
            <option value="video">Video</option>
            <option value="model">3D Model (GLB)</option>
          </select>
        </div>
        <div className="flex-1">
          <label className="mb-1.5 block text-xs uppercase tracking-wider text-studio-ink/40">URL</label>
          <input
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="https://..."
            className="w-full rounded-lg border border-studio-line bg-white px-3 py-2.5 text-sm text-studio-ink focus:border-accent-cyan focus:outline-none"
          />
        </div>
        <button
          type="submit"
          className="flex items-center gap-1.5 rounded-full bg-gradient-to-r from-accent-cyan to-accent-purple px-4 py-2.5 text-xs font-medium uppercase tracking-wider text-white"
        >
          <Plus className="h-3.5 w-3.5" /> Add Tile
        </button>
        <label className="flex cursor-pointer items-center gap-1.5 rounded-full border border-dashed border-studio-line px-4 py-2.5 text-xs text-studio-ink/50 hover:border-accent-cyan hover:text-accent-cyan">
          <Upload className="h-3.5 w-3.5" /> {uploading ? "Uploading..." : "Or upload a file"}
          <input
            type="file"
            accept={kind === "image" ? "image/*" : kind === "video" ? "video/*" : ".glb,.gltf"}
            disabled={uploading}
            onChange={handleFileUpload}
            className="sr-only"
          />
        </label>
      </form>

      <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((item, i) => (
          <div key={item.id} className="rounded-xl border border-studio-line bg-white p-4">
            <div className="flex items-center justify-between">
              <span className="rounded-full bg-studio-concrete px-2 py-0.5 text-[10px] uppercase text-studio-ink/50">
                {item.kind}
              </span>
              <div className="flex items-center gap-1">
                <button disabled={i === 0} onClick={() => moveItem(item.id, "up")} className="p-1 text-studio-ink/40 hover:text-accent-cyan disabled:opacity-20">
                  <ArrowUp className="h-3.5 w-3.5" />
                </button>
                <button disabled={i === items.length - 1} onClick={() => moveItem(item.id, "down")} className="p-1 text-studio-ink/40 hover:text-accent-cyan disabled:opacity-20">
                  <ArrowDown className="h-3.5 w-3.5" />
                </button>
                <button onClick={() => removeItem(item.id)} className="p-1 text-studio-ink/40 hover:text-rose-500">
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
            <input
              value={item.url}
              onChange={(e) => updateItem(item.id, { url: e.target.value })}
              placeholder="https://..."
              className="mt-3 w-full rounded-lg border border-studio-line bg-studio-concrete px-3 py-2 text-xs text-studio-ink focus:border-accent-cyan focus:outline-none"
            />
            <label className="mt-2 flex items-center gap-2 text-xs text-studio-ink/50">
              <input type="checkbox" checked={item.big ?? false} onChange={(e) => updateItem(item.id, { big: e.target.checked })} />
              Large tile
            </label>
          </div>
        ))}
      </div>
    </div>
  );
}
