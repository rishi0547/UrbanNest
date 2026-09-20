import type { Metadata } from "next";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { getQueryClient } from "@/lib/query-client";
import { productQueryKeys } from "@/features/products/catalog/query-keys";
import { getProducts, getCategories } from "@/features/products/catalog/api";
import { ProductGrid } from "@/features/products/catalog/components/product-grid";
import { StorefrontNav } from "@/components/storefront-nav";

export const metadata: Metadata = {
  title: "Furniture Catalog | UrbanNest Design Studio",
  description:
    "Explore handcrafted Scandinavian & Japanese inspired modern furniture. Solid woods, organic textiles, and timeless silhouettes.",
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
    <div className="min-h-screen flex flex-col bg-background">
      <StorefrontNav />

      <main className="container mx-auto max-w-7xl flex-1 px-4 sm:px-6 py-10 space-y-8">
        {/* Catalog Header */}
        <div className="space-y-2 border-b border-border/60 pb-6">
          <div className="inline-flex items-center rounded-full border border-primary/20 bg-primary/10 px-3 py-0.5 text-xs font-semibold text-primary">
            Curated Collections
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl text-foreground">
            Architectural Living Catalog
          </h1>
          <p className="text-sm text-muted-foreground max-w-2xl">
            Thoughtfully engineered furniture crafted for balance, comfort, and longevity.
            Filter by living space taxonomy or browse our curated studio signatures.
          </p>
        </div>

        {/* TanStack Query Hydration Boundary for Client Grid */}
        <HydrationBoundary state={dehydrate(queryClient)}>
          <ProductGrid />
        </HydrationBoundary>
      </main>
    </div>
  );
}
