import type { Product, ProductBadge, ProductSpecGroup, ProductVariantGroup } from "@/types";
import seedProducts from "./seed/products.json";

type SeedProduct = {
  slug: string;
  sku: string;
  name: string;
  images: string[];
  thumbnail: string;
  price: number;
  compareAtPrice?: number;
  currency: "USD";
  stock: number;
  badges: ProductBadge[];
  shortDescription: string;
  description: string;
  variants: ProductVariantGroup[];
  specGroups: ProductSpecGroup[];
  tags: string[];
  featured?: boolean;
  bestSeller?: boolean;
  freeShipping?: boolean;
  warrantyMonths: number;
  colorSwatches?: string[];
  brandSlug: string;
  categorySlug: string;
  createdDaysAgo: number;
  seedRating: number;
  seedReviewCount: number;
};

function toProduct(raw: SeedProduct, index: number): Product {
  const id = `p-${String(index + 1).padStart(3, "0")}`;
  return {
    id,
    slug: raw.slug,
    sku: raw.sku,
    name: raw.name,
    brandId: `b-${raw.brandSlug}`,
    categoryId: `c-${raw.categorySlug}`,
    images: raw.images,
    thumbnail: raw.thumbnail,
    price: raw.price,
    compareAtPrice: raw.compareAtPrice,
    currency: raw.currency,
    rating: raw.seedRating,
    reviewCount: raw.seedReviewCount,
    stock: raw.stock,
    badges: raw.badges,
    shortDescription: raw.shortDescription,
    description: raw.description,
    variants: raw.variants,
    specGroups: raw.specGroups,
    tags: raw.tags,
    createdAt: new Date(Date.now() - raw.createdDaysAgo * 86400000).toISOString(),
    featured: raw.featured,
    bestSeller: raw.bestSeller,
    freeShipping: raw.freeShipping,
    warrantyMonths: raw.warrantyMonths,
    colorSwatches: raw.colorSwatches,
  };
}

export const products: Product[] = (seedProducts as SeedProduct[]).map(toProduct);

export const productById = (id: string) => products.find((p) => p.id === id);
export const productBySlug = (slug: string) => products.find((p) => p.slug === slug);
