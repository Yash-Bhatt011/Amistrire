"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Search, Heart, ShoppingBag, User, Menu, X } from "lucide-react";
import { useCategories } from "@/lib/catalog-hooks";
import { useCartStore, cartItemCount } from "@/lib/store/cart-store";
import { useWishlistStore } from "@/lib/store/wishlist-store";
import { useIsOverDarkSection } from "@/hooks/use-is-over-dark-section";
import { SearchOverlay } from "./SearchOverlay";
import { Logo } from "./Logo";
import { Magnetic } from "./Magnetic";
import { cn } from "@/lib/utils";

const NAV_LINKS = [
  { href: "/products", label: "Products" },
  { href: "/categories", label: "Categories" },
  { href: "/custom-orders", label: "Custom Orders" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

export function Navbar() {
  const categories = useCategories();
  const [searchOpen, setSearchOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const lines = useCartStore((s) => s.lines);
  const openMiniCart = useCartStore((s) => s.openMiniCart);
  const wishlistCount = useWishlistStore((s) => s.slugs.length);
  const itemCount = cartItemCount(lines);
  const overHero = useIsOverDarkSection();

  // Apple-style adaptive nav: transparent + white text over the dark hero
  // theater, then a frosted light bar with dark text once scrolled past it.
  const iconColor = overHero ? "text-white/70 hover:text-white" : "text-studio-ink/60 hover:text-studio-ink";
  const linkColor = overHero ? "text-white/70 hover:text-white" : "text-studio-ink/50 hover:text-studio-ink";

  return (
    <>
      <motion.header
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 1 }}
        className={cn(
          "fixed inset-x-0 top-0 z-50 flex items-center justify-between px-6 py-4 transition-colors duration-500 sm:px-12",
          !overHero && "bg-white/70 shadow-sm shadow-black/5 backdrop-blur-xl"
        )}
      >
        <Logo size="md" theme={overHero ? "dark" : "light"} />

        <nav className={cn("hidden gap-8 text-xs uppercase tracking-[0.15em] transition-colors duration-500 lg:flex", linkColor)}>
          {NAV_LINKS.map((link) => (
            <Link key={link.href} href={link.href} className="transition-colors">
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-4">
          <button
            onClick={() => setSearchOpen(true)}
            aria-label="Search"
            className={cn("transition-colors duration-500", iconColor)}
          >
            <Search className="h-4 w-4" />
          </button>
          <Link href="/wishlist" aria-label="Wishlist" className={cn("relative hidden transition-colors duration-500 sm:block", iconColor)}>
            <Heart className="h-4 w-4" />
            {wishlistCount > 0 && (
              <span className="absolute -right-2 -top-2 flex h-3.5 w-3.5 items-center justify-center rounded-full bg-accent-purple text-[9px] text-white">
                {wishlistCount}
              </span>
            )}
          </Link>
          <button
            onClick={openMiniCart}
            aria-label="Cart"
            className={cn("relative transition-colors duration-500", iconColor)}
          >
            <ShoppingBag className="h-4 w-4" />
            {itemCount > 0 && (
              <span className="absolute -right-2 -top-2 flex h-3.5 w-3.5 items-center justify-center rounded-full bg-accent-cyan text-[9px] text-white">
                {itemCount}
              </span>
            )}
          </button>
          <Link
            href="/account"
            aria-label="Account"
            className={cn("hidden transition-colors duration-500 sm:block", iconColor)}
          >
            <User className="h-4 w-4" />
          </Link>
          <button
            onClick={() => setMobileOpen(true)}
            aria-label="Open menu"
            className={cn("transition-colors duration-500 lg:hidden", iconColor)}
          >
            <Menu className="h-4 w-4" />
          </button>
          <Magnetic className="hidden md:block">
            <Link
              href="/custom-orders"
              className={cn(
                "rounded-full border px-4 py-1.5 text-xs transition-colors duration-500",
                overHero ? "border-white/25 text-white hover:border-white hover:text-white" : "border-studio-line text-studio-ink hover:border-accent-cyan hover:text-accent-cyan"
              )}
            >
              Get a Quote
            </Link>
          </Magnetic>
        </div>
      </motion.header>

      {mobileOpen && (
        <div className="fixed inset-0 z-[90] flex flex-col bg-studio-void px-6 py-6 lg:hidden">
          <div className="flex items-center justify-between">
            <Logo size="md" href={null} />
            <button onClick={() => setMobileOpen(false)} aria-label="Close menu">
              <X className="h-5 w-5 text-studio-ink/60" />
            </button>
          </div>
          <nav className="mt-10 flex flex-col gap-6">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className="font-display text-2xl text-studio-ink"
              >
                {link.label}
              </Link>
            ))}
            <Link href="/account" onClick={() => setMobileOpen(false)} className="font-display text-2xl text-studio-ink">
              My Account
            </Link>
            <Link href="/wishlist" onClick={() => setMobileOpen(false)} className="font-display text-2xl text-studio-ink">
              Wishlist
            </Link>
          </nav>
          <div className="mt-10 border-t border-studio-line pt-6">
            <p className="mb-3 text-xs uppercase tracking-wider text-studio-ink/30">Categories</p>
            <div className="flex flex-wrap gap-2">
              {categories.map((c) => (
                <Link
                  key={c.slug}
                  href={`/products/${c.slug}`}
                  onClick={() => setMobileOpen(false)}
                  className="rounded-full border border-studio-line px-3 py-1.5 text-xs text-studio-ink/60"
                >
                  {c.name}
                </Link>
              ))}
            </div>
          </div>
        </div>
      )}

      <SearchOverlay open={searchOpen} onClose={() => setSearchOpen(false)} />
    </>
  );
}
