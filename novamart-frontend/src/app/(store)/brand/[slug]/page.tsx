import Image from "next/image";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { brands } from "@/mocks/brands";
import { Breadcrumbs } from "@/components/common/breadcrumbs";
import { ProductListing } from "@/components/product/product-listing";

export function generateStaticParams() {
  return brands.map((b) => ({ slug: b.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const brand = brands.find((b) => b.slug === slug);
  return { title: brand ? brand.name : "Brand" };
}

export default async function BrandPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const brand = brands.find((b) => b.slug === slug);
  if (!brand) notFound();

  return (
    <div className="container-shell py-6">
      <Breadcrumbs items={[{ label: "Brands", href: "/brands" }, { label: brand.name }]} />
      <div className="mb-8 mt-4 flex items-center gap-5 rounded-2xl bg-surface p-6">
        <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-full bg-white">
          <Image src={brand.logo} alt={brand.name} fill sizes="80px" className="object-cover" />
        </div>
        <div>
          <h1 className="text-2xl font-bold">{brand.name}</h1>
          <p className="mt-1 max-w-xl text-sm text-muted">{brand.description}</p>
        </div>
      </div>
      <ProductListing baseBrandSlug={brand.slug} />
    </div>
  );
}
