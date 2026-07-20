"use client";

import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { X, ShoppingBag, Minus, Plus } from "lucide-react";
import { useCartStore, cartSubtotal } from "@/lib/store/cart-store";
import { useAllProductsIncludingArchived, findProduct } from "@/lib/catalog-hooks";
import { formatINR } from "@/lib/utils";

export function MiniCart() {
  const products = useAllProductsIncludingArchived();
  const isOpen = useCartStore((s) => s.isMiniCartOpen);
  const close = useCartStore((s) => s.closeMiniCart);
  const lines = useCartStore((s) => s.lines);
  const setQuantity = useCartStore((s) => s.setQuantity);
  const removeLine = useCartStore((s) => s.removeLine);

  const subtotal = cartSubtotal(lines);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            key="minicart-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={close}
            className="fixed inset-0 z-[60] bg-black/60 backdrop-blur-sm"
          />
          <motion.div
            key="minicart-panel"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="fixed inset-y-0 right-0 z-[70] flex w-full max-w-sm flex-col border-l border-studio-line bg-studio-panel"
          >
            <div className="flex items-center justify-between border-b border-studio-line px-5 py-4">
              <p className="font-display text-sm text-studio-ink">Your Cart ({lines.length})</p>
              <button onClick={close} aria-label="Close cart">
                <X className="h-4 w-4 text-studio-ink/60 hover:text-studio-ink" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto px-5 py-4">
              {lines.length === 0 ? (
                <div className="flex h-full flex-col items-center justify-center text-center text-studio-ink/40">
                  <ShoppingBag className="h-8 w-8" />
                  <p className="mt-3 text-sm">Your cart is empty.</p>
                </div>
              ) : (
                <div className="flex flex-col gap-4">
                  {lines.map((line) => {
                    const product = findProduct(products, line.productSlug);
                    if (!product) return null;
                    return (
                      <div key={line.id} className="flex gap-3 border-b border-studio-line pb-4">
                        <div className="h-16 w-16 shrink-0 rounded-lg border border-studio-line bg-studio-void" />
                        <div className="flex-1">
                          <p className="text-sm text-studio-ink">{product.name}</p>
                          <p className="mt-0.5 text-[11px] text-studio-ink/40">
                            {Object.values(line.selectedOptions).join(" · ") || "Standard"}
                          </p>
                          <div className="mt-2 flex items-center justify-between">
                            <div className="flex items-center gap-2 rounded-full border border-studio-line px-2 py-1">
                              <button onClick={() => setQuantity(line.id, line.quantity - 1)}>
                                <Minus className="h-3 w-3 text-studio-ink/60" />
                              </button>
                              <span className="w-4 text-center text-xs text-studio-ink">{line.quantity}</span>
                              <button onClick={() => setQuantity(line.id, line.quantity + 1)}>
                                <Plus className="h-3 w-3 text-studio-ink/60" />
                              </button>
                            </div>
                            <span className="font-mono text-xs text-studio-ink">
                              {formatINR(line.unitPrice * line.quantity)}
                            </span>
                          </div>
                        </div>
                        <button
                          onClick={() => removeLine(line.id)}
                          className="self-start text-studio-ink/30 hover:text-rose-400"
                          aria-label="Remove item"
                        >
                          <X className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {lines.length > 0 && (
              <div className="border-t border-studio-line p-5">
                <div className="mb-4 flex items-center justify-between text-sm">
                  <span className="text-studio-ink/60">Subtotal</span>
                  <span className="font-mono text-studio-ink">{formatINR(subtotal)}</span>
                </div>
                <Link
                  href="/checkout"
                  onClick={close}
                  className="block rounded-full bg-gradient-to-r from-accent-cyan to-accent-purple py-3 text-center text-xs font-medium uppercase tracking-wider text-studio-void transition-transform hover:scale-[1.02]"
                >
                  Checkout
                </Link>
                <Link
                  href="/cart"
                  onClick={close}
                  className="mt-2 block text-center text-xs text-studio-ink/40 hover:text-studio-ink"
                >
                  View full cart
                </Link>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
