"use client";

import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Minus, Plus, Truck, Clock, PackageCheck, Bookmark } from "lucide-react";
import type { Product } from "@/lib/types";
import { formatINR, cn } from "@/lib/utils";
import { OptionSelector } from "./OptionSelector";
import { PersonalizationPreview3D } from "./PersonalizationPreview3D";
import { ConfettiBurst } from "@/components/ui/ConfettiBurst";
import { Magnetic } from "@/components/ui/Magnetic";
import { useCartStore } from "@/lib/store/cart-store";
import { useAuthStore } from "@/lib/store/auth-store";
import { useAccountDataStore } from "@/lib/store/account-data-store";

const INVENTORY_LABEL: Record<Product["inventory"], { text: string; className: string }> = {
  "in-stock": { text: "In Stock", className: "text-accent-cyan" },
  "low-stock": { text: "Low Stock", className: "text-orange-300" },
  "made-to-order": { text: "Made to Order", className: "text-accent-purple" },
};

export function ConfigPanel({ product }: { product: Product }) {
  const [selected, setSelected] = useState<Record<string, string>>(() => {
    const initial: Record<string, string> = {};
    for (const opt of product.options) {
      if (opt.choices?.length) initial[opt.type] = opt.choices[0].value;
    }
    return initial;
  });
  const [quantity, setQuantity] = useState(1);
  const [justAdded, setJustAdded] = useState(false);

  const addLine = useCartStore((s) => s.addLine);
  const currentUser = useAuthStore((s) => s.currentUser);
  const saveDesign = useAccountDataStore((s) => s.saveDesign);

  const unitPrice = useMemo(() => {
    let price = product.basePrice;
    for (const opt of product.options) {
      const chosenValue = selected[opt.type];
      const choice = opt.choices?.find((c) => c.value === chosenValue);
      if (choice?.priceDelta) price += choice.priceDelta;
    }
    return price;
  }, [product, selected]);

  const missingRequired = product.options.some(
    (opt) => opt.required && !selected[opt.type]
  );

  const inv = INVENTORY_LABEL[product.inventory];
  const deliveryDays = product.inventory === "made-to-order" ? "7-10 days" : "3-5 days";
  const queuePosition = 4;

  const personalizationOption = product.options.find((o) => o.type === "personalization" || o.type === "engraving");
  const personalizationText = personalizationOption ? selected[personalizationOption.type] ?? "" : "";
  const colorOption = product.options.find((o) => o.type === "color");
  const previewColor = colorOption?.choices?.find((c) => c.value === selected.color)?.swatch ?? "#2997ff";

  function handleAddToCart() {
    addLine(product.slug, unitPrice, selected, quantity);
    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 1400);
  }

  function handleSaveDesign() {
    const user = currentUser();
    if (!user) return;
    saveDesign(user.email, { productSlug: product.slug, name: `${product.name} (custom)`, selectedOptions: selected });
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      className="rounded-2xl border border-studio-line bg-white/70 p-6 shadow-xl shadow-black/5 backdrop-blur-xl"
    >
      <div className="flex items-baseline justify-between">
        <motion.span
          key={unitPrice}
          initial={{ opacity: 0, y: -6 }}
          animate={{ opacity: 1, y: 0 }}
          className="font-mono text-2xl text-studio-ink"
        >
          {formatINR(unitPrice)}
        </motion.span>
        <span className={cn("text-xs font-medium", inv.className)}>{inv.text}</span>
      </div>

      {personalizationOption && (
        <div className="mt-6">
          <p className="mb-2 text-xs uppercase tracking-wider text-studio-ink/40">Live Preview</p>
          <PersonalizationPreview3D text={personalizationText} color={previewColor} />
        </div>
      )}

      <div className="mt-6 flex flex-col gap-5">
        {product.options.map((opt) => (
          <OptionSelector
            key={opt.type}
            option={opt}
            value={selected[opt.type] ?? ""}
            onChange={(v) => setSelected((s) => ({ ...s, [opt.type]: v }))}
          />
        ))}
      </div>

      <div className="mt-6 flex items-center gap-3">
        <p className="text-xs uppercase tracking-wider text-studio-ink/40">Qty</p>
        <div className="flex items-center gap-3 rounded-full border border-studio-line px-3 py-1.5">
          <button onClick={() => setQuantity((q) => Math.max(1, q - 1))} aria-label="Decrease quantity">
            <Minus className="h-3.5 w-3.5 text-studio-ink/60" />
          </button>
          <span className="w-4 text-center text-sm text-studio-ink">{quantity}</span>
          <button onClick={() => setQuantity((q) => q + 1)} aria-label="Increase quantity">
            <Plus className="h-3.5 w-3.5 text-studio-ink/60" />
          </button>
        </div>
      </div>

      <div className="mt-6 grid grid-cols-3 gap-3 rounded-xl border border-studio-line bg-studio-void/50 p-4 text-center">
        <div>
          <Clock className="mx-auto h-4 w-4 text-studio-ink/40" />
          <p className="mt-1.5 font-mono text-xs text-studio-ink">
            {product.printTimeHrs[0]}-{product.printTimeHrs[1]}h
          </p>
          <p className="text-[10px] text-studio-ink/30">Print Time</p>
        </div>
        <div>
          <Truck className="mx-auto h-4 w-4 text-studio-ink/40" />
          <p className="mt-1.5 font-mono text-xs text-studio-ink">{deliveryDays}</p>
          <p className="text-[10px] text-studio-ink/30">Delivery</p>
        </div>
        <div>
          <PackageCheck className="mx-auto h-4 w-4 text-studio-ink/40" />
          <p className="mt-1.5 font-mono text-xs text-studio-ink">#{queuePosition}</p>
          <p className="text-[10px] text-studio-ink/30">In Queue</p>
        </div>
      </div>

      <div className="relative mt-6">
        <Magnetic strength={0.2} className="block w-full">
        <motion.button
          onClick={handleAddToCart}
          disabled={missingRequired}
          whileTap={missingRequired ? undefined : { scale: 0.96 }}
          whileHover={missingRequired ? undefined : { scale: 1.02 }}
          transition={{ type: "spring", stiffness: 400, damping: 15 }}
          className={cn(
            "w-full rounded-full py-3 text-xs font-medium uppercase tracking-wider",
            missingRequired
              ? "cursor-not-allowed bg-studio-concrete text-studio-ink/30"
              : justAdded
                ? "bg-accent-cyan text-white"
                : "bg-gradient-to-r from-accent-cyan to-accent-purple text-white"
          )}
        >
          {justAdded ? "Added to Cart ✓" : missingRequired ? "Select required options" : "Add to Cart"}
        </motion.button>
        </Magnetic>
        <ConfettiBurst active={justAdded} />
      </div>

      {currentUser() && (
        <button
          onClick={handleSaveDesign}
          className="mt-3 flex w-full items-center justify-center gap-2 text-xs text-studio-ink/40 hover:text-studio-ink"
        >
          <Bookmark className="h-3.5 w-3.5" /> Save this configuration
        </button>
      )}
    </motion.div>
  );
}
