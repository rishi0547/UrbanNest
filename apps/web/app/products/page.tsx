import type { Metadata } from "next";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { getQueryClient } from "@/lib/query-client";
import { productQueryKeys } from "@/features/products/catalog/query-keys";
import { getProducts, getCategories } from "@/features/products/catalog/api";
import { StorefrontNav } from "@/components/storefront-nav";
import { SiteFooter } from "@/components/home/site-footer";
import { CollectionHero } from "@/features/products/catalog/components/collection-hero";
import { ShopBySpace } from "@/features/products/catalog/components/shop-by-space";
import { CollectionHighlights } from "@/features/products/catalog/components/collection-highlights";
import { ProductGrid } from "@/features/products/catalog/components/product-grid";
import { BenefitsStrip } from "@/features/products/catalog/components/benefits-strip";
import { CatalogShowcaseSection } from "@/features/products/catalog/components/catalog-showcase-section";
import { InspirationShowcase } from "@/features/products/catalog/components/inspiration-showcase";
import {
  NEW_ARRIVALS_PRODUCTS,
  BEST_SELLERS_PRODUCTS,
} from "@/features/products/catalog/catalog-data";

export const metadata: Metadata = {
  title: "Architectural Living Catalog | UrbanNest Luxury Living",
  description:
    "Explore handcrafted Scandinavian and Japanese modern furniture. Solid hardwoods, organic textiles, and timeless silhouettes for inspired living spaces.",
};

export const dynamic = "force-dynamic";

export default async function ProductsPage() {
  const queryClient = getQueryClient();

  // Prefetch products and categories into server query cache for instant first paint
  await Promise.all([
    queryClient.prefetchQuery({
      queryKey: productQueryKeys.list({}),
      queryFn: () => getProducts({}),
    }),
    queryClient.prefetchQuery({
      queryKey: productQueryKeys.categories(),
      queryFn: () => getCategories(),
    }),
  ]);

  return (
    <div className="flex flex-col bg-[#F8F6F2] min-h-screen text-[#1A1A1A]">
      {/* 1. Global Storefront Navigation */}
      <StorefrontNav />

      {/* 2. Section 1: Premium Collection Hero */}
      <CollectionHero />

      {/* 3. Section 2: Shop By Space */}
      <ShopBySpace />

      {/* 4. Section 3: Collection Highlights (3 Equal-Height Promotional Cards) */}
      <CollectionHighlights />

      {/* 5. Sections 4 & 5: Compact Filter Bar + Featured Pieces Product Grid */}
      <main className="w-full max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
        <HydrationBoundary state={dehydrate(queryClient)}>
          <ProductGrid />
        </HydrationBoundary>
      </main>

      {/* 6. Section 6: Benefits Strip (Full-Width Trust Strip) */}
      <BenefitsStrip />

      {/* 7. Section 7: New Arrivals */}
      <CatalogShowcaseSection
        kicker="Just Released"
        title="New Arrivals"
        subtitle="Recent studio releases crafted with sculptured lines and artisan joinery."
        products={NEW_ARRIVALS_PRODUCTS}
        viewAllLabel="View All New Arrivals"
      />

      {/* 8. Section 8: Best Sellers */}
      <CatalogShowcaseSection
        kicker="Studio Icons"
        title="Best Sellers"
        subtitle="Our most coveted furniture staples, celebrated by interior architects worldwide."
        products={BEST_SELLERS_PRODUCTS}
        viewAllLabel="View All Best Sellers"
      />

      {/* 9. Section 9: Inspiration Showcase (Editorial Magazine Feature) */}
      <InspirationShowcase />

      {/* 10. Global Site Footer */}
      <SiteFooter />
    </div>
  );
}
