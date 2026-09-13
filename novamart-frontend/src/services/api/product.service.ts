import { brands } from "@/mocks/brands";
import { categories } from "@/mocks/categories";
import { products } from "@/mocks/products";
import { flashDeals } from "@/mocks/misc";
import { reviewsForProduct, questionsForProduct } from "@/mocks/reviews";
import type {
  PaginatedResult,
  Product,
  ProductFilters,
  ProductWithRelations,
} from "@/types";
import { mockDelay } from "./client";

function withRelations(p: Product): ProductWithRelations {
  const brand = brands.find((b) => b.id === p.brandId)!;
  const category = categories.find((c) => c.id === p.categoryId)!;
  return { ...p, brand, category };
}

/** GET /api/v1/products */
export async function listProducts(filters: ProductFilters = {}): Promise<PaginatedResult<ProductWithRelations>> {
  let items = products.map(withRelations);

  if (filters.query) {
    const q = filters.query.toLowerCase();
    items = items.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.brand.name.toLowerCase().includes(q) ||
        p.tags.some((t) => t.includes(q)) ||
        p.category.name.toLowerCase().includes(q)
    );
  }
  if (filters.categorySlugs?.length) {
    items = items.filter((p) => filters.categorySlugs!.includes(p.category.slug));
  }
  if (filters.brandSlugs?.length) {
    items = items.filter((p) => filters.brandSlugs!.includes(p.brand.slug));
  }
  if (filters.minPrice !== undefined) items = items.filter((p) => p.price >= filters.minPrice!);
  if (filters.maxPrice !== undefined) items = items.filter((p) => p.price <= filters.maxPrice!);
  if (filters.minRating !== undefined) items = items.filter((p) => p.rating >= filters.minRating!);
  if (filters.inStockOnly) items = items.filter((p) => p.stock > 0);
  if (filters.onSaleOnly) items = items.filter((p) => (p.compareAtPrice ?? 0) > p.price);
  if (filters.colors?.length) {
    items = items.filter((p) =>
      p.variants.some((v) => v.name === "Color" && v.options.some((o) => filters.colors!.includes(o.label)))
    );
  }

  switch (filters.sort) {
    case "price-asc":
      items = [...items].sort((a, b) => a.price - b.price);
      break;
    case "price-desc":
      items = [...items].sort((a, b) => b.price - a.price);
      break;
    case "newest":
      items = [...items].sort((a, b) => +new Date(b.createdAt) - +new Date(a.createdAt));
      break;
    case "rating":
      items = [...items].sort((a, b) => b.rating - a.rating);
      break;
    case "bestselling":
      items = [...items].sort((a, b) => Number(b.bestSeller) - Number(a.bestSeller) || b.reviewCount - a.reviewCount);
      break;
    default:
      items = [...items].sort((a, b) => Number(b.featured) - Number(a.featured) || b.rating - a.rating);
  }

  const page = filters.page ?? 1;
  const pageSize = filters.pageSize ?? 12;
  const total = items.length;
  const start = (page - 1) * pageSize;
  const paged = items.slice(start, start + pageSize);

  return mockDelay({
    items: paged,
    total,
    page,
    pageSize,
    totalPages: Math.max(1, Math.ceil(total / pageSize)),
  });
}

/** GET /api/v1/products/{slug} */
export async function getProductBySlug(slug: string): Promise<ProductWithRelations | null> {
  const p = products.find((product) => product.slug === slug);
  return mockDelay(p ? withRelations(p) : null);
}

export async function getProductById(id: string): Promise<ProductWithRelations | null> {
  const p = products.find((product) => product.id === id);
  return mockDelay(p ? withRelations(p) : null);
}

export async function getRelatedProducts(product: Product, limit = 8): Promise<ProductWithRelations[]> {
  const related = products
    .filter((p) => p.id !== product.id && (p.categoryId === product.categoryId || p.brandId === product.brandId))
    .slice(0, limit)
    .map(withRelations);
  return mockDelay(related);
}

export async function getFeaturedProducts(limit = 8): Promise<ProductWithRelations[]> {
  return mockDelay(products.filter((p) => p.featured).slice(0, limit).map(withRelations));
}

export async function getBestSellers(limit = 8): Promise<ProductWithRelations[]> {
  return mockDelay(
    [...products]
      .sort((a, b) => Number(b.bestSeller) - Number(a.bestSeller) || b.reviewCount - a.reviewCount)
      .slice(0, limit)
      .map(withRelations)
  );
}

export async function getNewArrivals(limit = 8): Promise<ProductWithRelations[]> {
  return mockDelay(
    [...products]
      .sort((a, b) => +new Date(b.createdAt) - +new Date(a.createdAt))
      .slice(0, limit)
      .map(withRelations)
  );
}

export async function getTrendingProducts(limit = 8): Promise<ProductWithRelations[]> {
  return mockDelay([...products].sort((a, b) => b.reviewCount - a.reviewCount).slice(0, limit).map(withRelations));
}

export async function getRecommendedProducts(limit = 8): Promise<ProductWithRelations[]> {
  return mockDelay([...products].sort((a, b) => b.rating - a.rating).slice(0, limit).map(withRelations));
}

export async function getFlashDeals() {
  const withProducts = flashDeals
    .map((deal) => {
      const product = products.find((p) => p.id === deal.productId);
      return product ? { ...deal, product: withRelations(product) } : null;
    })
    .filter((d): d is (typeof flashDeals)[number] & { product: ProductWithRelations } => d !== null);
  return mockDelay(withProducts);
}

export async function getProductReviews(productId: string) {
  return mockDelay(reviewsForProduct(productId));
}

export async function getProductQuestions(productId: string) {
  return mockDelay(questionsForProduct(productId));
}

export async function searchSuggestions(query: string, limit = 6) {
  const q = query.toLowerCase();
  if (!q) return mockDelay({ products: [] as ProductWithRelations[], categories: [] as string[] }, 80);
  const matched = products
    .filter((p) => p.name.toLowerCase().includes(q) || p.tags.some((t) => t.includes(q)))
    .slice(0, limit)
    .map(withRelations);
  const matchedCategories = categories.filter((c) => c.name.toLowerCase().includes(q)).map((c) => c.name);
  return mockDelay({ products: matched, categories: matchedCategories }, 120);
}
