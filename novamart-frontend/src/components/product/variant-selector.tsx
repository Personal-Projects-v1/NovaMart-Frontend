"use client";

import { cn } from "@/lib/utils";
import type { ProductVariantGroup } from "@/types";

export function VariantSelector({
  group,
  selected,
  onSelect,
}: {
  group: ProductVariantGroup;
  selected?: string;
  onSelect: (value: string) => void;
}) {
  const isColor = group.name === "Color";
  return (
    <div>
      <div className="mb-2 flex items-baseline justify-between">
        <span className="text-sm font-semibold text-foreground">{group.name}</span>
        {selected && <span className="text-xs text-muted">{selected}</span>}
      </div>
      <div className="flex flex-wrap gap-2">
        {group.options.map((option) => {
          const isSelected = selected === option.value;
          if (isColor) {
            return (
              <button
                key={option.id}
                type="button"
                disabled={!option.inStock}
                aria-label={option.label}
                aria-pressed={isSelected}
                onClick={() => onSelect(option.value)}
                className={cn(
                  "relative h-9 w-9 rounded-full border-2 transition disabled:cursor-not-allowed disabled:opacity-30",
                  isSelected ? "border-brand" : "border-border"
                )}
                style={{ backgroundColor: option.swatch }}
                title={option.label}
              >
                {!option.inStock && <span className="absolute inset-0 rounded-full bg-white/60" />}
              </button>
            );
          }
          return (
            <button
              key={option.id}
              type="button"
              disabled={!option.inStock}
              aria-pressed={isSelected}
              onClick={() => onSelect(option.value)}
              className={cn(
                "rounded-full border px-3.5 py-1.5 text-sm font-medium transition disabled:cursor-not-allowed disabled:opacity-30 disabled:line-through",
                isSelected ? "border-brand bg-brand-soft text-brand" : "border-border text-foreground hover:border-foreground"
              )}
            >
              {option.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
