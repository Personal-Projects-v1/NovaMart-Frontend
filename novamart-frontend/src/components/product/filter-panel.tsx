"use client";

import * as Checkbox from "@radix-ui/react-checkbox";
import * as Slider from "@radix-ui/react-slider";
import { Check } from "lucide-react";
import { useBrands, useCategories } from "@/hooks/use-catalog";
import { PRICE_RANGE, RATING_FILTERS } from "@/constants/filters";
import { Rating } from "@/components/common/rating";
import { Button } from "@/components/common/button";
import { formatPrice } from "@/lib/utils";
import type { ProductFilters } from "@/types";

export interface FilterState {
  categorySlugs: string[];
  brandSlugs: string[];
  priceRange: [number, number];
  minRating?: number;
  inStockOnly: boolean;
  onSaleOnly: boolean;
}

export function defaultFilterState(): FilterState {
  return {
    categorySlugs: [],
    brandSlugs: [],
    priceRange: [PRICE_RANGE.min, PRICE_RANGE.max],
    minRating: undefined,
    inStockOnly: false,
    onSaleOnly: false,
  };
}

export function filterStateToApi(state: FilterState): ProductFilters {
  return {
    categorySlugs: state.categorySlugs.length ? state.categorySlugs : undefined,
    brandSlugs: state.brandSlugs.length ? state.brandSlugs : undefined,
    minPrice: state.priceRange[0] > PRICE_RANGE.min ? state.priceRange[0] : undefined,
    maxPrice: state.priceRange[1] < PRICE_RANGE.max ? state.priceRange[1] : undefined,
    minRating: state.minRating,
    inStockOnly: state.inStockOnly || undefined,
    onSaleOnly: state.onSaleOnly || undefined,
  };
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="border-b border-border py-4 first:pt-0 last:border-0">
      <h3 className="mb-3 text-sm font-bold">{title}</h3>
      {children}
    </div>
  );
}

function CheckRow({ checked, onChange, label, count }: { checked: boolean; onChange: (checked: boolean) => void; label: string; count?: number }) {
  return (
    <label className="flex cursor-pointer items-center justify-between gap-2 py-1.5 text-sm">
      <span className="flex items-center gap-2">
        <Checkbox.Root
          checked={checked}
          onCheckedChange={(c) => onChange(!!c)}
          className="flex h-4 w-4 items-center justify-center rounded border border-border bg-white data-[state=checked]:border-brand data-[state=checked]:bg-brand"
        >
          <Checkbox.Indicator><Check size={12} className="text-white" /></Checkbox.Indicator>
        </Checkbox.Root>
        {label}
      </span>
      {count !== undefined && <span className="text-xs text-muted">{count}</span>}
    </label>
  );
}

export function FilterPanel({
  filters,
  onChange,
  onClear,
  hideCategoryFacet,
}: {
  filters: FilterState;
  onChange: (filters: FilterState) => void;
  onClear: () => void;
  hideCategoryFacet?: boolean;
}) {
  const { categories } = useCategories();
  const { brands } = useBrands();

  function toggleArray(key: "categorySlugs" | "brandSlugs", value: string) {
    const current = filters[key];
    const next = current.includes(value) ? current.filter((v) => v !== value) : [...current, value];
    onChange({ ...filters, [key]: next });
  }

  return (
    <div>
      <div className="mb-2 flex items-center justify-between">
        <h2 className="text-base font-bold">Filters</h2>
        <Button variant="link" size="sm" onClick={onClear} className="h-auto px-0">Clear all</Button>
      </div>

      {!hideCategoryFacet && (
        <Section title="Category">
          {categories.map((c) => (
            <CheckRow
              key={c.slug}
              checked={filters.categorySlugs.includes(c.slug)}
              onChange={() => toggleArray("categorySlugs", c.slug)}
              label={c.name}
              count={c.productCount}
            />
          ))}
        </Section>
      )}

      <Section title="Brand">
        {brands.map((b) => (
          <CheckRow
            key={b.slug}
            checked={filters.brandSlugs.includes(b.slug)}
            onChange={() => toggleArray("brandSlugs", b.slug)}
            label={b.name}
            count={b.productCount}
          />
        ))}
      </Section>

      <Section title="Price Range">
        <Slider.Root
          className="relative flex h-4 w-full touch-none items-center"
          min={PRICE_RANGE.min}
          max={PRICE_RANGE.max}
          step={10}
          value={filters.priceRange}
          onValueChange={(value) => onChange({ ...filters, priceRange: value as [number, number] })}
        >
          <Slider.Track className="relative h-1.5 w-full grow rounded-full bg-surface-strong">
            <Slider.Range className="absolute h-full rounded-full bg-brand" />
          </Slider.Track>
          <Slider.Thumb className="block h-4 w-4 rounded-full border-2 border-brand bg-white shadow" aria-label="Minimum price" />
          <Slider.Thumb className="block h-4 w-4 rounded-full border-2 border-brand bg-white shadow" aria-label="Maximum price" />
        </Slider.Root>
        <div className="mt-2 flex justify-between text-xs font-medium text-muted">
          <span>{formatPrice(filters.priceRange[0])}</span>
          <span>{formatPrice(filters.priceRange[1])}</span>
        </div>
      </Section>

      <Section title="Rating">
        {RATING_FILTERS.map((r) => (
          <button
            key={r}
            onClick={() => onChange({ ...filters, minRating: filters.minRating === r ? undefined : r })}
            className="flex w-full items-center gap-2 rounded-lg px-1 py-1.5 hover:bg-surface"
          >
            <Rating value={r} showCount={false} size={13} />
            <span className="text-xs text-muted">& up</span>
            {filters.minRating === r && <Check size={14} className="ml-auto text-brand" />}
          </button>
        ))}
      </Section>

      <Section title="Availability">
        <CheckRow checked={filters.inStockOnly} onChange={(c) => onChange({ ...filters, inStockOnly: c })} label="In stock only" />
        <CheckRow checked={filters.onSaleOnly} onChange={(c) => onChange({ ...filters, onSaleOnly: c })} label="On sale" />
      </Section>
    </div>
  );
}
