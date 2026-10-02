"use client";

import Image from "next/image";
import Link from "next/link";
import { Scale, X } from "lucide-react";
import { Breadcrumbs } from "@/components/common/breadcrumbs";
import { EmptyState } from "@/components/common/states";
import { Button } from "@/components/common/button";
import { Rating } from "@/components/common/rating";
import { PriceDisplay } from "@/components/common/price-display";
import { useCompareStore } from "@/store/compare.store";
import { useProductsByIds } from "@/hooks/use-catalog";
import { SkeletonLine } from "@/components/common/states";

export default function ComparePage() {
  const productIds = useCompareStore((s) => s.productIds);
  const remove = useCompareStore((s) => s.remove);

  const { byId, isLoading } = useProductsByIds(productIds);
  const items = productIds.map((id) => byId.get(id)).filter((p): p is NonNullable<typeof p> => !!p);

  if (isLoading && items.length === 0) {
    return <div className="container-shell py-12"><SkeletonLine className="h-64 w-full" /></div>;
  }

  if (items.length === 0) {
    return (
      <div className="container-shell py-12">
        <EmptyState
          icon={Scale}
          title="Nothing to compare yet"
          description="Add up to 4 products from the shop to compare their specs side by side."
          action={<Link href="/shop"><Button>Browse Products</Button></Link>}
        />
      </div>
    );
  }

  const specTitles = Array.from(new Set(items.flatMap((p) => p.specGroups.flatMap((g) => g.specs.map((s) => s.label)))));

  function specValue(product: (typeof items)[number], label: string) {
    for (const group of product.specGroups) {
      const spec = group.specs.find((s) => s.label === label);
      if (spec) return spec.value;
    }
    return "—";
  }

  return (
    <div className="container-shell py-6">
      <Breadcrumbs items={[{ label: "Compare" }]} />
      <h1 className="mb-6 mt-3 text-2xl font-bold tracking-tight sm:text-3xl">Compare Products</h1>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[700px] border-separate border-spacing-0">
          <thead>
            <tr>
              <th className="w-40 p-3 text-left text-xs font-semibold uppercase text-muted">Product</th>
              {items.map((p) => {
                const brand = p.brand;
                return (
                  <th key={p.id} className="min-w-[200px] border-b border-border p-3 text-left align-top">
                    <button onClick={() => remove(p.id)} aria-label="Remove from compare" className="mb-2 flex h-6 w-6 items-center justify-center rounded-full bg-surface hover:bg-surface-strong">
                      <X size={12} />
                    </button>
                    <div className="relative mb-2 aspect-square w-28 overflow-hidden rounded-xl bg-surface">
                      <Image src={p.thumbnail} alt={p.name} fill sizes="112px" className="object-cover" />
                    </div>
                    <Link href={`/product/${p.slug}`} className="text-sm font-semibold hover:text-brand">{p.name}</Link>
                    <p className="text-xs text-muted">{brand?.name}</p>
                  </th>
                );
              })}
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="border-b border-border p-3 text-sm font-semibold text-muted">Price</td>
              {items.map((p) => (
                <td key={p.id} className="border-b border-border p-3"><PriceDisplay price={p.price} compareAtPrice={p.compareAtPrice} size="sm" /></td>
              ))}
            </tr>
            <tr>
              <td className="border-b border-border p-3 text-sm font-semibold text-muted">Rating</td>
              {items.map((p) => (
                <td key={p.id} className="border-b border-border p-3"><Rating value={p.rating} count={p.reviewCount} size={12} /></td>
              ))}
            </tr>
            <tr>
              <td className="border-b border-border p-3 text-sm font-semibold text-muted">Availability</td>
              {items.map((p) => (
                <td key={p.id} className="border-b border-border p-3 text-sm">{p.stock > 0 ? `In stock (${p.stock})` : "Out of stock"}</td>
              ))}
            </tr>
            <tr>
              <td className="border-b border-border p-3 text-sm font-semibold text-muted">Warranty</td>
              {items.map((p) => (
                <td key={p.id} className="border-b border-border p-3 text-sm">{p.warrantyMonths} months</td>
              ))}
            </tr>
            {specTitles.map((label) => (
              <tr key={label}>
                <td className="border-b border-border p-3 text-sm font-semibold text-muted">{label}</td>
                {items.map((p) => (
                  <td key={p.id} className="border-b border-border p-3 text-sm">{specValue(p, label)}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
