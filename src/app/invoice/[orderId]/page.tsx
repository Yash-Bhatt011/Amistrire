import { Navbar } from "@/components/ui/Navbar";
import { Footer } from "@/components/ui/Footer";
import { InvoiceDocument } from "@/components/invoice/InvoiceDocument";
import { InvoicePrintButton } from "@/components/invoice/InvoicePrintButton";
import { createClient } from "@/lib/supabase/server";
import { PRODUCTS } from "@/lib/product-data";
import { findProduct } from "@/lib/catalog-hooks";
import type { Order, CartLine } from "@/lib/types";

export default async function InvoicePage({ params }: { params: Promise<{ orderId: string }> }) {
  const { orderId } = await params;
  const supabase = await createClient();

  const {
    data: { user: authUser },
  } = await supabase.auth.getUser();

  const { data: row } = await supabase.from("orders").select("*").eq("id", orderId).maybeSingle();

  // Access rule (matches supabase/schema.sql RLS): a logged-in customer can
  // only see their own orders; a guest order (user_id null) is viewable by
  // anyone who has the order ID, since there's no account to check against.
  const forbidden = row && row.user_id && row.user_id !== authUser?.id;

  if (!row || forbidden) {
    return (
      <>
        <Navbar />
        <div className="flex min-h-[60vh] items-center justify-center px-6 text-center">
          <p className="text-sm text-studio-ink/50">
            {row ? "Log in to view this invoice." : "We couldn't find that invoice."}
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
            findProductName={(slug) => findProduct(PRODUCTS, slug)?.name ?? slug}
          />
        </div>
      </main>

      <div className="print:hidden">
        <Footer />
      </div>
    </>
  );
}
