"use client";

import { useAccountDataStore } from "@/lib/store/account-data-store";
import { formatINR } from "@/lib/utils";

export default function AdminOrdersPage() {
  const ordersByEmail = useAccountDataStore((s) => s.ordersByEmail ?? {});
  const entries = Object.entries(ordersByEmail).flatMap(([email, orders]) =>
    orders.map((o) => ({ email, ...o }))
  );

  return (
    <div>
      <h1 className="font-display text-2xl text-studio-ink">Orders</h1>
      <div className="mt-3 max-w-2xl rounded-xl border border-accent-purple/30 bg-accent-purple/5 p-4 text-xs text-studio-ink/60">
        There's no shared database yet, so this only shows orders placed by customer accounts that
        signed up in <em>this same browser</em>. A real store needs a backend (e.g. Supabase) so
        every visitor's orders land in one place — this view is ready to point at that once it exists.
      </div>

      <div className="mt-6 overflow-hidden rounded-2xl border border-studio-line bg-white">
        <table className="w-full text-left text-sm">
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
            {entries.length === 0 && (
              <tr>
                <td colSpan={5} className="px-4 py-8 text-center text-xs text-studio-ink/40">
                  No orders yet on this device.
                </td>
              </tr>
            )}
            {entries.map((o) => (
              <tr key={o.id} className="border-b border-studio-line last:border-0">
                <td className="px-4 py-3 font-mono text-studio-ink/70">{o.id}</td>
                <td className="px-4 py-3 text-studio-ink/50">{o.email}</td>
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
