import { NextResponse, type NextRequest } from "next/server";
import crypto from "node:crypto";
import { z } from "zod";
import { createAdminClient } from "@/lib/supabase/admin";

const verifySchema = z.object({
  orderId: z.string().min(1).max(50),
  razorpay_order_id: z.string().min(1),
  razorpay_payment_id: z.string().min(1),
  razorpay_signature: z.string().min(1),
});

export async function POST(request: NextRequest) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  const parsed = verifySchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }
  const { orderId, razorpay_order_id, razorpay_payment_id, razorpay_signature } = parsed.data;

  const keySecret = process.env.RAZORPAY_KEY_SECRET;
  if (!keySecret) {
    return NextResponse.json({ error: "Payments are not configured yet." }, { status: 503 });
  }

  const expectedSignature = crypto
    .createHmac("sha256", keySecret)
    .update(`${razorpay_order_id}|${razorpay_payment_id}`)
    .digest("hex");

  const valid =
    expectedSignature.length === razorpay_signature.length &&
    crypto.timingSafeEqual(Buffer.from(expectedSignature), Buffer.from(razorpay_signature));

  if (!valid) {
    return NextResponse.json({ error: "Payment could not be verified." }, { status: 400 });
  }

  const admin = createAdminClient();

  const { data: order } = await admin.from("orders").select("id, user_id, razorpay_order_id").eq("id", orderId).maybeSingle();
  if (!order || order.razorpay_order_id !== razorpay_order_id) {
    return NextResponse.json({ error: "Order not found." }, { status: 404 });
  }

  await admin
    .from("orders")
    .update({ payment_status: "paid", razorpay_payment_id })
    .eq("id", orderId);

  if (order.user_id) {
    await admin.from("profiles").update({ has_ordered_before: true }).eq("id", order.user_id);
  }

  return NextResponse.json({ ok: true });
}
