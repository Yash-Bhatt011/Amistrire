import "server-only";
import type { SupabaseClient } from "@supabase/supabase-js";
import { rowToProduct, rowToCoupon } from "@/lib/supabase/mappers";
import type { CartLine, CartLineOptions } from "@/lib/types";

export type PriceableLine = {
  productSlug: string;
  quantity: number;
  selectedOptions: CartLineOptions;
};

export type ComputedPricing = {
  lines: CartLine[];
  subtotal: number;
  discount: number;
  shipping: number;
  tax: number;
  total: number;
  freeShipping: boolean;
  couponCode?: string;
  error?: string;
};

/**
 * Recomputes order pricing entirely from the database — never from
 * anything the client sent. This is what stands between "the browser
 * says this order costs ₹1" and what Razorpay actually charges.
 */
export async function computeOrderPricing(
  supabase: SupabaseClient,
  requestedLines: PriceableLine[],
  couponCode: string | undefined,
  userId: string | null
): Promise<ComputedPricing> {
  if (!requestedLines.length) {
    return { lines: [], subtotal: 0, discount: 0, shipping: 0, tax: 0, total: 0, freeShipping: false, error: "Cart is empty." };
  }

  const slugs = [...new Set(requestedLines.map((l) => l.productSlug))];
  const { data: productRows } = await supabase.from("products").select("*").in("slug", slugs);
  const products = (productRows ?? []).map(rowToProduct);

  const lines: CartLine[] = [];
  for (const req of requestedLines) {
    const product = products.find((p) => p.slug === req.productSlug);
    if (!product || product.archived) {
      return { lines: [], subtotal: 0, discount: 0, shipping: 0, tax: 0, total: 0, freeShipping: false, error: `Product "${req.productSlug}" is no longer available.` };
    }
    const quantity = Math.max(1, Math.min(50, Math.floor(req.quantity) || 1));

    let unitPrice = product.basePrice;
    for (const opt of product.options) {
      const chosenValue = req.selectedOptions?.[opt.type];
      const choice = opt.choices?.find((c) => c.value === chosenValue);
      if (choice?.priceDelta) unitPrice += choice.priceDelta;
    }

    lines.push({
      id: `${req.productSlug}-${JSON.stringify(req.selectedOptions)}`,
      productSlug: req.productSlug,
      quantity,
      selectedOptions: req.selectedOptions ?? {},
      unitPrice,
    });
  }

  const subtotal = lines.reduce((sum, l) => sum + l.unitPrice * l.quantity, 0);

  let discount = 0;
  let freeShipping = false;
  let appliedCouponCode: string | undefined;

  if (couponCode) {
    const { data: couponRow } = await supabase.from("coupons").select("*").eq("code", couponCode).maybeSingle();
    if (couponRow) {
      const coupon = rowToCoupon(couponRow);
      const now = new Date();
      const expired = coupon.expiresAt ? new Date(coupon.expiresAt) < now : false;
      const meetsMin = !coupon.minOrderValue || subtotal >= coupon.minOrderValue;

      let firstOrderOk = true;
      if (coupon.firstOrderOnly) {
        if (!userId) {
          firstOrderOk = false; // first-order coupons require an account so we can check
        } else {
          const { count } = await supabase
            .from("orders")
            .select("id", { count: "exact", head: true })
            .eq("user_id", userId)
            .eq("payment_status", "paid");
          firstOrderOk = (count ?? 0) === 0;
        }
      }

      let underLimit = true;
      if (coupon.usageLimit) {
        const { count } = await supabase
          .from("orders")
          .select("id", { count: "exact", head: true })
          .eq("coupon_code", coupon.code)
          .eq("payment_status", "paid");
        underLimit = (count ?? 0) < coupon.usageLimit;
      }

      if (!expired && meetsMin && firstOrderOk && underLimit) {
        appliedCouponCode = coupon.code;
        if (coupon.type === "percentage") discount = Math.round((subtotal * coupon.value) / 100);
        else if (coupon.type === "fixed") discount = coupon.value;
        else if (coupon.type === "free-shipping") freeShipping = true;
        discount = Math.min(discount, subtotal);
      }
    }
  }

  const shipping = freeShipping || subtotal === 0 ? 0 : subtotal > 999 ? 0 : 99;
  const tax = Math.round((subtotal - discount) * 0.18);
  const total = Math.max(0, subtotal - discount) + shipping + tax;

  return { lines, subtotal, discount, shipping, tax, total, freeShipping, couponCode: appliedCouponCode };
}
