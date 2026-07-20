import { cn } from "@/lib/utils";

const LABELS: Record<string, string> = {
  bestseller: "Bestseller",
  new: "New",
  trending: "Trending",
  limited: "Limited",
};

export function Badge({ kind }: { kind: string }) {
  return (
    <span
      className={cn(
        "rounded-full border px-2.5 py-1 text-[10px] font-medium uppercase tracking-wider",
        kind === "bestseller" && "border-accent-purple/40 bg-accent-purple/10 text-accent-purple",
        kind === "new" && "border-accent-cyan/40 bg-accent-cyan/10 text-accent-cyan",
        kind === "trending" && "border-orange-400/40 bg-orange-400/10 text-orange-300",
        kind === "limited" && "border-rose-400/40 bg-rose-400/10 text-rose-300"
      )}
    >
      {LABELS[kind] ?? kind}
    </span>
  );
}
