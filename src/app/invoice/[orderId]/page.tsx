import { Navbar } from "@/components/ui/Navbar";
import { Footer } from "@/components/ui/Footer";
import { InvoiceDocument } from "@/components/invoice/InvoiceDocument";
import { InvoicePrintButton } from "@/components/invoice/InvoicePrintButton";
import { createClient } from "@/lib/supabase/server";
import { PRODUCTS } from "@/lib/product-data";
import type { Order, CartLine } from "@/lib/types";

export default async function InvoicePage({
  params,
  searchParams,
}: {
  params: Promise<{ orderId: string }>;
  searchParams: Promise<{ t?: string }>;
}) {
  const { orderId } = await params;
  const { t: guestToken } = await searchParams;
  const supabase = await createClient();

  const {
    data: { user: authUser },
  } = await supabase.auth.getUser();

  // Logged-in path: normal table select, gated by RLS ("own orders" or
  // "staff read all" — see supabase/schema.sql). This alone can't return
  // another guest's order, since RLS no longer has an open "any guest
  // order" policy.
  let row: any = null;
  if (authUser) {
    const { data } = await supabase.from("orders").select("*").eq("id", orderId).maybeSingle();
    row = data;
  }

  // Guest path: requires the order id AND its token to match, via a
  // SECURITY DEFINER function — not a direct table read. See FIX 2 in
  // supabase/security-patch.sql for why this replaced the old policy.
  if (!row && guestToken) {
    const { data } = await supabase.rpc("get_guest_order", { p_order_id: orderId, p_token: guestToken });
    row = data?.[0] ?? null;
  }

  if (!row) {
    return (
      <>
        <Navbar />
        <div className="flex min-h-[60vh] items-center justify-center px-6 text-center">
          <p className="text-sm text-studio-ink/50">
            {authUser ? "We couldn't find that invoice." : "Log in to view this invoice, or use the link from your order confirmation."}
          </p>
        </div>
        <Footer />
      </>
    );
  }

  const order: Order = {
    id: row.id,
    date: row.date,
    status: row.status,
    paymentStatus: row.payment_status ?? undefined,
    items: (row.items ?? []) as CartLine[],
    subtotal: row.subtotal,
    discount: row.discount,
    shipping: row.shipping,
    tax: row.tax,
    total: row.total,
    couponCode: row.coupon_code ?? undefined,
    billingName: row.billing_name ?? undefined,
    billingAddress: row.billing_address ?? undefined,
    billingCity: row.billing_city ?? undefined,
    billingPincode: row.billing_pincode ?? undefined,
    billingPhone: row.billing_phone ?? undefined,
    courier: row.courier ?? undefined,
    trackingNumber: row.tracking_number ?? undefined,
    trackingUrl: row.tracking_url ?? undefined,
  };

  const customerEmail = authUser?.email ?? row.guest_email ?? "Guest checkout";

  return (
    <>
      <div className="print:hidden">
        <Navbar />
      </div>

      <main className="px-6 py-28 sm:px-12 sm:py-32 print:py-0">
        <div className="mx-auto mb-6 flex max-w-2xl justify-end print:hidden">
          <InvoicePrintButton />
        </div>

        <div className="mx-auto max-w-2xl rounded-2xl border border-studio-line shadow-sm shadow-black/5 print:border-0 print:shadow-none">
          <InvoiceDocument
            order={order}
            customerEmail={customerEmail}
            findProductName={(slug) => PRODUCTS.find((p) => p.slug === slug)?.name ?? slug}
          />
        </div>
      </main>

      <div className="print:hidden">
        <Footer />
      </div>
    </>
  );
}
