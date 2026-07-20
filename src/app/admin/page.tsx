"use client";

import { Package, FolderTree, ShoppingBag, Users, IndianRupee } from "lucide-react";
import { useAllProductsIncludingArchived, useAllCategoriesIncludingArchived } from "@/lib/catalog-hooks";
import { useAccountDataStore } from "@/lib/store/account-data-store";
import { useAuthStore } from "@/lib/store/auth-store";
import { formatINR } from "@/lib/utils";

export default function AdminDashboardPage() {
  const products = useAllProductsIncludingArchived();
  const categories = useAllCategoriesIncludingArchived();
  const ordersByEmail = useAccountDataStore((s) => s.ordersByEmail ?? {});
  const accounts = useAuthStore((s) => s.accounts ?? []);

  const allOrders = Object.values(ordersByEmail).flat();
  const revenue = allOrders.reduce((sum, o) => sum + o.total, 0);

  const cards = [
    { label: "Products", value: products.length, icon: Package },
    { label: "Categories", value: categories.length, icon: FolderTree },
    { label: "Orders (this device)", value: allOrders.length, icon: ShoppingBag },
    { label: "Customer Accounts (this device)", value: accounts.length, icon: Users },
  ];

  return (
    <div>
      <h1 className="font-display text-2xl text-studio-ink">Dashboard</h1>
      <p className="mt-1 text-sm text-studio-ink/50">
        An overview of your store. Order and customer figures only reflect activity on this browser —
        see the note on the Orders page for why.
      </p>

      <div className="mt-8 grid grid-cols-2 gap-4 lg:grid-cols-4">
        {cards.map((c) => (
          <div key={c.label} className="rounded-2xl border border-studio-line bg-white p-5">
            <c.icon className="h-4 w-4 text-accent-cyan" />
            <p className="mt-3 font-mono text-2xl text-studio-ink">{c.value}</p>
            <p className="mt-1 text-xs text-studio-ink/40">{c.label}</p>
          </div>
        ))}
        <div className="rounded-2xl border border-studio-line bg-white p-5">
          <IndianRupee className="h-4 w-4 text-accent-purple" />
          <p className="mt-3 font-mono text-2xl text-studio-ink">{formatINR(revenue)}</p>
          <p className="mt-1 text-xs text-studio-ink/40">Revenue (this device)</p>
        </div>
      </div>

      <div className="mt-8 rounded-2xl border border-studio-line bg-white p-5">
        <p className="text-sm text-studio-ink">Recent Orders</p>
        <div className="mt-3 flex flex-col gap-2">
          {allOrders.slice(0, 5).length === 0 && <p className="text-xs text-studio-ink/40">No orders yet.</p>}
          {allOrders.slice(0, 5).map((o) => (
            <div key={o.id} className="flex items-center justify-between border-t border-studio-line pt-2 text-xs">
              <span className="font-mono text-studio-ink/70">{o.id}</span>
              <span className="text-studio-ink/40">{o.items.length} item(s)</span>
              <span className="font-mono text-studio-ink">{formatINR(o.total)}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
