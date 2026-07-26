"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";

type CustomerRow = {
  name: string;
  email: string;
  createdAt: string;
  orderCount: number;
};

export default function AdminCustomersPage() {
  const [customers, setCustomers] = useState<CustomerRow[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const supabase = createClient();
    let cancelled = false;

    async function load() {
      const [{ data: profiles }, { data: orders }] = await Promise.all([
        supabase
          .from("profiles")
          .select("id, name, email, created_at")
          .eq("role", "customer")
          .order("created_at", { ascending: false }),
        supabase.from("orders").select("user_id").not("user_id", "is", null),
      ]);

      if (cancelled) return;

      const orderCountByUser = new Map<string, number>();
      for (const o of orders ?? []) {
        if (!o.user_id) continue;
        orderCountByUser.set(o.user_id, (orderCountByUser.get(o.user_id) ?? 0) + 1);
      }

      setCustomers(
        (profiles ?? []).map((p) => ({
          name: p.name ?? p.email,
          email: p.email,
          createdAt: p.created_at,
          orderCount: orderCountByUser.get(p.id) ?? 0,
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
      <h1 className="font-display text-2xl text-studio-ink">Customers</h1>
      <p className="mt-2 text-xs text-studio-ink/40">
        Live from Supabase — every customer account, on any device.
      </p>

      <div className="mt-6 overflow-x-auto rounded-2xl border border-studio-line bg-white">
        <table className="w-full min-w-[640px] text-left text-sm">
          <thead>
            <tr className="border-b border-studio-line text-xs uppercase tracking-wider text-studio-ink/40">
              <th className="px-4 py-3">Name</th>
              <th className="px-4 py-3">Email</th>
              <th className="px-4 py-3">Joined</th>
              <th className="px-4 py-3 text-right">Orders</th>
            </tr>
          </thead>
          <tbody>
            {loading && (
              <tr>
                <td colSpan={4} className="px-4 py-8 text-center text-xs text-studio-ink/40">
                  Loading customers...
                </td>
              </tr>
            )}
            {!loading && customers.length === 0 && (
              <tr>
                <td colSpan={4} className="px-4 py-8 text-center text-xs text-studio-ink/40">
                  No customer accounts yet.
                </td>
              </tr>
            )}
            {customers.map((a) => (
              <tr key={a.email} className="border-b border-studio-line last:border-0">
                <td className="px-4 py-3 text-studio-ink">{a.name}</td>
                <td className="px-4 py-3 text-studio-ink/50">{a.email}</td>
                <td className="px-4 py-3 text-studio-ink/50">{new Date(a.createdAt).toLocaleDateString()}</td>
                <td className="px-4 py-3 text-right text-studio-ink/50">{a.orderCount}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
