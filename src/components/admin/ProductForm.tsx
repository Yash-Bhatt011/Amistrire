"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { Product } from "@/lib/types";
import { useCatalogStore } from "@/lib/store/catalog-store";
import { useAllCategoriesIncludingArchived } from "@/lib/catalog-hooks";

const BADGES: NonNullable<Product["badges"]>[number][] = ["bestseller", "new", "trending", "limited"];
const INVENTORY_OPTIONS: Product["inventory"][] = ["in-stock", "low-stock", "made-to-order"];

function slugify(name: string) {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export function ProductForm({ existing }: { existing?: Product }) {
  const router = useRouter();
  const categories = useAllCategoriesIncludingArchived();
  const addProduct = useCatalogStore((s) => s.addProduct);
  const updateProduct = useCatalogStore((s) => s.updateProduct);

  const [name, setName] = useState(existing?.name ?? "");
  const [tagline, setTagline] = useState(existing?.tagline ?? "");
  const [description, setDescription] = useState(existing?.description ?? "");
  const [categorySlug, setCategorySlug] = useState(existing?.categorySlug ?? categories[0]?.slug ?? "");
  const [basePrice, setBasePrice] = useState(existing?.basePrice ?? 499);
  const [inventory, setInventory] = useState<Product["inventory"]>(existing?.inventory ?? "in-stock");
  const [badges, setBadges] = useState<string[]>(existing?.badges ?? []);
  const [featured, setFeatured] = useState(existing?.featured ?? false);
  const [printMin, setPrintMin] = useState(existing?.printTimeHrs?.[0] ?? 1);
  const [printMax, setPrintMax] = useState(existing?.printTimeHrs?.[1] ?? 3);
  const [images, setImages] = useState<string[]>(existing?.media?.images ?? []);
  const [imageUrlInput, setImageUrlInput] = useState("");
  const [videoUrl, setVideoUrl] = useState(existing?.media?.videoUrl ?? "");
  const [modelUrl, setModelUrl] = useState(existing?.media?.modelUrl ?? "");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const media = images.length || videoUrl || modelUrl
      ? { images, videoUrl: videoUrl || undefined, modelUrl: modelUrl || undefined }
      : undefined;
    if (existing) {
      updateProduct(existing.slug, {
        name,
        tagline,
        description,
        categorySlug,
        basePrice,
        inventory,
        badges: badges.length ? (badges as Product["badges"]) : undefined,
        featured,
        printTimeHrs: [printMin, printMax],
        media,
      });
    } else {
      const slug = slugify(name) || `product-${Date.now()}`;
      const product: Product = {
        slug,
        categorySlug,
        name,
        tagline,
        description,
        basePrice,
        currency: "INR",
        accent: Math.random() > 0.5 ? "cyan" : "purple",
        badges: badges.length ? (badges as Product["badges"]) : undefined,
        printTimeHrs: [printMin, printMax],
        rating: 5,
        reviewCount: 0,
        inventory,
        options: [
          { type: "color", label: "Color", required: true, choices: [
            { value: "cyan", label: "Studio Blue", swatch: "#2997ff" },
            { value: "violet", label: "Studio Violet", swatch: "#bf5af2" },
          ]},
        ],
        featured,
        media,
      };
      addProduct(product);
    }
    router.push("/admin/products");
  }

  function handleFileUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const files = e.target.files;
    if (!files) return;
    const urls = Array.from(files).map((f) => URL.createObjectURL(f));
    setImages((prev) => [...prev, ...urls]);
    e.target.value = "";
  }

  function addImageUrl() {
    if (!imageUrlInput.trim()) return;
    setImages((prev) => [...prev, imageUrlInput.trim()]);
    setImageUrlInput("");
  }

  return (
    <form onSubmit={handleSubmit} className="mt-6 flex max-w-2xl flex-col gap-5">
      <div>
        <label className="mb-1.5 block text-xs uppercase tracking-wider text-studio-ink/40">Name</label>
        <input
          required
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full rounded-lg border border-studio-line bg-white px-3 py-2.5 text-sm text-studio-ink focus:border-accent-cyan focus:outline-none"
        />
      </div>

      <div>
        <label className="mb-1.5 block text-xs uppercase tracking-wider text-studio-ink/40">Tagline</label>
        <input
          required
          value={tagline}
          onChange={(e) => setTagline(e.target.value)}
          className="w-full rounded-lg border border-studio-line bg-white px-3 py-2.5 text-sm text-studio-ink focus:border-accent-cyan focus:outline-none"
        />
      </div>

      <div>
        <label className="mb-1.5 block text-xs uppercase tracking-wider text-studio-ink/40">Description</label>
        <textarea
          required
          rows={3}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full rounded-lg border border-studio-line bg-white px-3 py-2.5 text-sm text-studio-ink focus:border-accent-cyan focus:outline-none"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="mb-1.5 block text-xs uppercase tracking-wider text-studio-ink/40">Category</label>
          <select
            value={categorySlug}
            onChange={(e) => setCategorySlug(e.target.value)}
            className="w-full rounded-lg border border-studio-line bg-white px-3 py-2.5 text-sm text-studio-ink focus:border-accent-cyan focus:outline-none"
          >
            {categories.map((c) => (
              <option key={c.slug} value={c.slug}>{c.name}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="mb-1.5 block text-xs uppercase tracking-wider text-studio-ink/40">Inventory Status</label>
          <select
            value={inventory}
            onChange={(e) => setInventory(e.target.value as Product["inventory"])}
            className="w-full rounded-lg border border-studio-line bg-white px-3 py-2.5 text-sm text-studio-ink focus:border-accent-cyan focus:outline-none"
          >
            {INVENTORY_OPTIONS.map((opt) => (
              <option key={opt} value={opt}>{opt}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div>
          <label className="mb-1.5 block text-xs uppercase tracking-wider text-studio-ink/40">Base Price (₹)</label>
          <input
            type="number"
            required
            min={0}
            value={basePrice}
            onChange={(e) => setBasePrice(Number(e.target.value))}
            className="w-full rounded-lg border border-studio-line bg-white px-3 py-2.5 text-sm text-studio-ink focus:border-accent-cyan focus:outline-none"
          />
        </div>
        <div>
          <label className="mb-1.5 block text-xs uppercase tracking-wider text-studio-ink/40">Print Time Min (h)</label>
          <input
            type="number"
            min={0}
            value={printMin}
            onChange={(e) => setPrintMin(Number(e.target.value))}
            className="w-full rounded-lg border border-studio-line bg-white px-3 py-2.5 text-sm text-studio-ink focus:border-accent-cyan focus:outline-none"
          />
        </div>
        <div>
          <label className="mb-1.5 block text-xs uppercase tracking-wider text-studio-ink/40">Print Time Max (h)</label>
          <input
            type="number"
            min={0}
            value={printMax}
            onChange={(e) => setPrintMax(Number(e.target.value))}
            className="w-full rounded-lg border border-studio-line bg-white px-3 py-2.5 text-sm text-studio-ink focus:border-accent-cyan focus:outline-none"
          />
        </div>
      </div>

      <div>
        <label className="mb-1.5 block text-xs uppercase tracking-wider text-studio-ink/40">Badges</label>
        <div className="flex flex-wrap gap-2">
          {BADGES.map((b) => (
            <button
              type="button"
              key={b}
              onClick={() => setBadges((prev) => (prev.includes(b) ? prev.filter((x) => x !== b) : [...prev, b]))}
              className={`rounded-full border px-3 py-1.5 text-xs ${badges.includes(b) ? "border-accent-cyan bg-accent-cyan/10 text-accent-cyan" : "border-studio-line text-studio-ink/50"}`}
            >
              {b}
            </button>
          ))}
        </div>
      </div>

      <div className="rounded-xl border border-studio-line bg-studio-concrete p-4">
        <label className="mb-2 block text-xs uppercase tracking-wider text-studio-ink/40">Product Images</label>

        {images.length > 0 && (
          <div className="mb-3 flex flex-wrap gap-2">
            {images.map((img, i) => (
              <div key={img + i} className="group relative h-16 w-16 overflow-hidden rounded-lg border border-studio-line">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={img} alt="" className="h-full w-full object-cover" />
                <button
                  type="button"
                  onClick={() => setImages((prev) => prev.filter((_, idx) => idx !== i))}
                  className="absolute inset-0 flex items-center justify-center bg-black/50 text-xs text-white opacity-0 group-hover:opacity-100"
                >
                  Remove
                </button>
              </div>
            ))}
          </div>
        )}

        <div className="flex gap-2">
          <input
            value={imageUrlInput}
            onChange={(e) => setImageUrlInput(e.target.value)}
            placeholder="Paste an image URL..."
            className="flex-1 rounded-lg border border-studio-line bg-white px-3 py-2 text-sm text-studio-ink focus:border-accent-cyan focus:outline-none"
          />
          <button
            type="button"
            onClick={addImageUrl}
            className="rounded-lg border border-studio-line px-3 py-2 text-xs text-studio-ink/60 hover:border-accent-cyan hover:text-accent-cyan"
          >
            Add URL
          </button>
        </div>
        <label className="mt-2 flex w-full cursor-pointer items-center justify-center gap-2 rounded-lg border border-dashed border-studio-line py-2 text-xs text-studio-ink/50 hover:border-accent-cyan hover:text-accent-cyan">
          Or upload from your device
          <input type="file" accept="image/*" multiple onChange={handleFileUpload} className="sr-only" />
        </label>
        <p className="mt-2 text-[11px] text-studio-ink/40">
          URLs persist normally. Device uploads only preview in this tab — there's no image host
          behind this yet, so use a URL (or connect real storage later) for anything that needs to
          stay after a reload.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="mb-1.5 block text-xs uppercase tracking-wider text-studio-ink/40">Video URL (optional)</label>
          <input
            value={videoUrl}
            onChange={(e) => setVideoUrl(e.target.value)}
            placeholder="https://..."
            className="w-full rounded-lg border border-studio-line bg-white px-3 py-2.5 text-sm text-studio-ink focus:border-accent-cyan focus:outline-none"
          />
        </div>
        <div>
          <label className="mb-1.5 block text-xs uppercase tracking-wider text-studio-ink/40">3D Model URL (GLB, optional)</label>
          <input
            value={modelUrl}
            onChange={(e) => setModelUrl(e.target.value)}
            placeholder="https://.../model.glb"
            className="w-full rounded-lg border border-studio-line bg-white px-3 py-2.5 text-sm text-studio-ink focus:border-accent-cyan focus:outline-none"
          />
        </div>
      </div>

      <label className="flex items-center gap-2 text-sm text-studio-ink">
        <input type="checkbox" checked={featured} onChange={(e) => setFeatured(e.target.checked)} />
        Feature on homepage
      </label>

      <div className="mt-2 flex gap-3">
        <button
          type="submit"
          className="rounded-full bg-gradient-to-r from-accent-cyan to-accent-purple px-6 py-2.5 text-xs font-medium uppercase tracking-wider text-white hover:scale-[1.02]"
        >
          {existing ? "Save Changes" : "Create Product"}
        </button>
      </div>
    </form>
  );
}
