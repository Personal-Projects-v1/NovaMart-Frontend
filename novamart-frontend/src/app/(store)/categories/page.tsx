import Link from "next/link";
import Image from "next/image";
import type { Metadata } from "next";
import { serverGet } from "@/lib/server-api";
import type { Category } from "@/types";
import { Breadcrumbs } from "@/components/common/breadcrumbs";

// rendered from live API data on each request
export const dynamic = "force-dynamic";

export const metadata: Metadata = { title: "All Categories" };

export default async function CategoriesPage() {
  const categories = (await serverGet<Category[]>("/categories").catch(() => null)) ?? [];
  return (
    <div className="container-shell py-6">
      <Breadcrumbs items={[{ label: "Categories" }]} />
      <h1 className="mb-6 mt-3 text-2xl font-bold tracking-tight sm:text-3xl">All Categories</h1>
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
        {categories.map((cat) => (
          <Link key={cat.slug} href={`/category/${cat.slug}`} className="group overflow-hidden rounded-2xl border border-border">
            <div className="relative aspect-[4/3]">
              <Image src={cat.image} alt={cat.name} fill sizes="300px" className="object-cover transition-transform group-hover:scale-105" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
              <div className="absolute bottom-3 left-3 text-white">
                <p className="font-bold">{cat.name}</p>
                <p className="text-xs text-white/80">{cat.productCount} products</p>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
