"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";
import {
  LayoutDashboard,
  Package,
  FolderTree,
  Boxes,
  ShoppingBag,
  Users,
  Ticket,
  LogOut,
} from "lucide-react";
import { useAdminAuthStore } from "@/lib/store/admin-auth-store";
import { cn } from "@/lib/utils";

const NAV = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/products", label: "Products", icon: Package },
  { href: "/admin/categories", label: "Categories", icon: FolderTree },
  { href: "/admin/showcase", label: "3D Showcase", icon: Boxes },
  { href: "/admin/orders", label: "Orders", icon: ShoppingBag },
  { href: "/admin/customers", label: "Customers", icon: Users },
  { href: "/admin/coupons", label: "Coupons", icon: Ticket },
];

export function AdminShell({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const currentStaff = useAdminAuthStore((s) => s.currentStaff);
  const logOut = useAdminAuthStore((s) => s.logOut);
  const staff = currentStaff();

  useEffect(() => {
    if (!staff && pathname !== "/admin/login") {
      router.replace("/admin/login");
    }
  }, [staff, pathname, router]);

  if (pathname === "/admin/login") return <>{children}</>;

  if (!staff) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-studio-void">
        <p className="text-sm text-studio-ink/40">Redirecting to login...</p>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-studio-void">
      <aside className="flex w-60 shrink-0 flex-col border-r border-studio-line bg-white px-4 py-6">
        <p className="px-2 font-wordmark text-lg text-studio-ink">
          <span className="text-accent-cyan">A</span>
          <span className="text-accent-purple">M</span>ISTRIÉ
        </p>
        <p className="px-2 text-[10px] uppercase tracking-wider text-studio-ink/30">Admin Panel</p>

        <nav className="mt-8 flex flex-col gap-1">
          {NAV.map((item) => {
            const active = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-2.5 rounded-lg px-3 py-2.5 text-sm transition-colors",
                  active ? "bg-studio-concrete text-studio-ink" : "text-studio-ink/50 hover:text-studio-ink"
                )}
              >
                <item.icon className="h-4 w-4" />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="mt-auto border-t border-studio-line pt-4">
          <p className="px-2 text-xs text-studio-ink">{staff.name}</p>
          <p className="px-2 text-[11px] uppercase tracking-wider text-accent-cyan">{staff.role}</p>
          <button
            onClick={() => {
              logOut();
              router.push("/admin/login");
            }}
            className="mt-3 flex items-center gap-2 rounded-lg px-3 py-2 text-xs text-studio-ink/50 hover:text-rose-500"
          >
            <LogOut className="h-3.5 w-3.5" /> Log Out
          </button>
          <Link href="/" className="mt-1 block px-3 text-xs text-studio-ink/30 hover:text-studio-ink">
            ← Back to storefront
          </Link>
        </div>
      </aside>

      <main className="flex-1 overflow-y-auto bg-studio-void px-8 py-8">{children}</main>
    </div>
  );
}
