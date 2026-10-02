import type {
  FlashDeal,
  PaginatedResult,
  Product,
  ProductFilters,
  ProductQuestion,
  ProductWithRelations,
  Review,
} from "@/types";
import { apiRequest } from "./client";
import { orNull } from "./category.service";

/** GET /products */
export function listProducts(filters: ProductFilters = {}) {
  return apiRequest<PaginatedResult<ProductWithRelations>>("/products", {
    anonymous: true,
    params: {
      categories: filters.categorySlugs,
      brands: filters.brandSlugs,
      minPrice: filters.minPrice,
      maxPrice: filters.maxPrice,
      minRating: filters.minRating,
      inStockOnly: filters.inStockOnly || undefined,
      onSaleOnly: filters.onSaleOnly || undefined,
      colors: filters.colors,
      sort: filters.sort,
      q: filters.query,
      page: filters.page,
      pageSize: filters.pageSize,
    },
  });
}

/** GET /products/{slug} - resolves to null when the product doesn't exist. */
export function getProductBySlug(slug: string): Promise<ProductWithRelations | null> {
  return orNull(apiRequest<ProductWithRelations>(`/products/${encodeURIComponent(slug)}`, { anonymous: true }));
}

/** GET /products/batch - used by cart, wishlist, compare and recently-viewed, which only store ids. */
export async function getProductsByIds(ids: string[]): Promise<ProductWithRelations[]> {
  const unique = [...new Set(ids)];
  if (unique.length === 0) return [];
  return apiRequest<ProductWithRelations[]>("/products/batch", { anonymous: true, params: { ids: unique } });
}

export async function getProductById(id: string): Promise<ProductWithRelations | null> {
  return (await getProductsByIds([id]))[0] ?? null;
}

/** GET /products/{id}/related */
export function getRelatedProducts(product: Pick<Product, "id">, limit = 8) {
  return apiRequest<ProductWithRelations[]>(`/products/${product.id}/related`, { anonymous: true, params: { limit } });
}

export function getFeaturedProducts(limit = 8) {
  return apiRequest<ProductWithRelations[]>("/products/featured", { anonymous: true, params: { limit } });
}

export function getBestSellers(limit = 8) {
  return apiRequest<ProductWithRelations[]>("/products/best-sellers", { anonymous: true, params: { limit } });
}

export function getNewArrivals(limit = 8) {
  return apiRequest<ProductWithRelations[]>("/products/new-arrivals", { anonymous: true, params: { limit } });
}

export function getTrendingProducts(limit = 8) {
  return apiRequest<ProductWithRelations[]>("/products/trending", { anonymous: true, params: { limit } });
}

export function getRecommendedProducts(limit = 8) {
  return apiRequest<ProductWithRelations[]>("/products/recommended", { anonymous: true, params: { limit } });
}

/** GET /deals/flash */
export function getFlashDeals() {
  return apiRequest<(FlashDeal & { product: ProductWithRelations })[]>("/deals/flash", { anonymous: true });
}

// ----- reviews & Q&A -------------------------------------------------------------------------

export function getProductReviews(productId: string) {
  return apiRequest<Review[]>(`/products/${productId}/reviews`, { anonymous: true });
}

export function createReview(productId: string, payload: { rating: number; title: string; body: string }) {
  return apiRequest<Review>(`/products/${productId}/reviews`, { method: "POST", body: payload });
}

export function markReviewHelpful(reviewId: string) {
  return apiRequest<void>(`/reviews/${reviewId}/helpful`, { method: "POST" });
}

export function getProductQuestions(productId: string) {
  return apiRequest<ProductQuestion[]>(`/products/${productId}/questions`, { anonymous: true });
}

export function askQuestion(productId: string, question: string) {
  return apiRequest<ProductQuestion>(`/products/${productId}/questions`, { method: "POST", body: { question } });
}

export function answerQuestion(questionId: string, body: string) {
  return apiRequest<ProductQuestion>(`/questions/${questionId}/answers`, { method: "POST", body: { body } });
}

/** GET /search/suggestions */
export function searchSuggestions(query: string, limit = 6) {
  if (!query.trim()) return Promise.resolve({ products: [] as ProductWithRelations[], categories: [] as string[] });
  return apiRequest<{ products: ProductWithRelations[]; categories: string[] }>("/search/suggestions", {
    anonymous: true,
    params: { q: query, limit },
  });
}
