"use client";

import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { listBrands, listCategories, listCollections } from "@/services/api/category.service";
import { getProductsByIds } from "@/services/api/product.service";
import type { Brand, Category, ProductWithRelations } from "@/types";

/** Categories/brands change rarely, so they're cached for 10 minutes across the whole app. */
const REFERENCE_STALE_MS = 10 * 60 * 1000;
const EMPTY: never[] = [];

export function useCategories() {
  const query = useQuery({ queryKey: ["categories"], queryFn: listCategories, staleTime: REFERENCE_STALE_MS });
  return { ...query, categories: (query.data ?? EMPTY) as Category[] };
}

export function useBrands() {
  const query = useQuery({ queryKey: ["brands"], queryFn: listBrands, staleTime: REFERENCE_STALE_MS });
  return { ...query, brands: (query.data ?? EMPTY) as Brand[] };
}

export function useCollections() {
  const query = useQuery({ queryKey: ["collections"], queryFn: listCollections, staleTime: REFERENCE_STALE_MS });
  return { ...query, collections: query.data ?? [] };
}

/**
 * Loads full product records for ids kept in local state (cart, wishlist, compare, recently viewed).
 * Returns a lookup so callers can keep their existing "find by id" logic; missing/inactive products are absent.
 */
export function useProductsByIds(ids: string[]) {
  const key = useMemo(() => [...new Set(ids)].sort(), [ids]);
  const query = useQuery({
    queryKey: ["products-by-ids", key],
    queryFn: () => getProductsByIds(key),
    enabled: key.length > 0,
    staleTime: 30 * 1000,
    // keep showing the previous list while a changed id-set reloads (avoids cart flicker on quantity edits)
    placeholderData: (prev) => prev,
  });
  const products = useMemo(() => query.data ?? [], [query.data]);
  const byId = useMemo(() => new Map(products.map((p) => [p.id, p])), [products]);
  return {
    products: products as ProductWithRelations[],
    byId,
    get: (id: string) => byId.get(id),
    isLoading: key.length > 0 && query.isLoading,
    isError: query.isError,
  };
}
