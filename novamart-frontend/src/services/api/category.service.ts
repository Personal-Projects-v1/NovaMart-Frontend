import { categories } from "@/mocks/categories";
import { brands } from "@/mocks/brands";
import { collections } from "@/mocks/misc";
import { mockDelay } from "./client";

/** GET /api/v1/categories */
export async function listCategories() {
  return mockDelay(categories);
}

export async function getCategoryBySlug(slug: string) {
  return mockDelay(categories.find((c) => c.slug === slug) ?? null);
}

/** GET /api/v1/brands */
export async function listBrands() {
  return mockDelay(brands);
}

export async function getBrandBySlug(slug: string) {
  return mockDelay(brands.find((b) => b.slug === slug) ?? null);
}

export async function listCollections() {
  return mockDelay(collections);
}

export async function getCollectionBySlug(slug: string) {
  return mockDelay(collections.find((c) => c.slug === slug) ?? null);
}
