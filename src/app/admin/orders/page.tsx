"use client";

import { useEffect, useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { formatINR, cn } from "@/lib/utils";
import type { Order } from "@/lib/types";

type OrderRow = Order & { customerEmail: string };

const STATUS_OPTIONS: Order["status"][] = ["processing", "in-production", "shipped", "delivered"];
const PAYMENT_STATUS_OPTIONS: NonNullable<Order["paymentStatus"]>[] = ["pending", "paid", "failed", "refunded"];

function mapRow(row: any): OrderRow {
  return {
    id: row.id,
    date: row.date,
    status: row.status,
    paymentStatus: row.payment_status ?? undefined,
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
    courier: row.courier ?? undefined,
    trackingNumber: row.tracking_number ?? undefined,
    trackingUrl: row.tracking_url ?? undefined,
    customerEmail: row.profiles?.email ?? row.guest_email ?? "Guest",
  };
}

export default function AdminOrdersPage() {
  const [entries, setEntries] = useState<OrderRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({ status: "processing", paymentStatus: "pending", courier: "", trackingNumber: "", trackingUrl: "" });

  async function load() {
    const supabase = createClient();
    const { data, error } = await supabase
      .from("orders")
      .select("*, profiles(email)")
      .order("date", { ascending: false });

    if (error || !data) {
      setEntries([]);
      setLoading(false);
      return;
    }
    setEntries(data.map(mapRow));
    setLoading(false);
  }

  useEffect(() => {
    load();
  }, []);

  function startEdit(o: OrderRow) {
    setExpanded(expanded === o.id ? null : o.id);
    setForm({
      status: o.status,
      paymentStatus: o.paymentStatus ?? "pending",
      courier: o.courier ?? "",
      trackingNumber: o.trackingNumber ?? "",
      trackingUrl: o.trackingUrl ?? "",
    });
  }

  async function saveEdit(orderId: string) {
    setSaving(true);
    const supabase = createClient();
    const { error } = await supabase
      .from("orders")
      .update({
        status: form.status,
        payment_status: form.paymentStatus,
        courier: form.courier || null,
        tracking_number: form.trackingNumber || null,
        tracking_url: form.trackingUrl || null,
      })
      .eq("id", orderId);
    setSaving(false);
    if (!error) {
      setExpanded(null);
      load();
    }
  }

  return (
    <div>
      <h1 className="font-display text-2xl text-studio-ink">Orders</h1>
      <p className="mt-2 text-xs text-studio-ink/40">
        Live from Supabase — every order placed by any customer, on any device. Click a row to update
        fulfillment status or add tracking details.
      </p>

      <div className="mt-6 overflow-x-auto rounded-2xl border border-studio-line bg-white">
        <table className="w-full min-w-[720px] text-left text-sm">
          <thead>
            <tr className="border-b border-studio-line text-xs uppercase tracking-wider text-studio-ink/40">
              <th className="px-4 py-3">Order</th>
              <th className="px-4 py-3">Customer</th>
              <th className="px-4 py-3">Items</th>
              <th className="px-4 py-3">Payment</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3 text-right">Total</th>
              <th className="px-4 py-3"></th>
            </tr>
          </thead>
          <tbody>
            {loading && (
              <tr>
                <td colSpan={7} className="px-4 py-8 text-center text-xs text-studio-ink/40">
                  Loading orders...
                </td>
              </tr>
            )}
            {!loading && entries.length === 0 && (
              <tr>
                <td colSpan={7} className="px-4 py-8 text-center text-xs text-studio-ink/40">
                  No orders yet.
                </td>
              </tr>
            )}
            {entries.map((o) => (
              <>
                <tr
                  key={o.id}
                  onClick={() => startEdit(o)}
                  className="cursor-pointer border-b border-studio-line last:border-0 hover:bg-studio-concrete/40"
                >
                  <td className="px-4 py-3 font-mono text-studio-ink/70">{o.id}</td>
                  <td className="px-4 py-3 text-studio-ink/50">{o.customerEmail}</td>
                  <td className="px-4 py-3 text-studio-ink/50">{o.items.length}</td>
                  <td className="px-4 py-3">
                    <span
                      className={cn(
                        "rounded-full px-2 py-0.5 text-[10px] uppercase",
                        o.paymentStatus === "paid"
                          ? "bg-emerald-500/10 text-emerald-600"
                          : o.paymentStatus === "failed"
                            ? "bg-rose-500/10 text-rose-600"
                            : "bg-amber-500/10 text-amber-600"
                      )}
                    >
                      {o.paymentStatus ?? "pending"}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span className="rounded-full bg-accent-cyan/10 px-2 py-0.5 text-[10px] uppercase text-accent-cyan">
                      {o.status.replace("-", " ")}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right font-mono text-studio-ink">{formatINR(o.total)}</td>
                  <td className="px-4 py-3 text-studio-ink/40">
                    {expanded === o.id ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                  </td>
                </tr>
                {expanded === o.id && (
                  <tr className="border-b border-studio-line bg-studio-concrete/30">
                    <td colSpan={7} className="px-4 py-4">
                      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
                        <div>
                          <label className="mb-1 block text-[10px] uppercase tracking-wider text-studio-ink/40">Fulfillment Status</label>
                          <select
                            value={form.status}
                            onChange={(e) => setForm((f) => ({ ...f, status: e.target.value }))}
                            className="w-full rounded-lg border border-studio-line bg-white px-2 py-2 text-xs text-studio-ink focus:border-accent-cyan focus:outline-none"
                          >
                            {STATUS_OPTIONS.map((s) => (
                              <option key={s} value={s}>{s.replace("-", " ")}</option>
                            ))}
                          </select>
                        </div>
                        <div>
                          <label className="mb-1 block text-[10px] uppercase tracking-wider text-studio-ink/40">Payment Status</label>
                          <select
                            value={form.paymentStatus}
                            onChange={(e) => setForm((f) => ({ ...f, paymentStatus: e.target.value }))}
                            className="w-full rounded-lg border border-studio-line bg-white px-2 py-2 text-xs text-studio-ink focus:border-accent-cyan focus:outline-none"
                          >
                            {PAYMENT_STATUS_OPTIONS.map((s) => (
                              <option key={s} value={s}>{s}</option>
                            ))}
                          </select>
                        </div>
                        <div>
                          <label className="mb-1 block text-[10px] uppercase tracking-wider text-studio-ink/40">Courier</label>
                          <input
                            value={form.courier}
                            onChange={(e) => setForm((f) => ({ ...f, courier: e.target.value }))}
                            placeholder="e.g. Delhivery"
                            className="w-full rounded-lg border border-studio-line bg-white px-2 py-2 text-xs text-studio-ink placeholder:text-studio-ink/30 focus:border-accent-cyan focus:outline-none"
                          />
                        </div>
                        <div>
                          <label className="mb-1 block text-[10px] uppercase tracking-wider text-studio-ink/40">Tracking Number</label>
                          <input
                            value={form.trackingNumber}
                            onChange={(e) => setForm((f) => ({ ...f, trackingNumber: e.target.value }))}
                            className="w-full rounded-lg border border-studio-line bg-white px-2 py-2 text-xs text-studio-ink focus:border-accent-cyan focus:outline-none"
                          />
                        </div>
                        <div>
                          <label className="mb-1 block text-[10px] uppercase tracking-wider text-studio-ink/40">Tracking URL</label>
                          <input
                            value={form.trackingUrl}
                            onChange={(e) => setForm((f) => ({ ...f, trackingUrl: e.target.value }))}
                            placeholder="https://..."
                            className="w-full rounded-lg border border-studio-line bg-white px-2 py-2 text-xs text-studio-ink placeholder:text-studio-ink/30 focus:border-accent-cyan focus:outline-none"
                          />
                        </div>
                      </div>
                      <button
                        onClick={() => saveEdit(o.id)}
                        disabled={saving}
                        className="mt-3 rounded-full bg-gradient-to-r from-accent-cyan to-accent-purple px-4 py-2 text-xs font-medium uppercase tracking-wider text-studio-void disabled:opacity-60"
                      >
                        {saving ? "Saving..." : "Save"}
                      </button>
                    </td>
                  </tr>
                )}
              </>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
