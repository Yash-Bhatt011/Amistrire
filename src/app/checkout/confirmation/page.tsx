"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { CheckCircle2 } from "lucide-react";
import { Navbar } from "@/components/ui/Navbar";
import { Footer } from "@/components/ui/Footer";
import { formatINR } from "@/lib/utils";

function ConfirmationDetails() {
  const params = useSearchParams();
  const orderId = params.get("order") ?? "STR-00000000";
  const total = Number(params.get("total") ?? 0);
  const token = params.get("t");
  const invoiceHref = token ? `/invoice/${orderId}?t=${token}` : `/invoice/${orderId}`;

  return (
    <>
      <main className="mx-auto flex max-w-xl flex-col items-center px-6 py-40 text-center sm:px-12">
        <motion.div
          initial={{ scale: 0.6, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        >
          <CheckCircle2 className="h-14 w-14 text-accent-cyan" />
        </motion.div>
        <h1 className="mt-6 font-display text-3xl text-studio-ink">Order Confirmed</h1>
        <p className="mt-3 text-sm text-studio-ink/60">
          Order <span className="font-mono text-studio-ink">{orderId}</span> has entered our production queue.
        </p>
        <p className="mt-1 font-mono text-lg text-studio-ink">{formatINR(total)}</p>

        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Link href={invoiceHref} className="rounded-full border border-studio-line px-5 py-2.5 text-xs uppercase tracking-wider text-studio-ink hover:border-accent-cyan hover:text-accent-cyan">
            View Invoice
          </Link>
          <Link href="/account/orders" className="rounded-full border border-studio-line px-5 py-2.5 text-xs uppercase tracking-wider text-studio-ink hover:border-accent-cyan hover:text-accent-cyan">
            View Order History
          </Link>
          <Link href="/products" className="rounded-full bg-gradient-to-r from-accent-cyan to-accent-purple px-5 py-2.5 text-xs uppercase tracking-wider text-studio-void">
            Keep Browsing
          </Link>
        </div>
      </main>
    </>
  );
}

export default function ConfirmationPage() {
  return (
    <>
      <Navbar />
      <Suspense fallback={null}>
        <ConfirmationDetails />
      </Suspense>
      <Footer />
    </>
  );
}
