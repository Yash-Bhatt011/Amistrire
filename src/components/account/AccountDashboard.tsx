"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useShallow } from "zustand/react/shallow";
import { User, MapPin, Package, Heart, Bookmark, Clock, Settings, LogOut, Download } from "lucide-react";
import { useAuthStore } from "@/lib/store/auth-store";
import { useAccountDataStore } from "@/lib/store/account-data-store";
import { useWishlistStore } from "@/lib/store/wishlist-store";
import { useRecentlyViewedStore } from "@/lib/store/recently-viewed-store";
import { useAllProductsIncludingArchived, findProduct } from "@/lib/catalog-hooks";
import { createClient } from "@/lib/supabase/client";
import { formatINR, cn } from "@/lib/utils";
import type { Order, CartLine } from "@/lib/types";

const TABS = [
  { key: "profile", label: "Profile", icon: User },
  { key: "addresses", label: "Addresses", icon: MapPin },
  { key: "orders", label: "Order History", icon: Package },
  { key: "wishlist", label: "Wishlist", icon: Heart },
  { key: "designs", label: "Saved Designs", icon: Bookmark },
  { key: "recent", label: "Recently Viewed", icon: Clock },
  { key: "settings", label: "Settings", icon: Settings },
] as const;

type TabKey = (typeof TABS)[number]["key"];

