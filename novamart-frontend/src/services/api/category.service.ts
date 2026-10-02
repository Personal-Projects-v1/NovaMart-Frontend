import type { Brand, Category, Collection } from "@/types";
import { ApiError, apiRequest } from "./client";

/** GET /categories */
export function listCategories() {
  return apiRequest<Category[]>("/categories", { anonymous: true });
}

export async function getCategoryBySlug(slug: string) {
  return orNull(apiRequest<Category>(`/categories/${encodeURIComponent(slug)}`, { anonymous: true }));
}

/** GET /brands */
export function listBrands() {
  return apiRequest<Brand[]>("/brands", { anonymous: true });
}

export async function getBrandBySlug(slug: string) {
  return orNull(apiRequest<Brand>(`/brands/${encodeURIComponent(slug)}`, { anonymous: true }));
}

/** GET /collections */
export function listCollections() {
  return apiRequest<Collection[]>("/collections", { anonymous: true });
}

/** GET /collections/{slug} (includes the collection's products) */
export async function getCollectionBySlug(slug: string) {
  return orNull(apiRequest<Collection>(`/collections/${encodeURIComponent(slug)}`, { anonymous: true }));
}

/** Resolves a 404 to `null` so pages can render their not-found state. */
export async function orNull<T>(request: Promise<T>): Promise<T | null> {
  try {
    return await request;
  } catch (e) {
    if (e instanceof ApiError && e.status === 404) return null;
    throw e;
  }
}
