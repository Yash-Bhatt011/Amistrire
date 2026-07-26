"use client";

import Link from "next/link";
import { useCategories } from "@/lib/catalog-hooks";
import { Logo } from "./Logo";

const SHOP_LINKS = [
  { href: "/products", label: "All Products" },
  { href: "/categories", label: "Categories" },
  { href: "/custom-orders", label: "Custom Orders" },
  { href: "/wishlist", label: "Wishlist" },
  { href: "/cart", label: "Cart" },
];

const SUPPORT_LINKS = [
  { href: "/faq", label: "FAQ" },
  { href: "/contact", label: "Contact Us" },
  { href: "/account/orders", label: "Order History" },
  { href: "/legal/shipping", label: "Shipping Policy" },
  { href: "/legal/refund", label: "Refund Policy" },
];

const LEGAL_LINKS = [
  { href: "/legal/terms", label: "Terms & Conditions" },
  { href: "/legal/privacy", label: "Privacy Policy" },
  { href: "/legal/cookies", label: "Cookie Policy" },
];

export function Footer() {
  const categories = useCategories();
  return (
    <footer className="border-t border-studio-line bg-studio-void px-6 py-16 sm:px-12">
      <div className="mx-auto grid max-w-6xl grid-cols-2 gap-10 sm:grid-cols-3 lg:grid-cols-5">
        <div className="col-span-2 lg:col-span-1">
          <Logo size="md" />
          <p className="mt-2 max-w-[20ch] text-xs text-studio-ink/40">
            Precision 3D printing, on demand.
          </p>
          <div className="mt-4 flex gap-4 text-xs text-studio-ink/40">
            <a href="#" className="hover:text-studio-ink">Instagram</a>
            <a href="#" className="hover:text-studio-ink">Twitter</a>
          </div>
        </div>

        <div>
          <p className="mb-3 text-xs uppercase tracking-wider text-studio-ink/30">Shop</p>
          <ul className="flex flex-col gap-2 text-xs text-studio-ink/50">
            {SHOP_LINKS.map((l) => (
              <li key={l.href}>
                <Link href={l.href} className="hover:text-studio-ink">{l.label}</Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <p className="mb-3 text-xs uppercase tracking-wider text-studio-ink/30">Categories</p>
          <ul className="flex flex-col gap-2 text-xs text-studio-ink/50">
            {categories.slice(0, 5).map((c) => (
              <li key={c.slug}>
                <Link href={`/products/${c.slug}`} className="hover:text-studio-ink">{c.name}</Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <p className="mb-3 text-xs uppercase tracking-wider text-studio-ink/30">Support</p>
          <ul className="flex flex-col gap-2 text-xs text-studio-ink/50">
            {SUPPORT_LINKS.map((l) => (
              <li key={l.href}>
                <Link href={l.href} className="hover:text-studio-ink">{l.label}</Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <p className="mb-3 text-xs uppercase tracking-wider text-studio-ink/30">Legal</p>
          <ul className="flex flex-col gap-2 text-xs text-studio-ink/50">
            {LEGAL_LINKS.map((l) => (
              <li key={l.href}>
                <Link href={l.href} className="hover:text-studio-ink">{l.label}</Link>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="mx-auto mt-12 flex max-w-6xl flex-col items-start justify-between gap-4 border-t border-studio-line pt-6 sm:flex-row sm:items-center">
        <a href="mailto:hello@amistrie.print" className="text-xs text-studio-ink/40 hover:text-studio-ink">
          hello@amistrie.print
        </a>
        <div className="flex items-center gap-4">
          <p className="text-xs text-studio-ink/30">© {new Date().getFullYear()} Amistrié Print Studio</p>
        </div>
      </div>
    </footer>
  );
}
