"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";
import {
  LayoutDashboard,
  Package,
  FolderTree,
  Boxes,
  Sparkles,
  Images,
  ShoppingBag,
  Users,
  Ticket,
  LogOut,
  Menu,
  X,
} from "lucide-react";
import { useAdminAuthStore } from "@/lib/store/admin-auth-store";
import { cn } from "@/lib/utils";

const NAV = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/products", label: "Products", icon: Package },
  { href: "/admin/categories", label: "Categories", icon: FolderTree },
  { href: "/admin/showcase", label: "3D Showcase", icon: Boxes },
  { href: "/admin/hero", label: "Hero Shapes", icon: Sparkles },
  { href: "/admin/gallery", label: "Gallery", icon: Images },
  { href: "/admin/orders", label: "Orders", icon: ShoppingBag },
  { href: "/admin/customers", label: "Customers", icon: Users },
  { href: "/admin/coupons", label: "Coupons", icon: Ticket },
];

function SidebarContent({ staff, pathname, onNavigate }: { staff: { name: string; role: string }; pathname: string; onNavigate?: () => void }) {
  const router = useRouter();
  const logOut = useAdminAuthStore((s) => s.logOut);

  return (
    <>
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
              onClick={onNavigate}
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
          onClick={async () => {
            await logOut();
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
    </>
  );
}

export function AdminShell({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const staff = useAdminAuthStore((s) => s.currentStaff());
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  useEffect(() => {
    if (!staff && pathname !== "/admin/login") {
      router.replace("/account/login");
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
    <div className="flex min-h-screen flex-col bg-studio-void lg:flex-row">
      {/* Mobile top bar */}
      <div className="flex items-center justify-between border-b border-studio-line bg-white px-4 py-3 lg:hidden">
        <p className="font-wordmark text-base text-studio-ink">
          <span className="text-accent-cyan">A</span>
          <span className="text-accent-purple">M</span>ISTRIÉ <span className="text-xs font-sans text-studio-ink/40">Admin</span>
        </p>
        <button onClick={() => setMobileNavOpen(true)} aria-label="Open menu" className="text-studio-ink/60">
          <Menu className="h-5 w-5" />
        </button>
      </div>

      {/* Mobile slide-over nav */}
      {mobileNavOpen && (
        <div className="fixed inset-0 z-[80] lg:hidden">
          <div className="absolute inset-0 bg-black/50" onClick={() => setMobileNavOpen(false)} />
          <div className="absolute inset-y-0 left-0 flex w-72 flex-col bg-white px-4 py-6">
            <button onClick={() => setMobileNavOpen(false)} aria-label="Close menu" className="mb-4 self-end text-studio-ink/50">
              <X className="h-5 w-5" />
            </button>
            <SidebarContent staff={staff} pathname={pathname} onNavigate={() => setMobileNavOpen(false)} />
          </div>
        </div>
      )}

      {/* Desktop sidebar */}
      <aside className="hidden w-60 shrink-0 flex-col border-r border-studio-line bg-white px-4 py-6 lg:flex">
        <SidebarContent staff={staff} pathname={pathname} />
      </aside>

      <main className="flex-1 overflow-x-hidden overflow-y-auto bg-studio-void px-4 py-6 sm:px-8 sm:py-8">{children}</main>
    </div>
  );
}
