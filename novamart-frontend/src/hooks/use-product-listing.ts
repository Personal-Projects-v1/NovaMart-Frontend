"use client";

import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { listProducts } from "@/services/api/product.service";
import { defaultFilterState, filterStateToApi, type FilterState } from "@/components/product/filter-panel";

export function useProductListing({
  baseCategorySlug,
  baseBrandSlug,
  initialSort = "recommended",
  initialQuery,
  pageSize = 12,
}: {
  baseCategorySlug?: string;
  baseBrandSlug?: string;
  initialSort?: string;
  initialQuery?: string;
  pageSize?: number;
} = {}) {
  const [filters, setFilters] = useState<FilterState>(defaultFilterState());
  const [sort, setSort] = useState(initialSort);
  const [page, setPage] = useState(1);
  const [view, setView] = useState<"grid" | "list">("grid");

  const apiFilters = useMemo(() => {
    const base = filterStateToApi(filters);
    return {
      ...base,
      categorySlugs: baseCategorySlug ? [baseCategorySlug] : base.categorySlugs,
      brandSlugs: baseBrandSlug ? [baseBrandSlug] : base.brandSlugs,
      sort,
      page,
      pageSize,
      query: initialQuery,
    };
  }, [filters, sort, page, pageSize, baseCategorySlug, baseBrandSlug, initialQuery]);

  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ["products", apiFilters],
    queryFn: () => listProducts(apiFilters),
  });

  function updateFilters(next: FilterState) {
    setFilters(next);
    setPage(1);
  }

  function updateSort(next: string) {
    setSort(next);
    setPage(1);
  }

  return {
    filters,
    setFilters: updateFilters,
    clearFilters: () => setFilters(defaultFilterState()),
    sort,
    setSort: updateSort,
    page,
    setPage,
    view,
    setView,
    data,
    isLoading,
    isError,
    refetch,
  };
}
