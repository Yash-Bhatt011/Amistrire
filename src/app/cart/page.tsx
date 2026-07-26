"use client";

import Link from "next/link";
import { Minus, Plus, X, ShoppingBag } from "lucide-react";
import { Navbar } from "@/components/ui/Navbar";
import { Footer } from "@/components/ui/Footer";
import { PageHeader } from "@/components/ui/PageHeader";
import { CouponInput } from "@/components/ui/CouponInput";
import { useCartStore, cartSubtotal } from "@/lib/store/cart-store";
import { useAllProductsIncludingArchived, findProduct } from "@/lib/catalog-hooks";
import { formatINR } from "@/lib/utils";
import { useAuthStore } from "@/lib/store/auth-store";
import { useCouponSession } from "@/lib/use-coupon-session";

export default function CartPage() {
  const lines = useCartStore((s) => s.lines);
  const allProducts = useAllProductsIncludingArchived();
  const setQuantity = useCartStore((s) => s.setQuantity);
  const removeLine = useCartStore((s) => s.removeLine);
  const user = useAuthStore((s) => s.user);
  const { applied, apply, remove, discount, freeShipping } = useCouponSession();

  const subtotal = cartSubtotal(lines);
  const shipping = freeShipping || subtotal === 0 ? 0 : subtotal > 999 ? 0 : 99;
  const tax = Math.round((subtotal - discount) * 0.18);
  const total = Math.max(0, subtotal - discount) + shipping + tax;
  const isFirstOrder = !user?.hasOrderedBefore;

  return (
    <>
      <Navbar />
      <PageHeader eyebrow="Your Cart" title="Cart" />
      <main className="mx-auto max-w-5xl px-6 py-12 sm:px-12">
        {lines.length === 0 ? (
          <div className="flex flex-col items-center py-16 text-center text-studio-ink/40">
            <ShoppingBag className="h-10 w-10" />
            <p className="mt-4 text-sm">Your cart is empty.</p>
            <Link href="/products" className="mt-4 rounded-full border border-studio-line px-5 py-2 text-xs text-studio-ink hover:border-accent-cyan hover:text-accent-cyan">
              Browse Products
            </Link>
          </div>
        ) : (
          <div className="grid gap-10 lg:grid-cols-[1fr_360px]">
            <div className="flex flex-col gap-4">
              {lines.map((line) => {
                const product = findProduct(allProducts, line.productSlug);
                if (!product) return null;
                return (
                  <div key={line.id} className="flex gap-4 rounded-2xl border border-studio-line bg-studio-panel p-4">
                    <div className="h-20 w-20 shrink-0 rounded-xl border border-studio-line bg-studio-void" />
                    <div className="flex-1">
                      <div className="flex items-start justify-between">
                        <div>
                          <Link href={`/products/${product.categorySlug}/${product.slug}`} className="text-sm text-studio-ink hover:text-accent-cyan">
                            {product.name}
                          </Link>
                          <p className="mt-1 text-xs text-studio-ink/40">
                            {Object.values(line.selectedOptions).join(" · ") || "Standard"}
                          </p>
                        </div>
                        <button onClick={() => removeLine(line.id)} className="text-studio-ink/30 hover:text-rose-400" aria-label="Remove">
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                      <div className="mt-3 flex items-center justify-between">
                        <div className="flex items-center gap-3 rounded-full border border-studio-line px-3 py-1.5">
                          <button onClick={() => setQuantity(line.id, line.quantity - 1)}>
                            <Minus className="h-3.5 w-3.5 text-studio-ink/60" />
                          </button>
                          <span className="w-4 text-center text-sm text-studio-ink">{line.quantity}</span>
                          <button onClick={() => setQuantity(line.id, line.quantity + 1)}>
                            <Plus className="h-3.5 w-3.5 text-studio-ink/60" />
                          </button>
                        </div>
                        <span className="font-mono text-sm text-studio-ink">{formatINR(line.unitPrice * line.quantity)}</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="h-fit rounded-2xl border border-studio-line bg-studio-panel p-6">
              <p className="font-display text-sm text-studio-ink">Order Summary</p>
              <div className="mt-4 flex flex-col gap-2 text-sm">
                <div className="flex justify-between text-studio-ink/60">
                  <span>Subtotal</span>
                  <span className="font-mono">{formatINR(subtotal)}</span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between text-accent-cyan">
                    <span>Discount</span>
                    <span className="font-mono">-{formatINR(discount)}</span>
                  </div>
                )}
                <div className="flex justify-between text-studio-ink/60">
                  <span>Shipping</span>
                  <span className="font-mono">{shipping === 0 ? "Free" : formatINR(shipping)}</span>
                </div>
                <div className="flex justify-between text-studio-ink/60">
                  <span>Tax (18% GST)</span>
                  <span className="font-mono">{formatINR(tax)}</span>
                </div>
                <div className="mt-2 flex justify-between border-t border-studio-line pt-3 text-studio-ink">
                  <span>Total</span>
                  <span className="font-mono">{formatINR(total)}</span>
                </div>
              </div>

              <div className="mt-5">
                <CouponInput
                  subtotal={subtotal}
                  isFirstOrder={isFirstOrder}
                  appliedCoupons={applied}
                  onApply={apply}
                  onRemove={remove}
                />
              </div>

              <Link
                href="/checkout"
                className="mt-6 block rounded-full bg-gradient-to-r from-accent-cyan to-accent-purple py-3 text-center text-xs font-medium uppercase tracking-wider text-studio-void hover:scale-[1.02]"
              >
                Proceed to Checkout
              </Link>
            </div>
          </div>
        )}
      </main>
      <Footer />
    </>
  );
}
