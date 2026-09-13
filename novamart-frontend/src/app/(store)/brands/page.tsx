import Link from "next/link";
import Image from "next/image";
import type { Metadata } from "next";
import { brands } from "@/mocks/brands";
import { Breadcrumbs } from "@/components/common/breadcrumbs";

export const metadata: Metadata = { title: "All Brands" };

export default function BrandsPage() {
  return (
    <div className="container-shell py-6">
      <Breadcrumbs items={[{ label: "Brands" }]} />
      <h1 className="mb-6 mt-3 text-2xl font-bold tracking-tight sm:text-3xl">All Brands</h1>
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
        {brands.map((brand) => (
          <Link key={brand.slug} href={`/brand/${brand.slug}`} className="flex items-center gap-4 rounded-2xl border border-border bg-white p-5 hover:-translate-y-0.5 hover:shadow-md transition">
            <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-full bg-surface">
              <Image src={brand.logo} alt={brand.name} fill sizes="56px" className="object-cover" />
            </div>
            <div>
              <p className="font-bold">{brand.name}</p>
              <p className="text-xs text-muted">{brand.productCount} products</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
