import { NextResponse, type NextRequest } from "next/server";
import Razorpay from "razorpay";
import { createAdminClient } from "@/lib/supabase/admin";
import { createClient as createServerClient } from "@/lib/supabase/server";
import { computeOrderPricing } from "@/lib/server/pricing";
import { createOrderRequestSchema } from "@/lib/validation";

// Generic error messages to the client — don't leak internals (query
// failures, stack traces, etc.) that could help an attacker map out the
// backend.
const GENERIC_ERROR = NextResponse.json({ error: "We couldn't process that order. Please try again." }, { status: 400 });

export async function POST(request: NextRequest) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return GENERIC_ERROR;
  }

  const parsed = createOrderRequestSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0]?.message ?? "Invalid request." }, { status: 400 });
  }
  const { items, couponCode, shipping } = parsed.data;

  const keyId = process.env.RAZORPAY_KEY_ID;
  const keySecret = process.env.RAZORPAY_KEY_SECRET;
  if (!keyId || !keySecret) {
    return NextResponse.json({ error: "Payments are not configured yet." }, { status: 503 });
  }

  // Who's placing this order (if anyone) — read from their session cookie,
  // never trusted from the request body.
  const authClient = await createServerClient();
  const {
    data: { user },
  } = await authClient.auth.getUser();

  const admin = createAdminClient();

  const pricing = await computeOrderPricing(admin, items, couponCode, user?.id ?? null);
  if (pricing.error || pricing.total <= 0) {
    return NextResponse.json({ error: pricing.error ?? "Nothing to charge." }, { status: 400 });
  }

  const razorpay = new Razorpay({ key_id: keyId, key_secret: keySecret });

  const orderId = `STR-${Date.now().toString().slice(-8)}`;
  const guestToken = crypto.randomUUID();

  let razorpayOrder;
  try {
    razorpayOrder = await razorpay.orders.create({
      amount: Math.round(pricing.total * 100), // paise
      currency: "INR",
      receipt: orderId,
      notes: { internal_order_id: orderId },
    });
  } catch {
    return GENERIC_ERROR;
  }

  const { error: insertError } = await admin.from("orders").insert({
    id: orderId,
    user_id: user?.id ?? null,
    guest_email: user ? null : shipping.email,
    guest_token: guestToken,
    date: new Date().toISOString(),
    status: "processing",
    payment_status: "pending",
    razorpay_order_id: razorpayOrder.id,
    items: pricing.lines,
    subtotal: pricing.subtotal,
    discount: pricing.discount,
    shipping: pricing.shipping,
    tax: pricing.tax,
    total: pricing.total,
    coupon_code: pricing.couponCode ?? null,
    billing_name: shipping.name,
    billing_address: shipping.address,
    billing_city: shipping.city,
    billing_pincode: shipping.pincode,
    billing_phone: shipping.phone,
  });

  if (insertError) {
    return GENERIC_ERROR;
  }

  return NextResponse.json({
    orderId,
    guestToken: user ? undefined : guestToken,
    razorpayOrderId: razorpayOrder.id,
    amount: razorpayOrder.amount,
    currency: razorpayOrder.currency,
    keyId,
    total: pricing.total,
  });
}
