"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { Search, X, Clock } from "lucide-react";
import { useSearchProducts } from "@/lib/catalog-hooks";
import { formatINR } from "@/lib/utils";

const HISTORY_KEY = "amistrie-search-history";

function readHistory(): string[] {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(window.localStorage.getItem(HISTORY_KEY) ?? "[]");
  } catch {
    return [];
  }
}

function writeHistory(terms: string[]) {
  window.localStorage.setItem(HISTORY_KEY, JSON.stringify(terms.slice(0, 6)));
}

export function SearchOverlay({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [query, setQuery] = useState("");
  const [history, setHistory] = useState<string[]>([]);

  useEffect(() => {
    if (open) setHistory(readHistory());
  }, [open]);

  const results = useSearchProducts(query).slice(0, 6);

  function commit(term: string) {
    const next = [term, ...history.filter((h) => h !== term)];
    setHistory(next);
    writeHistory(next);
  }

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[80] bg-studio-void/95 backdrop-blur-md"
        >
          <div className="mx-auto flex max-w-2xl flex-col px-6 pt-24 sm:pt-32">
            <div className="flex items-center gap-3 border-b border-studio-line pb-4">
              <Search className="h-5 w-5 text-studio-ink/40" />
              <input
                autoFocus
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && query && commit(query)}
                placeholder="Search products, categories..."
                className="flex-1 bg-transparent font-display text-lg text-studio-ink placeholder:text-studio-ink/30 focus:outline-none"
              />
              <button onClick={onClose} aria-label="Close search">
                <X className="h-5 w-5 text-studio-ink/50 hover:text-studio-ink" />
              </button>
            </div>

            <div className="mt-6">
              {query.length === 0 && history.length > 0 && (
                <div>
                  <p className="mb-3 text-xs uppercase tracking-wider text-studio-ink/30">Recent Searches</p>
                  <div className="flex flex-wrap gap-2">
                    {history.map((h) => (
                      <button
                        key={h}
                        onClick={() => setQuery(h)}
                        className="flex items-center gap-1.5 rounded-full border border-studio-line px-3 py-1.5 text-xs text-studio-ink/60 hover:border-accent-cyan hover:text-studio-ink"
                      >
                        <Clock className="h-3 w-3" /> {h}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {query.length > 0 && (
                <div className="flex flex-col gap-1">
                  {results.length === 0 && (
                    <p className="py-8 text-center text-sm text-studio-ink/40">No products match &ldquo;{query}&rdquo;.</p>
                  )}
                  {results.map((p) => (
                    <Link
                      key={p.slug}
                      href={`/products/${p.categorySlug}/${p.slug}`}
                      onClick={() => {
                        commit(query);
                        onClose();
                      }}
                      className="flex items-center justify-between rounded-xl px-3 py-3 hover:bg-studio-concrete"
                    >
                      <div>
                        <p className="text-sm text-studio-ink">{p.name}</p>
                        <p className="text-xs text-studio-ink/40">{p.tagline}</p>
                      </div>
                      <span className="font-mono text-xs text-studio-ink/60">{formatINR(p.basePrice)}</span>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
