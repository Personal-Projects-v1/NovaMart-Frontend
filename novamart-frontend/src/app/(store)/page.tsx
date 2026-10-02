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
import {
  getBestSellers,
  getFlashDeals,
  getNewArrivals,
  getRecommendedProducts,
  getTrendingProducts,
} from "@/services/api/product.service";
import { listBrands, listCollections } from "@/services/api/category.service";

// rendered from live API data on each request, so a build never needs the backend
export const dynamic = "force-dynamic";

export default async function HomePage() {
  const [trending, deals, newArrivals, bestSellers, recommended, brands, collections] = await Promise.all([
    getTrendingProducts(12),
    getFlashDeals(),
    getNewArrivals(8),
    getBestSellers(8),
    getRecommendedProducts(8),
    listBrands(),
    listCollections(),
  ]);

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
