"use client";

import { Printer } from "lucide-react";

export function InvoicePrintButton() {
  return (
    <button
      onClick={() => window.print()}
      className="flex items-center gap-2 rounded-full bg-gradient-to-r from-accent-cyan to-accent-purple px-5 py-2.5 text-xs font-medium uppercase tracking-wider text-white hover:scale-[1.02]"
    >
      <Printer className="h-3.5 w-3.5" /> Print / Save as PDF
    </button>
  );
}
