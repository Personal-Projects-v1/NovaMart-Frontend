import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { Breadcrumbs } from "@/components/common/breadcrumbs";
import { ProductGallery } from "@/components/product/product-gallery";
import { ProductBuyBox } from "@/components/product/product-buy-box";
import { ProductTabs } from "@/components/product/product-tabs";
import { ProductRail } from "@/components/product/product-rail";
import { RecentlyViewedSection } from "@/components/home/recently-viewed";
import { serverGet } from "@/lib/server-api";
import type { ProductQuestion, ProductWithRelations, Review } from "@/types";

const getProductBySlug = (slug: string) => serverGet<ProductWithRelations>(`/products/${encodeURIComponent(slug)}`, 30);

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) return { title: "Product not found" };
  return {
    title: product.name,
    description: product.shortDescription,
    openGraph: { title: product.name, description: product.shortDescription, images: [product.thumbnail] },
  };
}

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) notFound();

  const [related, reviews, questions] = await Promise.all([
    serverGet<ProductWithRelations[]>(`/products/${product.id}/related?limit=12`, 30),
    serverGet<Review[]>(`/products/${product.id}/reviews`, 15),
    serverGet<ProductQuestion[]>(`/products/${product.id}/questions`, 15),
  ]).then(([r, rv, q]) => [r ?? [], rv ?? [], q ?? []] as const);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    image: product.images,
    description: product.shortDescription,
    sku: product.sku,
    brand: { "@type": "Brand", name: product.brand.name },
    aggregateRating: product.reviewCount
      ? { "@type": "AggregateRating", ratingValue: product.rating, reviewCount: product.reviewCount }
      : undefined,
    offers: {
      "@type": "Offer",
      priceCurrency: "USD",
      price: product.price,
      availability: product.stock > 0 ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
    },
  };

  return (
    <div className="container-shell py-6">
      {/* eslint-disable-next-line @next/next/no-html-link-for-pages */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <Breadcrumbs
        items={[
          { label: product.category.name, href: `/category/${product.category.slug}` },
          { label: product.name },
        ]}
      />

      <div className="mt-4 grid gap-10 lg:grid-cols-2">
        <ProductGallery images={product.images} name={product.name} />
        <ProductBuyBox product={product} />
      </div>

      <ProductTabs product={product} reviews={reviews} questions={questions} />

      <div className="mt-4">
        <ProductRail title="Frequently Bought Together" products={related.slice(0, 6)} />
        <ProductRail title="You May Also Like" subtitle="Similar products customers also viewed" products={related} />
      </div>

      <RecentlyViewedSection />
    </div>
  );
}
