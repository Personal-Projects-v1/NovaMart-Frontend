import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { Breadcrumbs } from "@/components/common/breadcrumbs";
import { ProductGrid } from "@/components/product/product-grid";
import { getCollectionBySlug } from "@/services/api/category.service";
import { products } from "@/mocks/products";
import { brands } from "@/mocks/brands";
import { categories } from "@/mocks/categories";
import type { ProductWithRelations } from "@/types";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const collection = await getCollectionBySlug(slug);
  return { title: collection ? collection.title : "Collection" };
}

export default async function CollectionPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const collection = await getCollectionBySlug(slug);
  if (!collection) notFound();

  const items: ProductWithRelations[] = collection.productIds
    .map((id) => products.find((p) => p.id === id))
    .filter((p): p is NonNullable<typeof p> => !!p)
    .map((p) => ({ ...p, brand: brands.find((b) => b.id === p.brandId)!, category: categories.find((c) => c.id === p.categoryId)! }));

  return (
    <div className="container-shell py-6">
      <Breadcrumbs items={[{ label: "Collections", href: "/collections" }, { label: collection.title }]} />
      <h1 className="mb-1 mt-3 text-2xl font-bold tracking-tight sm:text-3xl">{collection.title}</h1>
      <p className="mb-6 max-w-2xl text-sm text-muted">{collection.description}</p>
      <ProductGrid products={items} />
    </div>
  );
}
