"use client";

import { SlidersHorizontal, LayoutGrid, List } from "lucide-react";
import { useState } from "react";
import { FilterPanel } from "./filter-panel";
import { ActiveFilterChips } from "./active-filter-chips";
import { SortSelector } from "./sort-selector";
import { ProductGrid } from "./product-grid";
import { Pagination } from "@/components/common/pagination";
import { SkeletonGrid } from "@/components/common/states";
import { ErrorState } from "@/components/common/states";
import { Drawer } from "@/components/common/modal";
import { Button } from "@/components/common/button";
import { useProductListing } from "@/hooks/use-product-listing";
import { cn } from "@/lib/utils";

export function ProductListing({
  baseCategorySlug,
  baseBrandSlug,
  initialQuery,
  hideCategoryFacet,
}: {
  baseCategorySlug?: string;
  baseBrandSlug?: string;
  initialQuery?: string;
  hideCategoryFacet?: boolean;
}) {
  const listing = useProductListing({ baseCategorySlug, baseBrandSlug, initialQuery });
  const [drawerOpen, setDrawerOpen] = useState(false);

  return (
    <div className="grid gap-8 lg:grid-cols-[260px_1fr]">
      <aside className="hidden lg:block">
        <div className="sticky top-24 rounded-2xl border border-border bg-white p-5">
          <FilterPanel filters={listing.filters} onChange={listing.setFilters} onClear={listing.clearFilters} hideCategoryFacet={hideCategoryFacet} />
        </div>
      </aside>

      <div>
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <p className="text-sm text-muted">
            {listing.isLoading ? "Loading…" : `${listing.data?.total ?? 0} products found`}
          </p>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" className="lg:hidden" onClick={() => setDrawerOpen(true)}>
              <SlidersHorizontal size={14} /> Filters
            </Button>
            <SortSelector value={listing.sort} onChange={listing.setSort} />
            <div className="hidden items-center gap-1 rounded-full border border-border p-1 sm:flex">
              <button
                aria-label="Grid view"
                onClick={() => listing.setView("grid")}
                className={cn("flex h-7 w-7 items-center justify-center rounded-full", listing.view === "grid" ? "bg-foreground text-white" : "text-muted")}
              >
                <LayoutGrid size={14} />
              </button>
              <button
                aria-label="List view"
                onClick={() => listing.setView("list")}
                className={cn("flex h-7 w-7 items-center justify-center rounded-full", listing.view === "list" ? "bg-foreground text-white" : "text-muted")}
              >
                <List size={14} />
              </button>
            </div>
          </div>
        </div>

        <ActiveFilterChips filters={listing.filters} onChange={listing.setFilters} />

        {listing.isError ? (
          <ErrorState onRetry={() => listing.refetch()} />
        ) : listing.isLoading ? (
          <SkeletonGrid count={9} />
        ) : (
          <>
            <ProductGrid
              products={listing.data?.items ?? []}
              columns={listing.view === "grid" ? "grid-cols-2 sm:grid-cols-3 xl:grid-cols-3" : "grid-cols-1"}
            />
            <Pagination page={listing.page} totalPages={listing.data?.totalPages ?? 1} onChange={listing.setPage} />
          </>
        )}
      </div>

      <Drawer open={drawerOpen} onOpenChange={setDrawerOpen} side="bottom" title="Filters" className="p-5">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-base font-bold">Filters</h2>
          <Button size="sm" onClick={() => setDrawerOpen(false)}>Show results</Button>
        </div>
        <div className="overflow-y-auto">
          <FilterPanel filters={listing.filters} onChange={listing.setFilters} onClear={listing.clearFilters} hideCategoryFacet={hideCategoryFacet} />
        </div>
      </Drawer>
    </div>
  );
}
