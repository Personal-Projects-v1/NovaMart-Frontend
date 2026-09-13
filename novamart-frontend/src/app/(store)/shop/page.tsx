import type { Metadata } from "next";
import { Breadcrumbs } from "@/components/common/breadcrumbs";
import { ProductListing } from "@/components/product/product-listing";

export const metadata: Metadata = {
  title: "Shop All Products",
  description: "Browse the full NovaMart catalog of phones, laptops, audio, gaming gear and more.",
};

export default function ShopPage() {
  return (
    <div className="container-shell py-6">
      <Breadcrumbs items={[{ label: "Shop" }]} />
      <h1 className="mb-1 mt-3 text-2xl font-bold tracking-tight sm:text-3xl">Shop All Products</h1>
      <p className="mb-6 text-sm text-muted">Explore our full range of premium electronics.</p>
      <ProductListing />
    </div>
  );
}