export function AccountDashboard({ initialTab = "profile" }: { initialTab?: TabKey }) {
  const router = useRouter();
  const [tab, setTab] = useState<TabKey>(initialTab);
  const [addrForm, setAddrForm] = useState({ label: "", line1: "", city: "", state: "", pincode: "", phone: "" });

  const currentUser = useAuthStore((s) => s.currentUser);
  const logOut = useAuthStore((s) => s.logOut);
  const user = currentUser();

  const addresses = useAccountDataStore(useShallow((s) => (user ? s.addressesByEmail[user.email] ?? [] : [])));
  const addAddress = useAccountDataStore((s) => s.addAddress);
  const removeAddress = useAccountDataStore((s) => s.removeAddress);
  const savedDesigns = useAccountDataStore(useShallow((s) => (user ? s.savedDesignsByEmail[user.email] ?? [] : [])));

  // Real order history, straight from Supabase (RLS ensures this only ever
  // returns the logged-in user's own orders).
  const [orders, setOrders] = useState<Order[]>([]);
  const [ordersLoading, setOrdersLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setOrders([]);
      setOrdersLoading(false);
      return;
    }
    let cancelled = false;
    setOrdersLoading(true);
    const supabase = createClient();
    supabase
      .from("orders")
      .select("*")
      .eq("user_id", user.id)
      .order("date", { ascending: false })
      .then(({ data }) => {
        if (cancelled) return;
        const mapped: Order[] = (data ?? []).map((row) => ({
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
        }));
        setOrders(mapped);
        setOrdersLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [user]);

  const wishlistSlugs = useWishlistStore((s) => s.slugs);
  const recentSlugs = useRecentlyViewedStore((s) => s.slugs);
  const allProducts = useAllProductsIncludingArchived();

  if (!user) {
    return (
      <div className="mx-auto max-w-md px-6 py-32 text-center">
        <p className="font-display text-2xl text-studio-ink">You're not logged in</p>
        <p className="mt-2 text-sm text-studio-ink/50">Log in to view your account, orders, and saved items.</p>
        <Link
          href="/account/login"
          className="mt-6 inline-block rounded-full bg-gradient-to-r from-accent-cyan to-accent-purple px-6 py-2.5 text-xs uppercase tracking-wider text-studio-void"
        >
          Log In
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl px-6 py-12 sm:px-12">
      <div className="grid gap-8 lg:grid-cols-[220px_1fr]">
        <aside className="flex flex-row gap-1 overflow-x-auto lg:flex-col lg:overflow-visible">
          {TABS.map((t) => (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              className={cn(
                "flex shrink-0 items-center gap-2 rounded-lg px-3 py-2.5 text-left text-xs whitespace-nowrap",
                tab === t.key ? "bg-studio-concrete text-studio-ink" : "text-studio-ink/50 hover:text-studio-ink"
              )}
            >
              <t.icon className="h-3.5 w-3.5" /> {t.label}
            </button>
          ))}
          <button
            onClick={() => {
              logOut();
              router.push("/");
            }}
            className="flex shrink-0 items-center gap-2 rounded-lg px-3 py-2.5 text-left text-xs text-rose-400/80 hover:text-rose-400"
          >
            <LogOut className="h-3.5 w-3.5" /> Log Out
          </button>
        </aside>

        <div>
          {tab === "profile" && (
            <div className="rounded-2xl border border-studio-line bg-studio-panel p-6">
              <p className="font-display text-lg text-studio-ink">{user.name}</p>
              <p className="mt-1 text-sm text-studio-ink/50">{user.email}</p>
              <p className="mt-4 text-xs text-studio-ink/30">
                Member since {new Date(user.createdAt).toLocaleDateString()}
              </p>
            </div>
          )}

          {tab === "addresses" && (
            <div className="flex flex-col gap-4">
              {addresses.map((addr) => (
                <div key={addr.id} className="flex items-start justify-between rounded-2xl border border-studio-line bg-studio-panel p-5">
                  <div>
                    <p className="text-sm text-studio-ink">{addr.label}</p>
                    <p className="mt-1 text-xs text-studio-ink/50">
                      {addr.line1}, {addr.city}, {addr.state} — {addr.pincode}
                    </p>
                    <p className="text-xs text-studio-ink/30">{addr.phone}</p>
                  </div>
                  <button onClick={() => removeAddress(user.email, addr.id)} className="text-xs text-rose-400/70 hover:text-rose-400">
                    Remove
                  </button>
                </div>
              ))}

              <div className="rounded-2xl border border-dashed border-studio-line p-5">
                <p className="mb-3 text-xs uppercase tracking-wider text-studio-ink/30">Add Address</p>
                <div className="grid gap-3 sm:grid-cols-2">
                  <input placeholder="Label (e.g. Home)" value={addrForm.label} onChange={(e) => setAddrForm((f) => ({ ...f, label: e.target.value }))} className="rounded-lg border border-studio-line bg-studio-void px-3 py-2 text-sm text-studio-ink placeholder:text-studio-ink/30 focus:border-accent-cyan focus:outline-none" />
                  <input placeholder="Phone" value={addrForm.phone} onChange={(e) => setAddrForm((f) => ({ ...f, phone: e.target.value }))} className="rounded-lg border border-studio-line bg-studio-void px-3 py-2 text-sm text-studio-ink placeholder:text-studio-ink/30 focus:border-accent-cyan focus:outline-none" />
                  <input placeholder="Address line" value={addrForm.line1} onChange={(e) => setAddrForm((f) => ({ ...f, line1: e.target.value }))} className="rounded-lg border border-studio-line bg-studio-void px-3 py-2 text-sm text-studio-ink placeholder:text-studio-ink/30 focus:border-accent-cyan focus:outline-none sm:col-span-2" />
                  <input placeholder="City" value={addrForm.city} onChange={(e) => setAddrForm((f) => ({ ...f, city: e.target.value }))} className="rounded-lg border border-studio-line bg-studio-void px-3 py-2 text-sm text-studio-ink placeholder:text-studio-ink/30 focus:border-accent-cyan focus:outline-none" />
                  <input placeholder="State" value={addrForm.state} onChange={(e) => setAddrForm((f) => ({ ...f, state: e.target.value }))} className="rounded-lg border border-studio-line bg-studio-void px-3 py-2 text-sm text-studio-ink placeholder:text-studio-ink/30 focus:border-accent-cyan focus:outline-none" />
                  <input placeholder="PIN code" value={addrForm.pincode} onChange={(e) => setAddrForm((f) => ({ ...f, pincode: e.target.value }))} className="rounded-lg border border-studio-line bg-studio-void px-3 py-2 text-sm text-studio-ink placeholder:text-studio-ink/30 focus:border-accent-cyan focus:outline-none" />
                </div>
                <button
                  onClick={() => {
                    if (!addrForm.label || !addrForm.line1) return;
                    addAddress(user.email, addrForm);
                    setAddrForm({ label: "", line1: "", city: "", state: "", pincode: "", phone: "" });
                  }}
                  className="mt-4 rounded-full border border-studio-line px-4 py-2 text-xs text-studio-ink hover:border-accent-cyan hover:text-accent-cyan"
                >
                  Save Address
                </button>
              </div>
            </div>
          )}

          {tab === "orders" && (
            <div className="flex flex-col gap-4">
              {ordersLoading && <p className="text-sm text-studio-ink/40">Loading your orders...</p>}
              {!ordersLoading && orders.length === 0 && <p className="text-sm text-studio-ink/40">No orders yet.</p>}
              {orders.map((order) => (
                <div key={order.id} className="rounded-2xl border border-studio-line bg-studio-panel p-5">
                  <div className="flex items-center justify-between">
                    <p className="font-mono text-sm text-studio-ink">{order.id}</p>
                    <span className="rounded-full border border-accent-cyan/30 px-2.5 py-1 text-[10px] uppercase tracking-wider text-accent-cyan">
                      {order.status.replace("-", " ")}
                    </span>
                  </div>
                  <p className="mt-1 text-xs text-studio-ink/40">{new Date(order.date).toLocaleDateString()} · {order.items.length} item(s)</p>
                  <div className="mt-3 flex items-center justify-between">
                    <span className="font-mono text-sm text-studio-ink">{formatINR(order.total)}</span>
                    <Link href={`/invoice/${order.id}`} className="flex items-center gap-1.5 text-xs text-studio-ink/50 hover:text-studio-ink">
                      <Download className="h-3.5 w-3.5" /> Invoice
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}

          {tab === "wishlist" && (
            <div className="flex flex-col gap-3">
              {wishlistSlugs.length === 0 && <p className="text-sm text-studio-ink/40">No saved items yet.</p>}
              {wishlistSlugs.map((slug) => {
                const p = findProduct(allProducts, slug);
                if (!p) return null;
                return (
                  <Link key={slug} href={`/products/${p.categorySlug}/${p.slug}`} className="flex items-center justify-between rounded-2xl border border-studio-line bg-studio-panel p-4 hover:border-accent-cyan/40">
                    <span className="text-sm text-studio-ink">{p.name}</span>
                    <span className="font-mono text-xs text-studio-ink/60">{formatINR(p.basePrice)}</span>
                  </Link>
                );
              })}
            </div>
          )}

          {tab === "designs" && (
            <div className="flex flex-col gap-3">
              {savedDesigns.length === 0 && <p className="text-sm text-studio-ink/40">No saved custom designs yet.</p>}
              {savedDesigns.map((d) => (
                <div key={d.id} className="rounded-2xl border border-studio-line bg-studio-panel p-4">
                  <p className="text-sm text-studio-ink">{d.name}</p>
                  <p className="mt-1 text-xs text-studio-ink/40">
                    {Object.values(d.selectedOptions).join(" · ") || "Standard configuration"}
                  </p>
                </div>
              ))}
            </div>
          )}

          {tab === "recent" && (
            <div className="flex flex-col gap-3">
              {recentSlugs.length === 0 && <p className="text-sm text-studio-ink/40">Nothing viewed yet.</p>}
              {recentSlugs.map((slug) => {
                const p = findProduct(allProducts, slug);
                if (!p) return null;
                return (
                  <Link key={slug} href={`/products/${p.categorySlug}/${p.slug}`} className="flex items-center justify-between rounded-2xl border border-studio-line bg-studio-panel p-4 hover:border-accent-cyan/40">
                    <span className="text-sm text-studio-ink">{p.name}</span>
                    <span className="font-mono text-xs text-studio-ink/60">{formatINR(p.basePrice)}</span>
                  </Link>
                );
              })}
            </div>
          )}

          {tab === "settings" && (
            <div className="rounded-2xl border border-studio-line bg-studio-panel p-6">
              <p className="text-sm text-studio-ink">Account Settings</p>
              <p className="mt-2 text-xs text-studio-ink/40">
                Password changes and notification preferences will live here once account
                management is connected to a real backend.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
