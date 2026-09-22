import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { getQueryClient } from "@/lib/query-client";
import { productQueryKeys } from "@/features/products/catalog/query-keys";
import { getProductBySlug, getRelatedProducts } from "@/features/products/catalog/api";
import { ProductDetailsView } from "@/features/products/catalog/components/product-details-view";
import { StorefrontNav } from "@/components/storefront-nav";
import { SiteFooter } from "@/components/home/site-footer";

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
    title: `${product.title} | UrbanNest Luxury Living`,
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

  // Prefetch product details into server query cache
  await queryClient.prefetchQuery({
    queryKey: productQueryKeys.detail(slug),
    queryFn: () => product,
  });

  // Prefetch related recommendations
  await queryClient.prefetchQuery({
    queryKey: productQueryKeys.related(slug, 4),
    queryFn: () => getRelatedProducts(slug, product.category_id, 4),
  });

  return (
    <div className="flex flex-col bg-[#F8F6F2]">
      <StorefrontNav />

      <main className="w-full max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 pt-6 sm:pt-8 lg:pt-10 pb-0">
        <HydrationBoundary state={dehydrate(queryClient)}>
          <ProductDetailsView slug={slug} />
        </HydrationBoundary>
      </main>

      <SiteFooter />
    </div>
  );
}
