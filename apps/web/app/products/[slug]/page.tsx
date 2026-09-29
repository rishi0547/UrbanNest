import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { getQueryClient } from "@/lib/query-client";
import { productQueryKeys } from "@/features/products/catalog/query-keys";
import { getProductBySlug, getRelatedProducts } from "@/features/products/catalog/api";
import { ProductDetailsView } from "@/features/products/catalog/components/product-details-view";
import { StorefrontNav } from "@/components/storefront-nav";
import { SiteFooter } from "@/components/home/site-footer";

import { siteConfig } from "@/lib/site-config";

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
      title: "Piece Not Found",
      description: "The requested architectural living piece could not be located in our catalog archive.",
      robots: {
        index: false,
        follow: false,
      },
    };
  }

  const title = product.title;
  const description =
    product.description?.slice(0, 160) ||
    `Handcrafted ${product.title} in premium natural finishes. Designed for architectural comfort and contemporary living.`;
  const thumbnail = product.images?.[0] || siteConfig.ogImage;
  const canonicalUrl = `/products/${product.slug}`;

  return {
    title: title,
    description: description,
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title: `${title} | UrbanNest`,
      description: description,
      url: canonicalUrl,
      type: "website",
      siteName: "UrbanNest",
      images: [
        {
          url: thumbnail,
          alt: `${title} - UrbanNest Handcrafted Furniture`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: `${title} | UrbanNest`,
      description: description,
      images: [thumbnail],
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

  const productJsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.title,
    description: product.description,
    image: product.images && product.images.length > 0 ? product.images : [siteConfig.ogImage],
    category: product.category?.name,
    brand: {
      "@type": "Brand",
      name: "UrbanNest",
    },
    offers: {
      "@type": "Offer",
      price: product.price,
      priceCurrency: "INR",
      availability:
        product.stock > 0
          ? "https://schema.org/InStock"
          : "https://schema.org/OutOfStock",
      url: `${siteConfig.url.replace(/\/+$/, "")}/products/${product.slug}`,
    },
  };

  return (
    <div className="flex flex-col bg-[#F8F6F2]">
      {/* Schema.org Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productJsonLd) }}
      />

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
