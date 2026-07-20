import Link from "next/link";
import { cn } from "@/lib/utils";

const WORD = "AMISTRIÉ";

export function Logo({
  size = "md",
  href = "/",
  showMonogram = true,
  theme = "light",
}: {
  size?: "sm" | "md" | "lg";
  href?: string | null;
  showMonogram?: boolean;
  theme?: "light" | "dark";
}) {
  const wordmarkSize = size === "lg" ? "text-3xl sm:text-4xl" : size === "md" ? "text-sm" : "text-xs";
  const monogramSize = size === "lg" ? "h-11 w-11 text-base" : size === "md" ? "h-8 w-8 text-xs" : "h-6 w-6 text-[10px]";
  const textColor = theme === "dark" ? "text-white" : "text-studio-ink";

  const content = (
    <span className="flex items-center gap-2.5">
      {showMonogram && (
        <span
          className={cn(
            "flex shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-accent-cyan to-accent-purple font-wordmark font-semibold text-white",
            monogramSize
          )}
        >
          AM
        </span>
      )}
      <span className={cn("font-wordmark tracking-[0.08em]", textColor, wordmarkSize)}>
        <span className="text-accent-cyan">{WORD[0]}</span>
        <span className="text-accent-purple">{WORD[1]}</span>
        {WORD.slice(2)}
      </span>
    </span>
  );

  if (!href) return content;
  return <Link href={href}>{content}</Link>;
}
