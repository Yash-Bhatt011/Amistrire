"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { PartyPopper, X, Ticket } from "lucide-react";
import { useCouponStore } from "@/lib/store/coupon-store";
import type { Coupon } from "@/lib/types";
import { cn } from "@/lib/utils";

export function CouponInput({
  subtotal,
  isFirstOrder,
  appliedCoupons,
  onApply,
  onRemove,
}: {
  subtotal: number;
  isFirstOrder: boolean;
  appliedCoupons: Coupon[];
  onApply: (coupon: Coupon) => void;
  onRemove: (code: string) => void;
}) {
  const coupons = useCouponStore((s) => s.coupons ?? []);
  const [value, setValue] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [justApplied, setJustApplied] = useState<string | null>(null);

  function handleApply() {
    setError(null);
    const coupon = coupons.find((c) => c.code.toLowerCase() === value.trim().toLowerCase());
    if (!coupon) {
      setError("That code isn't valid.");
      return;
    }
    if (appliedCoupons.some((c) => c.code === coupon.code)) {
      setError("That coupon is already applied.");
      return;
    }
    if (coupon.expiresAt && new Date(coupon.expiresAt) < new Date()) {
      setError("This coupon has expired.");
      return;
    }
    if (coupon.minOrderValue && subtotal < coupon.minOrderValue) {
      setError(`Add ₹${coupon.minOrderValue - subtotal} more to use this code.`);
      return;
    }
    if (coupon.firstOrderOnly && !isFirstOrder) {
      setError("This code is reserved for first orders.");
      return;
    }
    if (appliedCoupons.length > 0 && (!coupon.stackable || appliedCoupons.some((c) => !c.stackable))) {
      setError("This code can't be combined with your other coupon.");
      return;
    }
    onApply(coupon);
    setJustApplied(coupon.code);
    setValue("");
    setTimeout(() => setJustApplied(null), 1800);
  }

  return (
    <div>
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Ticket className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-studio-ink/30" />
          <input
            value={value}
            onChange={(e) => setValue(e.target.value.toUpperCase())}
            onKeyDown={(e) => e.key === "Enter" && handleApply()}
            placeholder="Coupon code"
            className="w-full rounded-full border border-studio-line bg-studio-void py-2.5 pl-9 pr-3 text-sm text-studio-ink placeholder:text-studio-ink/30 focus:border-accent-cyan focus:outline-none"
          />
        </div>
        <button
          onClick={handleApply}
          className="rounded-full border border-studio-line px-4 text-xs uppercase tracking-wider text-studio-ink transition-colors hover:border-accent-cyan hover:text-accent-cyan"
        >
          Apply
        </button>
      </div>

      <AnimatePresence>
        {error && (
          <motion.p
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="mt-2 text-xs text-rose-400"
          >
            {error}
          </motion.p>
        )}
        {justApplied && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            className="mt-2 flex items-center gap-2 rounded-lg border border-accent-cyan/30 bg-accent-cyan/10 px-3 py-2 text-xs text-accent-cyan"
          >
            <PartyPopper className="h-3.5 w-3.5" />
            {justApplied} applied!
          </motion.div>
        )}
      </AnimatePresence>

      {appliedCoupons.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-2">
          {appliedCoupons.map((c) => (
            <span
              key={c.code}
              className={cn(
                "flex items-center gap-2 rounded-full border border-accent-purple/30 bg-accent-purple/10 px-3 py-1 text-xs text-accent-purple"
              )}
            >
              {c.code}
              <button onClick={() => onRemove(c.code)} aria-label="Remove coupon">
                <X className="h-3 w-3" />
              </button>
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
