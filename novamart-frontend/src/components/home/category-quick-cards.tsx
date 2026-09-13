import Link from "next/link";
import * as Icons from "lucide-react";
import { categories } from "@/mocks/categories";

export function CategoryQuickCards() {
  return (
    <section className="container-shell py-10">
      <div className="mb-5 flex items-end justify-between">
        <h2 className="text-xl font-bold tracking-tight sm:text-2xl">Shop by Category</h2>
        <Link href="/categories" className="text-sm font-semibold text-brand hover:underline">View all</Link>
      </div>
      <div className="grid grid-cols-4 gap-3 sm:grid-cols-4 lg:grid-cols-8">
        {categories.map((cat) => {
          const Icon = (Icons[cat.icon as keyof typeof Icons] as Icons.LucideIcon) ?? Icons.Package;
          return (
            <Link
              key={cat.slug}
              href={`/category/${cat.slug}`}
              className="group flex flex-col items-center gap-2 rounded-2xl border border-border bg-white p-3 text-center transition hover:-translate-y-0.5 hover:border-brand hover:shadow-md sm:p-4"
            >
              <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-brand-soft text-brand transition group-hover:bg-brand group-hover:text-white sm:h-12 sm:w-12">
                <Icon size={20} />
              </span>
              <span className="text-xs font-semibold text-foreground sm:text-sm">{cat.name}</span>
              <span className="hidden text-[11px] text-muted sm:block">{cat.productCount} items</span>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
