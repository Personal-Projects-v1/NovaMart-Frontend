import Link from "next/link";
import { BrandMark } from "@/components/common/brand-mark";
import type { Brand } from "@/types";

export function BrandStrip({ brands }: { brands: Brand[] }) {
  return (
    <section className="container-shell py-12">
      <div className="mb-6 flex items-end justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">Featured brands</h2>
          <p className="mt-1 text-sm text-muted">Authentic products, straight from the manufacturers.</p>
        </div>
        <Link href="/brands" className="text-sm font-semibold text-brand hover:underline">All brands</Link>
      </div>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-8">
        {brands.map((brand) => (
          <Link
            key={brand.id}
            href={`/brand/${brand.slug}`}
            className="group flex flex-col items-center gap-3 rounded-2xl border border-border bg-white px-3 py-5 transition duration-300 hover:-translate-y-1 hover:border-foreground/20 hover:shadow-lift"
          >
            <BrandMark brand={brand} size={44} className="transition group-hover:bg-brand" />
            <span className="font-display text-sm font-bold tracking-wide">{brand.name}</span>
            <span className="-mt-2 text-[11px] text-muted">{brand.productCount} {brand.productCount === 1 ? "product" : "products"}</span>
          </Link>
        ))}
      </div>
    </section>
  );
}
