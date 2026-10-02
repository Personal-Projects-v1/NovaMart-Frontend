"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { useCategories } from "@/hooks/use-catalog";

export function CategoryQuickCards() {
  const { categories, isLoading } = useCategories();

  return (
    <section className="container-shell py-12">
      <div className="mb-6 flex items-end justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">Shop by category</h2>
          <p className="mt-1 text-sm text-muted">Find exactly what you&apos;re looking for.</p>
        </div>
        <Link href="/categories" className="hidden items-center gap-1 text-sm font-semibold text-brand hover:underline sm:flex">
          All categories <ArrowUpRight size={14} />
        </Link>
      </div>
      <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
        {isLoading && Array.from({ length: 8 }).map((_, i) => <div key={i} className="aspect-[4/3] animate-pulse rounded-2xl bg-surface" />)}
        {categories.map((cat) => (
          <Link
            key={cat.slug}
            href={`/category/${cat.slug}`}
            className="group relative aspect-[4/3] overflow-hidden rounded-2xl bg-surface shadow-soft"
          >
            <Image
              src={cat.image}
              alt=""
              fill
              sizes="(min-width: 1024px) 25vw, 50vw"
              className="object-cover transition-transform duration-700 group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/25 to-transparent" />
            <div className="absolute inset-x-0 bottom-0 flex items-end justify-between p-4 text-white">
              <div>
                <h3 className="font-display text-base font-bold sm:text-lg">{cat.name}</h3>
                <p className="text-xs text-white/75">{cat.productCount} {cat.productCount === 1 ? "product" : "products"}</p>
              </div>
              <span className="flex h-9 w-9 items-center justify-center rounded-full bg-white/20 backdrop-blur transition group-hover:bg-brand">
                <ArrowUpRight size={16} />
              </span>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
