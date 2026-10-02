import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { serverGet } from "@/lib/server-api";
import type { Brand } from "@/types";
import { Breadcrumbs } from "@/components/common/breadcrumbs";
import { BrandMark } from "@/components/common/brand-mark";
import { ProductListing } from "@/components/product/product-listing";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const brand = await serverGet<Brand>(`/brands/${encodeURIComponent(slug)}`);
  return { title: brand ? brand.name : "Brand" };
}

export default async function BrandPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const brand = await serverGet<Brand>(`/brands/${encodeURIComponent(slug)}`);
  if (!brand) notFound();

  return (
    <div className="container-shell py-6">
      <Breadcrumbs items={[{ label: "Brands", href: "/brands" }, { label: brand.name }]} />
      <div className="mb-8 mt-4 flex items-center gap-5 rounded-2xl bg-surface p-6">
        <BrandMark brand={brand} size={80} />
        <div>
          <h1 className="text-2xl font-bold">{brand.name}</h1>
          <p className="mt-1 max-w-xl text-sm text-muted">{brand.description}</p>
        </div>
      </div>
      <ProductListing baseBrandSlug={brand.slug} />
    </div>
  );
}
