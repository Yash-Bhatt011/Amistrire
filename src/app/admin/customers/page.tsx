"use client";

import { useAuthStore } from "@/lib/store/auth-store";
import { useAccountDataStore } from "@/lib/store/account-data-store";

export default function AdminCustomersPage() {
  const accounts = useAuthStore((s) => s.accounts ?? []);
  const ordersByEmail = useAccountDataStore((s) => s.ordersByEmail ?? {});

  return (
    <div>
      <h1 className="font-display text-2xl text-studio-ink">Customers</h1>
      <div className="mt-3 max-w-2xl rounded-xl border border-accent-purple/30 bg-accent-purple/5 p-4 text-xs text-studio-ink/60">
        Same limitation as Orders — this lists accounts created in this browser only, not every
        visitor to your live site.
      </div>

      <div className="mt-6 overflow-hidden rounded-2xl border border-studio-line bg-white">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-studio-line text-xs uppercase tracking-wider text-studio-ink/40">
              <th className="px-4 py-3">Name</th>
              <th className="px-4 py-3">Email</th>
              <th className="px-4 py-3">Joined</th>
              <th className="px-4 py-3 text-right">Orders</th>
            </tr>
          </thead>
          <tbody>
            {accounts.length === 0 && (
              <tr>
                <td colSpan={4} className="px-4 py-8 text-center text-xs text-studio-ink/40">
                  No customer accounts yet on this device.
                </td>
              </tr>
            )}
            {accounts.map((a) => (
              <tr key={a.email} className="border-b border-studio-line last:border-0">
                <td className="px-4 py-3 text-studio-ink">{a.name}</td>
                <td className="px-4 py-3 text-studio-ink/50">{a.email}</td>
                <td className="px-4 py-3 text-studio-ink/50">{new Date(a.createdAt).toLocaleDateString()}</td>
                <td className="px-4 py-3 text-right text-studio-ink/50">{(ordersByEmail[a.email] ?? []).length}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
