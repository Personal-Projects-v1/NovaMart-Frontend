import { HeroCarousel } from "@/components/home/hero-carousel";
import { CategoryQuickCards } from "@/components/home/category-quick-cards";
import { TrustStrip } from "@/components/home/trust-strip";
import { BrandStrip } from "@/components/home/brand-strip";
import { CollectionCards } from "@/components/home/collection-cards";
import { PromoBanner } from "@/components/home/promo-banner";
import { FlashDealsSection } from "@/components/home/flash-deals";
import { ProductRail } from "@/components/product/product-rail";
import { Newsletter } from "@/components/layout/newsletter";
import { RecentlyViewedSection } from "@/components/home/recently-viewed";

// TEMPORARY: Using static dummy data until backend is deployed
// Remove "force-dynamic" to allow static generation
// export const dynamic = "force-dynamic";

export default function HomePage() {
  // Dummy data - replace with real API calls later
  const trending = [];
  const deals = [];
  const newArrivals = [];
  const bestSellers = [];
  const recommended = [];
  const brands = [];
  const collections = [];

  return (
    <div>
      <HeroCarousel />
      <CategoryQuickCards />
      <ProductRail title="Trending Products" subtitle="What everyone's adding to their cart right now" products={trending} viewAllHref="/shop?sort=bestselling" />
      <TrustStrip />
      <FlashDealsSection deals={deals} />
      <ProductRail title="New Arrivals" subtitle="Fresh drops, straight off the truck" products={newArrivals} viewAllHref="/shop?sort=newest" />
      <CollectionCards collections={collections} />
      <ProductRail title="Best Sellers" subtitle="Loved by thousands of customers" products={bestSellers} viewAllHref="/shop?sort=bestselling" />
      <PromoBanner />
      <ProductRail title="Recommended For You" subtitle="Based on trending items in your favorite categories" products={recommended} viewAllHref="/shop" />
      <BrandStrip brands={brands.filter((b) => b.featured)} />
      <RecentlyViewedSection />
      <div className="container-shell pb-10">
        <Newsletter />
      </div>
    </div>
  );
}
