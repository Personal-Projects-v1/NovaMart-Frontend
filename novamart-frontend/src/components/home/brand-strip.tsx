import Image from "next/image";
import Link from "next/link";
import type { Brand } from "@/types";

export function BrandStrip({ brands }: { brands: Brand[] }) {
  return (
    <section className="container-shell py-10">
      <div className="mb-5 flex items-end justify-between">
        <h2 className="text-xl font-bold tracking-tight sm:text-2xl">Featured Brands</h2>
        <Link href="/brands" className="text-sm font-semibold text-brand hover:underline">All brands</Link>
      </div>
      <div className="grid grid-cols-4 gap-3 sm:grid-cols-8">
        {brands.map((brand) => (
          <Link
            key={brand.id}
            href={`/brand/${brand.slug}`}
            className="flex flex-col items-center gap-2 rounded-2xl border border-border bg-white p-4 transition hover:-translate-y-0.5 hover:shadow-md"
          >
            <div className="relative h-10 w-10 overflow-hidden rounded-full bg-surface">
              <Image src={brand.logo} alt={brand.name} fill sizes="40px" className="object-cover" />
            </div>
            <span className="text-xs font-semibold">{brand.name}</span>
          </Link>
        ))}
      </div>
    </section>
  );
}
