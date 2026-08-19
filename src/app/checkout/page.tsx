"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Script from "next/script";
import { Navbar } from "@/components/ui/Navbar";
import { Footer } from "@/components/ui/Footer";
import { PageHeader } from "@/components/ui/PageHeader";
import { CouponInput } from "@/components/ui/CouponInput";
import { useCartStore, cartSubtotal } from "@/lib/store/cart-store";
import { useCouponSession } from "@/lib/use-coupon-session";
import { useAuthStore } from "@/lib/store/auth-store";
import { checkoutSchema } from "@/lib/validation";
import { formatINR } from "@/lib/utils";

declare global {
  interface Window {
    Razorpay: any;
  }
}

export default function CheckoutPage() {
  const router = useRouter();
  const lines = useCartStore((s) => s.lines);
  const clearCart = useCartStore((s) => s.clear);
  const { applied, apply, remove, discount, freeShipping, clearAll } = useCouponSession();
  const user = useAuthStore((s) => s.user);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [pincode, setPincode] = useState("");
  const [phone, setPhone] = useState("");
  const [placing, setPlacing] = useState(false);
  const [placeError, setPlaceError] = useState<string | null>(null);
  const [razorpayReady, setRazorpayReady] = useState(false);

  // These are a preview for the customer — the real amount that gets
  // charged is always recomputed server-side in /api/checkout/create-order
  // from the actual product data, never from these client-side numbers.
  const subtotal = cartSubtotal(lines);
  const shipping = freeShipping || subtotal === 0 ? 0 : subtotal > 999 ? 0 : 99;
  const tax = Math.round((subtotal - discount) * 0.18);
  const total = Math.max(0, subtotal - discount) + shipping + tax;
  const isFirstOrder = !user?.hasOrderedBefore;
  const canPlace = lines.length > 0 && name && email && address && city && pincode && phone;

  useEffect(() => {
    if (user?.email && !email) setEmail(user.email);
  }, [user, email]);

  async function placeOrder() {
    if (!canPlace) return;

    const parsed = checkoutSchema.safeParse({ name, email, address, city, pincode, phone });
    if (!parsed.success) {
      setPlaceError(parsed.error.issues[0]?.message ?? "Please check the details you entered.");
      return;
    }
    if (!razorpayReady || !window.Razorpay) {
      setPlaceError("Payment is still loading — try again in a moment.");
      return;
    }

    setPlacing(true);
    setPlaceError(null);

    let created: any;
    try {
      const res = await fetch("/api/checkout/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: lines.map((l) => ({
            productSlug: l.productSlug,
            quantity: l.quantity,
            selectedOptions: l.selectedOptions,
          })),
          couponCode: applied[0]?.code,
          shipping: parsed.data,
        }),
      });
      created = await res.json();
      if (!res.ok) throw new Error(created.error ?? "Couldn't start checkout.");
    } catch (err: any) {
      setPlacing(false);
      setPlaceError(err.message ?? "We couldn't start checkout — please try again.");
      return;
    }

    const rzp = new window.Razorpay({
      key: created.keyId,
      amount: created.amount,
      currency: created.currency,
      order_id: created.razorpayOrderId,
      name: "Amistrié Print Studio",
      description: `Order ${created.orderId}`,
      prefill: { name, email, contact: phone },
      theme: { color: "#22d3ee" },
      handler: async (response: any) => {
        try {
          const verifyRes = await fetch("/api/checkout/verify", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              orderId: created.orderId,
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
            }),
          });
          if (!verifyRes.ok) throw new Error();
        } catch {
          setPlacing(false);
          setPlaceError("Payment received but couldn't be confirmed — contact us with your order ID.");
          return;
        }

        clearCart();
        clearAll();
        const tokenParam = created.guestToken ? `&t=${created.guestToken}` : "";
        router.push(`/checkout/confirmation?order=${created.orderId}&total=${created.total}${tokenParam}`);
      },
      modal: {
        ondismiss: () => {
          setPlacing(false);
          setPlaceError("Payment was cancelled. You can try again whenever you're ready.");
        },
      },
    });

    rzp.on("payment.failed", () => {
      setPlacing(false);
      setPlaceError("Payment failed. Please try again or use a different payment method.");
    });

    rzp.open();
  }

  return (
    <>
      <Script src="https://checkout.razorpay.com/v1/checkout.js" onLoad={() => setRazorpayReady(true)} />
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
                  <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" className="rounded-lg border border-studio-line bg-studio-void px-3 py-2.5 text-sm text-studio-ink placeholder:text-studio-ink/30 focus:border-accent-cyan focus:outline-none sm:col-span-2" />
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
                {placing ? "Processing..." : `Pay — ${formatINR(total)}`}
              </button>
              {placeError && <p className="mt-3 text-center text-xs text-rose-400">{placeError}</p>}
              <p className="mt-3 text-center text-[11px] text-studio-ink/30">
                Secured by Razorpay. The amount charged is verified server-side before your order is confirmed.
              </p>
            </div>
          </div>
        )}
      </main>
      <Footer />
    </>
  );
}
