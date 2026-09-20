import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { getQueryClient } from "@/lib/query-client";
import { productQueryKeys } from "@/features/products/catalog/query-keys";
import { getProductBySlug } from "@/features/products/catalog/api";
import { ProductDetailsView } from "@/features/products/catalog/components/product-details-view";
import { StorefrontNav } from "@/components/storefront-nav";

interface ProductDetailPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({
  params,
}: ProductDetailPageProps): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product) {
    return {
      title: "Product Not Found | UrbanNest",
      description: "The requested furniture piece could not be located.",
    };
  }

  const thumbnail = product.images?.[0];

  return {
    title: `${product.title} | UrbanNest Design Studio`,
    description: product.description.slice(0, 160),
    openGraph: {
      title: `${product.title} | UrbanNest`,
      description: product.description.slice(0, 160),
      images: thumbnail ? [{ url: thumbnail }] : [],
    },
  };
}

export const dynamic = "force-dynamic";

export default async function ProductDetailPage({
  params,
}: ProductDetailPageProps) {
  const { slug } = await params;
  const queryClient = getQueryClient();

  const product = await getProductBySlug(slug);

  if (!product) {
    notFound();
  }

  // Prefetch into server query cache for instant initial paint
  await queryClient.prefetchQuery({
    queryKey: productQueryKeys.detail(slug),
    queryFn: () => product,
  });

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <StorefrontNav />

      <main className="container mx-auto max-w-7xl flex-1 px-4 sm:px-6 py-10">
        <HydrationBoundary state={dehydrate(queryClient)}>
          <ProductDetailsView slug={slug} />
        </HydrationBoundary>
      </main>
    </div>
  );
}
