"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { Navbar } from "@/components/ui/Navbar";
import { Footer } from "@/components/ui/Footer";
import { PageHeader } from "@/components/ui/PageHeader";
import { cn } from "@/lib/utils";

const FAQS = [
  { q: "How long does printing take?", a: "Most in-stock items print in 1-5 hours. Made-to-order and custom pieces can take up to 24 hours of print time, plus queue position." },
  { q: "Can I upload my own 3D model?", a: "Yes — the Custom Orders page accepts STL, OBJ, and 3MF files and gives you an instant size-based estimate." },
  { q: "What materials do you print in?", a: "PLA, PETG, TPU, Silk PLA, and Carbon Fiber PLA, depending on the product." },
  { q: "What's your return policy?", a: "Standard catalog items can be returned within 7 days if unused. Custom and personalized orders are final sale — see our Refund Policy for details." },
  { q: "Do you ship internationally?", a: "Yes, we ship worldwide. Rates and delivery estimates are calculated at checkout." },
  { q: "How do I track my order?", a: "Once logged in, your Order History page shows live production and shipping status for every order." },
];

export default function FAQPage() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <>
      <Navbar />
      <PageHeader eyebrow="Support" title="Frequently Asked Questions" />
      <main className="mx-auto max-w-2xl px-6 py-16 sm:px-12">
        <div className="flex flex-col gap-3">
          {FAQS.map((faq, i) => (
            <div key={faq.q} className="rounded-2xl border border-studio-line bg-studio-panel">
              <button
                onClick={() => setOpen(open === i ? null : i)}
                className="flex w-full items-center justify-between px-5 py-4 text-left"
              >
                <span className="text-sm text-studio-ink">{faq.q}</span>
                <ChevronDown className={cn("h-4 w-4 text-studio-ink/40 transition-transform", open === i && "rotate-180")} />
              </button>
              {open === i && <p className="px-5 pb-4 text-sm text-studio-ink/50">{faq.a}</p>}
            </div>
          ))}
        </div>
      </main>
      <Footer />
    </>
  );
}
