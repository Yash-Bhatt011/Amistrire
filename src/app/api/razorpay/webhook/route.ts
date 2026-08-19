import { NextResponse, type NextRequest } from "next/server";
import crypto from "node:crypto";
import { createAdminClient } from "@/lib/supabase/admin";

export async function POST(request: NextRequest) {
  const rawBody = await request.text();
  const signature = request.headers.get("x-razorpay-signature");
  const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET;

  if (!webhookSecret || !signature) {
    return NextResponse.json({ error: "Not configured." }, { status: 503 });
  }

  const expectedSignature = crypto.createHmac("sha256", webhookSecret).update(rawBody).digest("hex");
  const valid =
    expectedSignature.length === signature.length &&
    crypto.timingSafeEqual(Buffer.from(expectedSignature), Buffer.from(signature));

  if (!valid) {
    // Don't leak *why* — just reject.
    return NextResponse.json({ error: "Invalid signature." }, { status: 400 });
  }

  let event: any;
  try {
    event = JSON.parse(rawBody);
  } catch {
    return NextResponse.json({ error: "Invalid payload." }, { status: 400 });
  }

  const admin = createAdminClient();
  const payload = event?.payload?.payment?.entity;
  const razorpayOrderId = payload?.order_id;
  if (!razorpayOrderId) {
    return NextResponse.json({ ok: true }); // event type we don't care about
  }

  if (event.event === "payment.captured") {
    await admin
      .from("orders")
      .update({ payment_status: "paid", razorpay_payment_id: payload.id })
      .eq("razorpay_order_id", razorpayOrderId)
      .neq("payment_status", "paid"); // idempotent — don't re-trigger side effects if already marked paid

    const { data: order } = await admin
      .from("orders")
      .select("user_id")
      .eq("razorpay_order_id", razorpayOrderId)
      .maybeSingle();
    if (order?.user_id) {
      await admin.from("profiles").update({ has_ordered_before: true }).eq("id", order.user_id);
    }
  } else if (event.event === "payment.failed") {
    await admin
      .from("orders")
      .update({ payment_status: "failed" })
      .eq("razorpay_order_id", razorpayOrderId)
      .eq("payment_status", "pending"); // don't overwrite an already-paid order on a late/duplicate failure event
  }

  return NextResponse.json({ ok: true });
}
