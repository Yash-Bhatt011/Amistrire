"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Navbar } from "@/components/ui/Navbar";
import { Footer } from "@/components/ui/Footer";
import { PageHeader } from "@/components/ui/PageHeader";
import { CouponInput } from "@/components/ui/CouponInput";
import { useCartStore, cartSubtotal } from "@/lib/store/cart-store";
import { useCouponSession } from "@/lib/use-coupon-session";
import { useAuthStore } from "@/lib/store/auth-store";
import { useAccountDataStore } from "@/lib/store/account-data-store";
import { formatINR } from "@/lib/utils";
import type { Order } from "@/lib/types";

export default function CheckoutPage() {
  const router = useRouter();
  const lines = useCartStore((s) => s.lines);
  const clearCart = useCartStore((s) => s.clear);
  const { applied, apply, remove, discount, freeShipping, clearAll } = useCouponSession();
  const currentUser = useAuthStore((s) => s.currentUser);
  const markOrdered = useAuthStore((s) => s.markOrdered);
  const addOrder = useAccountDataStore((s) => s.addOrder);

  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [pincode, setPincode] = useState("");
  const [phone, setPhone] = useState("");
  const [placing, setPlacing] = useState(false);

  const subtotal = cartSubtotal(lines);
  const shipping = freeShipping || subtotal === 0 ? 0 : subtotal > 999 ? 0 : 99;
  const tax = Math.round((subtotal - discount) * 0.18);
  const total = Math.max(0, subtotal - discount) + shipping + tax;
  const user = currentUser();
  const isFirstOrder = !user?.hasOrderedBefore;
  const canPlace = lines.length > 0 && name && address && city && pincode && phone;

  function placeOrder() {
    if (!canPlace) return;
    setPlacing(true);
    const order: Order = {
      id: `STR-${Date.now().toString().slice(-8)}`,
      date: new Date().toISOString(),
      status: "processing",
      items: lines,
      subtotal,
      discount,
      shipping,
      tax,
      total,
      couponCode: applied[0]?.code,
    };
    setTimeout(() => {
      if (user) {
        addOrder(user.email, order);
        markOrdered(user.email);
      }
      clearCart();
      clearAll();
      router.push(`/checkout/confirmation?order=${order.id}&total=${total}`);
    }, 900);
  }

  return (
    <>
      <Navbar />
      <PageHeader eyebrow="Almost there" title="Checkout" />
      <main className="mx-auto max-w-5xl px-6 py-12 sm:px-12">
        {lines.length === 0 ? (
          <div className="py-16 text-center text-sm text-studio-ink/40">
            Your cart is empty.{" "}
            <Link href="/products" className="text-accent-cyan hover:underline">
              Browse products
            </Link>{" "}
            to add something first.
          </div>
        ) : (
          <div className="grid gap-10 lg:grid-cols-[1fr_360px]">
            <div className="flex flex-col gap-6">
              {!user && (
                <div className="rounded-2xl border border-studio-line bg-studio-panel p-5 text-sm text-studio-ink/60">
                  <Link href="/account/login" className="text-accent-cyan hover:underline">Log in</Link> for faster
                  checkout and order tracking, or continue as a guest below.
                </div>
              )}

              <div className="rounded-2xl border border-studio-line bg-studio-panel p-6">
                <p className="font-display text-sm text-studio-ink">Shipping Address</p>
                <div className="mt-4 grid gap-4 sm:grid-cols-2">
                  <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Full name" className="rounded-lg border border-studio-line bg-studio-void px-3 py-2.5 text-sm text-studio-ink placeholder:text-studio-ink/30 focus:border-accent-cyan focus:outline-none sm:col-span-2" />
                  <input value={address} onChange={(e) => setAddress(e.target.value)} placeholder="Address line" className="rounded-lg border border-studio-line bg-studio-void px-3 py-2.5 text-sm text-studio-ink placeholder:text-studio-ink/30 focus:border-accent-cyan focus:outline-none sm:col-span-2" />
                  <input value={city} onChange={(e) => setCity(e.target.value)} placeholder="City / State" className="rounded-lg border border-studio-line bg-studio-void px-3 py-2.5 text-sm text-studio-ink placeholder:text-studio-ink/30 focus:border-accent-cyan focus:outline-none" />
                  <input value={pincode} onChange={(e) => setPincode(e.target.value)} placeholder="PIN code" className="rounded-lg border border-studio-line bg-studio-void px-3 py-2.5 text-sm text-studio-ink placeholder:text-studio-ink/30 focus:border-accent-cyan focus:outline-none" />
                  <input value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="Phone number" className="rounded-lg border border-studio-line bg-studio-void px-3 py-2.5 text-sm text-studio-ink placeholder:text-studio-ink/30 focus:border-accent-cyan focus:outline-none sm:col-span-2" />
                </div>
              </div>
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
                <CouponInput subtotal={subtotal} isFirstOrder={isFirstOrder} appliedCoupons={applied} onApply={apply} onRemove={remove} />
              </div>

              <button
                onClick={placeOrder}
                disabled={!canPlace || placing}
                className="mt-6 w-full rounded-full bg-gradient-to-r from-accent-cyan to-accent-purple py-3 text-xs font-medium uppercase tracking-wider text-studio-void transition-all hover:scale-[1.02] disabled:cursor-not-allowed disabled:opacity-40"
              >
                {placing ? "Placing Order..." : `Place Order — ${formatINR(total)}`}
              </button>
              <p className="mt-3 text-center text-[11px] text-studio-ink/30">
                Payment processing isn't wired up yet — placing an order here simulates a confirmation.
              </p>
            </div>
          </div>
        )}
      </main>
      <Footer />
    </>
  );
}
