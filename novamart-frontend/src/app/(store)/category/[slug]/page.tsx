import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { serverGet } from "@/lib/server-api";
import type { Category } from "@/types";
import Image from "next/image";
import { Breadcrumbs } from "@/components/common/breadcrumbs";
import { ProductListing } from "@/components/product/product-listing";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const category = await serverGet<Category>(`/categories/${encodeURIComponent(slug)}`);
  return { title: category ? category.name : "Category" };
}

export default async function CategoryPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const category = await serverGet<Category>(`/categories/${encodeURIComponent(slug)}`);
  if (!category) notFound();

  return (
    <div className="container-shell py-6">
      <Breadcrumbs items={[{ label: "Categories", href: "/categories" }, { label: category.name }]} />
      <div className="relative isolate mb-8 mt-4 flex min-h-[170px] items-end overflow-hidden rounded-3xl p-6 text-white sm:min-h-[210px] sm:p-10">
        <Image src={category.image} alt="" fill priority sizes="(min-width: 1400px) 1336px, 100vw" className="-z-20 object-cover" />
        <div className="absolute inset-0 -z-10 bg-gradient-to-r from-black/80 via-black/45 to-black/10" />
        <div>
          <p className="mb-1 text-xs font-semibold uppercase tracking-widest text-white/70">{category.productCount} {category.productCount === 1 ? "product" : "products"}</p>
          <h1 className="font-display text-3xl font-bold tracking-tight sm:text-5xl">{category.name}</h1>
          <p className="mt-2 max-w-xl text-sm text-white/85 sm:text-base">{category.description}</p>
        </div>
      </div>
      <ProductListing baseCategorySlug={category.slug} hideCategoryFacet />
    </div>
  );
}
