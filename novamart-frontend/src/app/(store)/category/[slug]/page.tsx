import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { categoryBySlug, categories } from "@/mocks/categories";
import { Breadcrumbs } from "@/components/common/breadcrumbs";
import { ProductListing } from "@/components/product/product-listing";

export function generateStaticParams() {
  return categories.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const category = categoryBySlug(slug);
  return { title: category ? category.name : "Category" };
}

export default async function CategoryPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const category = categoryBySlug(slug);
  if (!category) notFound();

  return (
    <div className="container-shell py-6">
      <Breadcrumbs items={[{ label: "Categories", href: "/categories" }, { label: category.name }]} />
      <div className="mb-6 mt-3 flex flex-col gap-2">
        <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">{category.name}</h1>
        <p className="max-w-2xl text-sm text-muted">{category.description}</p>
      </div>
      <ProductListing baseCategorySlug={category.slug} hideCategoryFacet />
    </div>
  );
}
