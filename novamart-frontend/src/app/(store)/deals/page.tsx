import type { Metadata } from "next";
import { Breadcrumbs } from "@/components/common/breadcrumbs";
import { FlashDealsSection } from "@/components/home/flash-deals";
import { ProductRail } from "@/components/product/product-rail";
import { Zap, Tag, Percent } from "lucide-react";

// TEMPORARY: Disabled API integration until backend is deployed
// export const dynamic = "force-dynamic";

export const metadata: Metadata = { title: "Deals & Promotions" };

export default function DealsPage() {
  // Dummy data - replace with real API calls later
  const deals = [];
  const clearance = { items: [] };
  const daily = { items: [] };
  const coupons = [];

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
            return (
              <div key={c.code} className="rounded-2xl border-2 border-dashed border-brand p-4">
                <div className="flex items-center gap-2">
                  <Percent size={16} className="text-brand" />
                  <span className="font-mono text-lg font-bold tracking-wide">{c.code}</span>
                </div>
                <p className="mt-1 text-sm text-muted">{c.description}</p>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}
