"use client";

import { X } from "lucide-react";
import { categories } from "@/mocks/categories";
import { brands } from "@/mocks/brands";
import { PRICE_RANGE } from "@/constants/filters";
import { formatPrice } from "@/lib/utils";
import type { FilterState } from "./filter-panel";

export function ActiveFilterChips({ filters, onChange }: { filters: FilterState; onChange: (f: FilterState) => void }) {
  const chips: { key: string; label: string; onRemove: () => void }[] = [];

  filters.categorySlugs.forEach((slug) => {
    const cat = categories.find((c) => c.slug === slug);
    if (cat) chips.push({ key: `cat-${slug}`, label: cat.name, onRemove: () => onChange({ ...filters, categorySlugs: filters.categorySlugs.filter((s) => s !== slug) }) });
  });
  filters.brandSlugs.forEach((slug) => {
    const brand = brands.find((b) => b.slug === slug);
    if (brand) chips.push({ key: `brand-${slug}`, label: brand.name, onRemove: () => onChange({ ...filters, brandSlugs: filters.brandSlugs.filter((s) => s !== slug) }) });
  });
  if (filters.priceRange[0] > PRICE_RANGE.min || filters.priceRange[1] < PRICE_RANGE.max) {
    chips.push({
      key: "price",
      label: `${formatPrice(filters.priceRange[0])} - ${formatPrice(filters.priceRange[1])}`,
      onRemove: () => onChange({ ...filters, priceRange: [PRICE_RANGE.min, PRICE_RANGE.max] }),
    });
  }
  if (filters.minRating) {
    chips.push({ key: "rating", label: `${filters.minRating}+ stars`, onRemove: () => onChange({ ...filters, minRating: undefined }) });
  }
  if (filters.inStockOnly) chips.push({ key: "stock", label: "In stock", onRemove: () => onChange({ ...filters, inStockOnly: false }) });
  if (filters.onSaleOnly) chips.push({ key: "sale", label: "On sale", onRemove: () => onChange({ ...filters, onSaleOnly: false }) });

  if (chips.length === 0) return null;

  return (
    <div className="mb-4 flex flex-wrap gap-2">
      {chips.map((chip) => (
        <button
          key={chip.key}
          onClick={chip.onRemove}
          className="flex items-center gap-1.5 rounded-full bg-brand-soft px-3 py-1.5 text-xs font-medium text-brand hover:bg-brand hover:text-white"
        >
          {chip.label} <X size={12} />
        </button>
      ))}
    </div>
  );
}
