import Link from "next/link";
import type { Metadata } from "next";
import { Breadcrumbs } from "@/components/common/breadcrumbs";
import { BrandMark } from "@/components/common/brand-mark";

// TEMPORARY: Disabled API integration until backend is deployed
// export const dynamic = "force-dynamic";

export const metadata: Metadata = { title: "All Brands" };

export default function BrandsPage() {
  const brands = [];
  return (
    <div className="container-shell py-6">
      <Breadcrumbs items={[{ label: "Brands" }]} />
      <h1 className="mb-6 mt-3 text-2xl font-bold tracking-tight sm:text-3xl">All Brands</h1>
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
        {brands.map((brand) => (
          <Link key={brand.slug} href={`/brand/${brand.slug}`} className="flex items-center gap-4 rounded-2xl border border-border bg-white p-5 hover:-translate-y-0.5 hover:shadow-md transition">
            <BrandMark brand={brand} size={56} />
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
