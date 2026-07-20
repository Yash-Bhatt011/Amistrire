"use client";

import { useRef } from "react";
import type { ProductOption } from "@/lib/types";
import { cn } from "@/lib/utils";
import { UploadCloud, FileCheck } from "lucide-react";

export function OptionSelector({
  option,
  value,
  onChange,
}: {
  option: ProductOption;
  value: string;
  onChange: (value: string) => void;
}) {
  const fileRef = useRef<HTMLInputElement>(null);

  // Free-text options: personalization, engraving
  if (option.type === "personalization" || option.type === "engraving") {
    return (
      <div>
        <p className="mb-2 text-xs uppercase tracking-wider text-studio-ink/40">
          {option.label} {option.required && <span className="text-accent-cyan">*</span>}
        </p>
        <input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          maxLength={40}
          placeholder="Type here..."
          className="w-full rounded-lg border border-studio-line bg-studio-void/60 px-3 py-2.5 text-sm text-studio-ink placeholder:text-studio-ink/30 focus:border-accent-cyan focus:outline-none"
        />
      </div>
    );
  }

  // File upload options: textUpload, imageUpload
  if (option.type === "textUpload" || option.type === "imageUpload") {
    return (
      <div>
        <p className="mb-2 text-xs uppercase tracking-wider text-studio-ink/40">
          {option.label} {option.required && <span className="text-accent-cyan">*</span>}
        </p>
        <button
          onClick={() => fileRef.current?.click()}
          className={cn(
            "flex w-full items-center justify-center gap-2 rounded-lg border border-dashed px-3 py-3 text-xs transition-colors",
            value ? "border-accent-cyan/40 text-accent-cyan" : "border-studio-line text-studio-ink/40 hover:border-studio-ink/30"
          )}
        >
          {value ? <FileCheck className="h-3.5 w-3.5" /> : <UploadCloud className="h-3.5 w-3.5" />}
          {value || `Upload ${option.type === "imageUpload" ? "image" : "file"}`}
        </button>
        <input
          ref={fileRef}
          type="file"
          accept={option.type === "imageUpload" ? "image/*" : ".txt,.pdf"}
          className="sr-only"
          onChange={(e) => onChange(e.target.files?.[0]?.name ?? "")}
        />
      </div>
    );
  }

  // Choice-based options: color, material, texture, finish, size, layerHeight, infill, orientation
  if (!option.choices) return null;

  if (option.type === "color") {
    return (
      <div>
        <p className="mb-2 text-xs uppercase tracking-wider text-studio-ink/40">
          {option.label} {option.required && <span className="text-accent-cyan">*</span>}
        </p>
        <div className="flex flex-wrap gap-2.5">
          {option.choices.map((choice) => (
            <button
              key={choice.value}
              onClick={() => onChange(choice.value)}
              title={choice.label}
              className={cn(
                "h-8 w-8 rounded-full border-2 transition-transform hover:scale-110",
                value === choice.value ? "border-white" : "border-white/20"
              )}
              style={{ backgroundColor: choice.swatch }}
            />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div>
      <p className="mb-2 text-xs uppercase tracking-wider text-studio-ink/40">
        {option.label} {option.required && <span className="text-accent-cyan">*</span>}
      </p>
      <div className="flex flex-wrap gap-2">
        {option.choices.map((choice) => (
          <button
            key={choice.value}
            onClick={() => onChange(choice.value)}
            className={cn(
              "rounded-full border px-3 py-1.5 text-xs transition-colors",
              value === choice.value
                ? "border-accent-cyan bg-accent-cyan/10 text-accent-cyan"
                : "border-studio-line text-studio-ink/60 hover:border-studio-ink/30"
            )}
          >
            {choice.label}
            {choice.priceDelta ? ` (+₹${choice.priceDelta})` : ""}
          </button>
        ))}
      </div>
    </div>
  );
}
