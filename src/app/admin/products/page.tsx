"use client";

import Link from "next/link";
import { Plus, Pencil, Copy, Trash2, Archive, ArchiveRestore } from "lucide-react";
import { useAllProductsIncludingArchived } from "@/lib/catalog-hooks";
import { useCatalogStore } from "@/lib/store/catalog-store";
import { formatINR } from "@/lib/utils";

export default function AdminProductsPage() {
  const products = useAllProductsIncludingArchived();
  const deleteProduct = useCatalogStore((s) => s.deleteProduct);
  const duplicateProduct = useCatalogStore((s) => s.duplicateProduct);
  const toggleArchiveProduct = useCatalogStore((s) => s.toggleArchiveProduct);

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl text-studio-ink">Products</h1>
          <p className="mt-1 text-sm text-studio-ink/50">{products.length} total</p>
        </div>
        <Link
          href="/admin/products/new"
          className="flex items-center gap-2 rounded-full bg-gradient-to-r from-accent-cyan to-accent-purple px-4 py-2 text-xs font-medium uppercase tracking-wider text-white hover:scale-[1.02]"
        >
          <Plus className="h-3.5 w-3.5" /> Add Product
        </Link>
      </div>

      <div className="mt-6 overflow-hidden rounded-2xl border border-studio-line bg-white">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-studio-line text-xs uppercase tracking-wider text-studio-ink/40">
              <th className="px-4 py-3">Name</th>
              <th className="px-4 py-3">Category</th>
              <th className="px-4 py-3">Price</th>
              <th className="px-4 py-3">Inventory</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map((p) => (
              <tr key={p.slug} className="border-b border-studio-line last:border-0">
                <td className="px-4 py-3 text-studio-ink">{p.name}</td>
                <td className="px-4 py-3 text-studio-ink/50">{p.categorySlug}</td>
                <td className="px-4 py-3 font-mono text-studio-ink/70">{formatINR(p.basePrice)}</td>
                <td className="px-4 py-3 text-studio-ink/50">{p.inventory}</td>
                <td className="px-4 py-3">
                  {p.archived ? (
                    <span className="rounded-full bg-studio-concrete px-2 py-0.5 text-[10px] uppercase text-studio-ink/40">Archived</span>
                  ) : (
                    <span className="rounded-full bg-accent-cyan/10 px-2 py-0.5 text-[10px] uppercase text-accent-cyan">Live</span>
                  )}
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center justify-end gap-3 text-studio-ink/40">
                    <Link href={`/admin/products/${p.slug}`} aria-label="Edit" className="hover:text-accent-cyan">
                      <Pencil className="h-3.5 w-3.5" />
                    </Link>
                    <button onClick={() => duplicateProduct(p.slug)} aria-label="Duplicate" className="hover:text-accent-cyan">
                      <Copy className="h-3.5 w-3.5" />
                    </button>
                    <button onClick={() => toggleArchiveProduct(p.slug)} aria-label="Archive" className="hover:text-accent-cyan">
                      {p.archived ? <ArchiveRestore className="h-3.5 w-3.5" /> : <Archive className="h-3.5 w-3.5" />}
                    </button>
                    <button
                      onClick={() => {
                        if (confirm(`Delete "${p.name}"? This can't be undone.`)) deleteProduct(p.slug);
                      }}
                      aria-label="Delete"
                      className="hover:text-rose-500"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
