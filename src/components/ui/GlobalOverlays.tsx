"use client";

import { MiniCart } from "./MiniCart";
import { QuickViewModal } from "@/components/product/QuickViewModal";
import { useQuickViewStore } from "@/lib/store/quick-view-store";

export function GlobalOverlays() {
  const product = useQuickViewStore((s) => s.product);
  const close = useQuickViewStore((s) => s.close);

  return (
    <>
      <MiniCart />
      <QuickViewModal product={product} onClose={close} />
    </>
  );
}
