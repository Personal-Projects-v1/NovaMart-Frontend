import type { Metadata } from "next";
import { Breadcrumbs } from "@/components/common/breadcrumbs";
import { FlashDealsSection } from "@/components/home/flash-deals";
import { ProductRail } from "@/components/product/product-rail";
import { getFlashDeals, listProducts } from "@/services/api/product.service";
import { coupons } from "@/mocks/misc";
import { Zap, Tag, Percent } from "lucide-react";

export const metadata: Metadata = { title: "Deals & Promotions" };

export default async function DealsPage() {
  const [deals, clearance, daily] = await Promise.all([
    getFlashDeals(),
    listProducts({ onSaleOnly: true, sort: "price-asc", pageSize: 8 }),
    listProducts({ onSaleOnly: true, sort: "rating", pageSize: 8 }),
  ]);

  return (
    <div>
      <div className="container-shell py-6">
        <Breadcrumbs items={[{ label: "Deals" }]} />
        <div className="mt-3 flex items-center gap-3">
          <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-brand text-white"><Zap size={22} /></span>
          <div>
            <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">Deals & Promotions</h1>
            <p className="text-sm text-muted">Flash sales, daily deals, clearance and active coupon codes.</p>
          </div>
        </div>
      </div>

      <FlashDealsSection deals={deals} />

      <ProductRail title="Daily Deals" subtitle="Refreshed every 24 hours" products={daily.items} />
      <ProductRail title="Clearance" subtitle="Lowest prices while supplies last" products={clearance.items} />

      <section className="container-shell py-10">
        <h2 className="mb-4 flex items-center gap-2 text-xl font-bold"><Tag size={18} /> Active Coupon Codes</h2>
        <div className="grid gap-3 sm:grid-cols-3">
          {coupons.map((c) => {
            const expired = new Date(c.expiresAt).getTime() < Date.now();
            return (
              <div key={c.code} className={`rounded-2xl border-2 border-dashed p-4 ${expired ? "border-border opacity-50" : "border-brand"}`}>
                <div className="flex items-center gap-2">
                  <Percent size={16} className="text-brand" />
                  <span className="font-mono text-lg font-bold tracking-wide">{c.code}</span>
                </div>
                <p className="mt-1 text-sm text-muted">{c.description}</p>
                {expired && <p className="mt-1 text-xs font-semibold text-brand">Expired</p>}
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}
