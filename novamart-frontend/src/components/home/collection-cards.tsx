import Image from "next/image";
import Link from "next/link";
import type { Collection } from "@/types";

export function CollectionCards({ collections }: { collections: Collection[] }) {
  return (
    <section className="container-shell py-10">
      <div className="mb-5 flex items-end justify-between">
        <div>
          <h2 className="text-xl font-bold tracking-tight sm:text-2xl">Shop by Collection</h2>
          <p className="mt-1 text-sm text-muted">Curated bundles for every lifestyle.</p>
        </div>
        <Link href="/collections" className="text-sm font-semibold text-brand hover:underline">More ideas</Link>
      </div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {collections.map((c) => (
          <Link key={c.id} href={`/collections/${c.slug}`} className="group relative overflow-hidden rounded-2xl">
            <div className="relative aspect-[4/3]">
              <Image src={c.image} alt={c.title} fill sizes="400px" className="object-cover transition-transform duration-500 group-hover:scale-105" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
            </div>
            <div className="absolute bottom-0 left-0 right-0 p-5 text-white">
              <p className="text-xs font-medium text-white/70">{c.productIds.length} ideas</p>
              <h3 className="text-lg font-bold">{c.title}</h3>
              <span className="mt-2 inline-flex h-8 w-8 items-center justify-center rounded-full bg-white/20 backdrop-blur transition group-hover:bg-brand">→</span>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
