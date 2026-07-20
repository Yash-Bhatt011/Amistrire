"use client";

import { useState } from "react";
import { Plus, Trash2 } from "lucide-react";
import { useCouponStore } from "@/lib/store/coupon-store";
import type { CouponType } from "@/lib/types";

const TYPES: CouponType[] = ["percentage", "fixed", "free-shipping", "bxgy"];

export default function AdminCouponsPage() {
  const coupons = useCouponStore((s) => s.coupons ?? []);
  const addCoupon = useCouponStore((s) => s.addCoupon);
  const deleteCoupon = useCouponStore((s) => s.deleteCoupon);

  const [code, setCode] = useState("");
  const [type, setType] = useState<CouponType>("percentage");
  const [value, setValue] = useState(10);
  const [description, setDescription] = useState("");

  function handleAdd(e: React.FormEvent) {
    e.preventDefault();
    if (!code.trim()) return;
    addCoupon({ code: code.toUpperCase(), type, value, description, stackable: false });
    setCode("");
    setDescription("");
  }

  return (
    <div>
      <h1 className="font-display text-2xl text-studio-ink">Coupons &amp; Discounts</h1>
      <p className="mt-1 text-sm text-studio-ink/50">{coupons.length} active codes</p>

      <form onSubmit={handleAdd} className="mt-6 flex max-w-3xl flex-wrap items-end gap-3">
        <div>
          <label className="mb-1.5 block text-xs uppercase tracking-wider text-studio-ink/40">Code</label>
          <input
            value={code}
            onChange={(e) => setCode(e.target.value.toUpperCase())}
            className="w-32 rounded-lg border border-studio-line bg-white px-3 py-2.5 text-sm text-studio-ink focus:border-accent-cyan focus:outline-none"
          />
        </div>
        <div>
          <label className="mb-1.5 block text-xs uppercase tracking-wider text-studio-ink/40">Type</label>
          <select
            value={type}
            onChange={(e) => setType(e.target.value as CouponType)}
            className="rounded-lg border border-studio-line bg-white px-3 py-2.5 text-sm text-studio-ink focus:border-accent-cyan focus:outline-none"
          >
            {TYPES.map((t) => (
              <option key={t} value={t}>{t}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="mb-1.5 block text-xs uppercase tracking-wider text-studio-ink/40">Value</label>
          <input
            type="number"
            value={value}
            onChange={(e) => setValue(Number(e.target.value))}
            className="w-24 rounded-lg border border-studio-line bg-white px-3 py-2.5 text-sm text-studio-ink focus:border-accent-cyan focus:outline-none"
          />
        </div>
        <div className="flex-1">
          <label className="mb-1.5 block text-xs uppercase tracking-wider text-studio-ink/40">Description</label>
          <input
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full rounded-lg border border-studio-line bg-white px-3 py-2.5 text-sm text-studio-ink focus:border-accent-cyan focus:outline-none"
          />
        </div>
        <button
          type="submit"
          className="flex items-center gap-1.5 rounded-full bg-gradient-to-r from-accent-cyan to-accent-purple px-4 py-2.5 text-xs font-medium uppercase tracking-wider text-white"
        >
          <Plus className="h-3.5 w-3.5" /> Add
        </button>
      </form>

      <div className="mt-6 flex flex-col gap-2">
        {coupons.map((c) => (
          <div key={c.code} className="flex items-center justify-between rounded-xl border border-studio-line bg-white px-4 py-3">
            <div>
              <p className="font-mono text-sm text-studio-ink">{c.code}</p>
              <p className="text-xs text-studio-ink/40">{c.description}</p>
            </div>
            <div className="flex items-center gap-3">
              <span className="rounded-full bg-studio-concrete px-2.5 py-1 text-[10px] uppercase text-studio-ink/50">
                {c.type} {c.type !== "free-shipping" ? `· ${c.value}` : ""}
              </span>
              <button onClick={() => deleteCoupon(c.code)} className="text-studio-ink/40 hover:text-rose-500">
                <Trash2 className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
