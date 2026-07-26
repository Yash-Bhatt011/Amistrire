"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { formatINR } from "@/lib/utils";
import type { Order } from "@/lib/types";

type OrderRow = Order & { customerEmail: string };

export default function AdminOrdersPage() {
  const [entries, setEntries] = useState<OrderRow[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const supabase = createClient();
    let cancelled = false;

    async function load() {
      const { data, error } = await supabase
        .from("orders")
        .select("*, profiles(email)")
        .order("date", { ascending: false });

      if (cancelled) return;
      if (error || !data) {
        setEntries([]);
        setLoading(false);
        return;
      }

      setEntries(
        data.map((row: any) => ({
          id: row.id,
          date: row.date,
          status: row.status,
          items: row.items ?? [],
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
          customerEmail: row.profiles?.email ?? row.guest_email ?? "Guest",
        }))
      );
      setLoading(false);
    }

    load();
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div>
      <h1 className="font-display text-2xl text-studio-ink">Orders</h1>
      <p className="mt-2 text-xs text-studio-ink/40">
        Live from Supabase — every order placed by any customer, on any device.
      </p>

      <div className="mt-6 overflow-x-auto rounded-2xl border border-studio-line bg-white">
        <table className="w-full min-w-[640px] text-left text-sm">
          <thead>
            <tr className="border-b border-studio-line text-xs uppercase tracking-wider text-studio-ink/40">
              <th className="px-4 py-3">Order</th>
              <th className="px-4 py-3">Customer</th>
              <th className="px-4 py-3">Items</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3 text-right">Total</th>
            </tr>
          </thead>
          <tbody>
            {loading && (
              <tr>
                <td colSpan={5} className="px-4 py-8 text-center text-xs text-studio-ink/40">
                  Loading orders...
                </td>
              </tr>
            )}
            {!loading && entries.length === 0 && (
              <tr>
                <td colSpan={5} className="px-4 py-8 text-center text-xs text-studio-ink/40">
                  No orders yet.
                </td>
              </tr>
            )}
            {entries.map((o) => (
              <tr key={o.id} className="border-b border-studio-line last:border-0">
                <td className="px-4 py-3 font-mono text-studio-ink/70">{o.id}</td>
                <td className="px-4 py-3 text-studio-ink/50">{o.customerEmail}</td>
                <td className="px-4 py-3 text-studio-ink/50">{o.items.length}</td>
                <td className="px-4 py-3">
                  <span className="rounded-full bg-accent-cyan/10 px-2 py-0.5 text-[10px] uppercase text-accent-cyan">
                    {o.status.replace("-", " ")}
                  </span>
                </td>
                <td className="px-4 py-3 text-right font-mono text-studio-ink">{formatINR(o.total)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
