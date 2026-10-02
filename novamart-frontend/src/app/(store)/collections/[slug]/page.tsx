import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { Breadcrumbs } from "@/components/common/breadcrumbs";
import { ProductGrid } from "@/components/product/product-grid";
import { serverGet } from "@/lib/server-api";
import type { Collection } from "@/types";

const getCollectionBySlug = (slug: string) => serverGet<Collection>(`/collections/${encodeURIComponent(slug)}`);

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const collection = await getCollectionBySlug(slug);
  return { title: collection ? collection.title : "Collection" };
}

export default async function CollectionPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const collection = await getCollectionBySlug(slug);
  if (!collection) notFound();

  const items = collection.products ?? [];

  return (
    <div className="container-shell py-6">
      <Breadcrumbs items={[{ label: "Collections", href: "/collections" }, { label: collection.title }]} />
      <h1 className="mb-1 mt-3 text-2xl font-bold tracking-tight sm:text-3xl">{collection.title}</h1>
      <p className="mb-6 max-w-2xl text-sm text-muted">{collection.description}</p>
      <ProductGrid products={items} />
    </div>
  );
}
