# Vercel Deployment Fix for NovaMart Frontend

## Issue Diagnosis

Your Vercel deployment is failing with `404 DEPLOYMENT_NOT_FOUND` because of several critical issues:

### 1. **Build-Time API Dependency (CRITICAL)**
The homepage (`src/app/(store)/page.tsx`) has:
```typescript
export const dynamic = "force-dynamic";
```

This is configured as a Server Component that makes API calls during build, but your backend API isn't available during Vercel's build process. This causes the build to fail.

### 2. **Missing Environment Variables**
The frontend expects `NEXT_PUBLIC_API_BASE_URL` to be set, but Vercel doesn't have this configured.

### 3. **Build Configuration Issues**
No `vercel.json` to specify build settings for the monorepo structure.

---

## Solution: Quick Fixes

### Fix 1: Make Homepage Build-Safe (REQUIRED)

Update `src/app/(store)/page.tsx` to handle missing API gracefully:

```typescript
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

// Allow build to succeed even without backend
export const dynamic = "force-dynamic";

async function fetchDataSafely() {
  try {
    const [trending, deals, newArrivals, bestSellers, recommended, brands, collections] = await Promise.all([
      getTrendingProducts(12).catch(() => []),
      getFlashDeals().catch(() => []),
      getNewArrivals(6).catch(() => []),
      getBestSellers(6).catch(() => []),
      getRecommendedProducts(6).catch(() => []),
      listBrands().catch(() => []),
      listCollections().catch(() => []),
    ]);
    return { trending, deals, newArrivals, bestSellers, recommended, brands, collections };
  } catch (error) {
    console.error('Failed to fetch homepage data:', error);
    return {
      trending: [],
      deals: [],
      newArrivals: [],
      bestSellers: [],
      recommended: [],
      brands: [],
      collections: []
    };
  }
}

export default async function HomePage() {
  const { trending, deals, newArrivals, bestSellers, recommended, brands, collections } = await fetchDataSafely();

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
```

---

### Fix 2: Create `vercel.json` in Frontend Root

Create `Frontend/novamart-frontend/vercel.json`:

```json
{
  "buildCommand": "npm run build",
  "installCommand": "npm install",
  "framework": "nextjs",
  "outputDirectory": ".next"
}
```

---

### Fix 3: Configure Environment Variables in Vercel

1. Go to your Vercel dashboard: https://vercel.com/dashboard
2. Select your project (`novamart-v01`)
3. Go to **Settings** → **Environment Variables**
4. Add:
   - **Name**: `NEXT_PUBLIC_API_BASE_URL`
   - **Value**: `https://your-backend-api-url.com/api/v1` (or use a mock API for now)
   - **Environment**: Production, Preview, Development

**For development/testing without a backend**, you can temporarily use:
```
NEXT_PUBLIC_API_BASE_URL=https://api.mockserver.com/api/v1
```

---

### Fix 4: Update API Service Error Handling

Update your API services to handle errors gracefully. For example, in `src/services/api/product.service.ts`:

```typescript
export async function getTrendingProducts(limit = 12) {
  try {
    const response = await fetch(`${API_BASE_URL}/products?sort=trending&limit=${limit}`);
    if (!response.ok) {
      console.warn('API request failed:', response.status);
      return [];
    }
    return await response.json();
  } catch (error) {
    console.error('Failed to fetch trending products:', error);
    return [];
  }
}
```

---

## Alternative: Static Generation (RECOMMENDED)

For better performance and to avoid build-time API issues entirely, convert the homepage to use **Static Site Generation (SSG)** with **Client-Side Data Fetching**:

### Create `src/app/(store)/page.tsx` (Client-Side Version):

```typescript
"use client";

import { useEffect, useState } from "react";
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

export default function HomePage() {
  const [data, setData] = useState({
    trending: [],
    deals: [],
    newArrivals: [],
    bestSellers: [],
    recommended: [],
    brands: [],
    collections: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const [trending, deals, newArrivals, bestSellers, recommended, brands, collections] = await Promise.all([
          getTrendingProducts(12).catch(() => []),
          getFlashDeals().catch(() => []),
          getNewArrivals(6).catch(() => []),
          getBestSellers(6).catch(() => []),
          getRecommendedProducts(6).catch(() => []),
          listBrands().catch(() => []),
          listCollections().catch(() => []),
        ]);
        
        setData({ trending, deals, newArrivals, bestSellers, recommended, brands, collections });
      } catch (error) {
        console.error('Failed to load homepage data:', error);
      } finally {
        setLoading(false);
      }
    }
    
    loadData();
  }, []);

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  return (
    <div>
      <HeroCarousel />
      <CategoryQuickCards />
      <ProductRail title="Trending Products" subtitle="What everyone's adding to their cart right now" products={data.trending} viewAllHref="/shop?sort=bestselling" />
      <TrustStrip />
      <FlashDealsSection deals={data.deals} />
      <ProductRail title="New Arrivals" subtitle="Fresh drops, straight off the truck" products={data.newArrivals} viewAllHref="/shop?sort=newest" />
      <CollectionCards collections={data.collections} />
      <ProductRail title="Best Sellers" subtitle="Loved by thousands of customers" products={data.bestSellers} viewAllHref="/shop?sort=bestselling" />
      <PromoBanner />
      <ProductRail title="Recommended For You" subtitle="Based on trending items in your favorite categories" products={data.recommended} viewAllHref="/shop" />
      <BrandStrip brands={data.brands.filter((b) => b.featured)} />
      <RecentlyViewedSection />
      <div className="container-shell pb-10">
        <Newsletter />
      </div>
    </div>
  );
}
```

---

## Deployment Checklist

- [ ] Apply Fix 1: Make homepage build-safe with error handling
- [ ] Apply Fix 2: Create `vercel.json`
- [ ] Apply Fix 3: Add environment variables in Vercel dashboard
- [ ] Apply Fix 4: Update all API services with error handling
- [ ] Commit and push changes
- [ ] Trigger new deployment in Vercel
- [ ] Verify deployment at https://novamart-v01.vercel.app/

---

## Testing Deployment Locally

Before deploying to Vercel, test the build locally:

```bash
cd Frontend/novamart-frontend
npm run build
npm run start
```

If the build succeeds locally, it should deploy to Vercel.

---

## Root Cause Summary

The main issue is that your Next.js app tries to fetch data from your Spring Boot backend during the build process, but:

1. **Backend not accessible during build**: Vercel's build environment can't reach your local backend
2. **No error handling**: When API calls fail, the build crashes
3. **Server-side rendering on every request**: The `force-dynamic` setting makes every page load hit the API

**Solutions**:
- Add error handling to API calls
- Use client-side data fetching for dynamic content
- Or deploy your backend first and provide its URL to Vercel
- Or use static generation with ISR (Incremental Static Regeneration)

---

## Next Steps

1. Choose either the **Server-Side with Error Handling** or **Client-Side Fetching** approach
2. Apply the fixes
3. Push to GitHub
4. Vercel will automatically redeploy
5. Monitor the deployment logs in Vercel dashboard

If the deployment still fails, check the build logs in Vercel for specific error messages.
