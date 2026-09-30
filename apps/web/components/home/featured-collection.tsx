"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowRight, Heart, Star, ShoppingBag, Check } from "lucide-react";
import { MotionWrapper } from "./motion-wrapper";
import { formatINR } from "@/utils/currency";
import { SafeProductImage } from "@/components/ProductImageFallback";
import { useCart } from "@/features/cart";
import type { CatalogProduct } from "@/features/products/catalog/types";

interface FeaturedCollectionProps {
  products: CatalogProduct[];
}

export function FeaturedCollection({ products }: FeaturedCollectionProps) {
  const { addItem } = useCart();
  const [wishlist, setWishlist] = useState<Record<string, boolean>>({});
  const [addedIds, setAddedIds] = useState<Record<string, boolean>>({});

  if (!products || products.length === 0) {
    return null;
  }

  // Display up to 6 or 8 products in the grid matching the inspiration layout
  const displayItems = products.slice(0, 8);

  const toggleWishlist = (id: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setWishlist((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const handleQuickAdd = (product: CatalogProduct, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    addItem({
      id: product.id,
      productId: product.id,
      title: product.title,
      slug: product.slug,
      price: Number(product.price),
      image: product.image_url || product.images?.[0] || "",
      stock: product.stock,
      categoryName: product.category?.name,
    });

    setAddedIds((prev) => ({ ...prev, [product.id]: true }));
    setTimeout(() => {
      setAddedIds((prev) => ({ ...prev, [product.id]: false }));
    }, 1800);
  };

  return (
    <section className="pt-10 sm:pt-14 pb-12 sm:pb-16 bg-[#F8F6F2]">
      {/* Unified 1440px Master Container */}
      <div className="w-full max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
        <MotionWrapper>
          {/* Section Header Row (Full Width Alignment) */}
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8 sm:mb-10">
            <div>
              <span className="text-[11px] font-semibold uppercase tracking-[0.25em] text-[#5D6B4D] block mb-2">
                Our Picks
              </span>
              <h2 className="font-heading text-2xl sm:text-3xl lg:text-4xl font-normal text-[#1A1A1A] tracking-tight">
                Featured Products
              </h2>
              <p className="mt-1.5 text-xs sm:text-sm text-[#6B7280] font-light">
                Handpicked pieces loved by our customers.
              </p>
            </div>

            {/* View All Products Link (Aligned to exact right boundary) */}
            <Link
              href="/products"
              className="inline-flex items-center gap-2 text-xs sm:text-sm font-semibold text-[#1A1A1A] hover:text-[#5D6B4D] transition-colors group pb-1"
            >
              <span>VIEW ALL PRODUCTS</span>
              <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>

          {/* Product Cards Grid: 2 cols on mobile, 3 on tablet, 4 on desktop */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6 items-stretch">
            {displayItems.map((product, idx) => {
              const currentPrice = Number(product.price);
              const comparePrice = product.compare_at_price
                ? Number(product.compare_at_price)
                : null;
              const hasDiscount = Boolean(comparePrice && comparePrice > currentPrice);
              const discountPercent = hasDiscount
                ? Math.round(((comparePrice! - currentPrice) / comparePrice!) * 100)
                : 0;

              // Generate badge label matching the reference aesthetic
              let badgeText = "";
              if (hasDiscount) {
                badgeText = `-${discountPercent}%`;
              } else if (idx % 3 === 0) {
                badgeText = "NEW";
              } else if (idx % 3 === 1) {
                badgeText = "BEST SELLER";
              }

              const isWishlisted = Boolean(wishlist[product.id]);
              const isAdded = Boolean(addedIds[product.id]);
              const reviewCount = 35 + ((idx * 29) % 140);
              const rating = idx % 4 === 0 ? "4.8" : "4.9";
              const thumbnail = product.image_url || product.images?.[0] || "";

              return (
                <div
                  key={product.id}
                  className="group bg-white rounded-2xl border border-[#E5E2DC] p-3 sm:p-4 shadow-2xs hover:shadow-lg transition-all duration-300 flex flex-col justify-between h-full"
                >
                  {/* Image Container with Badges & Wishlist */}
                  <Link
                    href={`/products/${product.slug}`}
                    className="relative aspect-square sm:aspect-[4/5] w-full rounded-xl overflow-hidden bg-[#F0EDE8] block mb-3"
                  >
                    <SafeProductImage
                      src={thumbnail}
                      alt={product.title}
                      fill
                      sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                      className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]"
                    />

                    {/* Top-Left Badge */}
                    {badgeText && (
                      <span className="absolute top-2.5 left-2.5 z-10 px-2 py-0.5 rounded-full text-[10px] font-bold tracking-wider uppercase bg-[#1A1A1A]/85 text-white backdrop-blur-xs">
                        {badgeText}
                      </span>
                    )}

                    {/* Top-Right Wishlist Button */}
                    <button
                      type="button"
                      onClick={(e) => toggleWishlist(product.id, e)}
                      className={`absolute top-2.5 right-2.5 z-10 size-8 sm:size-9 rounded-full flex items-center justify-center transition-all shadow-2xs cursor-pointer ${
                        isWishlisted
                          ? "bg-rose-50 text-rose-600 border border-rose-200"
                          : "bg-white/90 text-[#6B7280] hover:text-[#1A1A1A] hover:bg-white border border-[#E5E2DC]"
                      }`}
                      aria-label={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
                    >
                      <Heart
                        className={`size-3.5 sm:size-4 transition-all ${
                          isWishlisted ? "fill-rose-600 stroke-rose-600" : "stroke-[1.75]"
                        }`}
                      />
                    </button>
                  </Link>

                  {/* Product Details */}
                  <div className="flex flex-col flex-1">
                    {/* Title */}
                    <Link href={`/products/${product.slug}`} className="block mb-1.5">
                      <h3 className="text-xs sm:text-sm font-medium text-[#1A1A1A] group-hover:text-[#5D6B4D] transition-colors line-clamp-1 leading-snug">
                        {product.title}
                      </h3>
                    </Link>

                    {/* Price Line */}
                    <div className="flex items-baseline gap-2 mb-2">
                      <span className="text-sm sm:text-base font-semibold text-[#1A1A1A]">
                        {formatINR(currentPrice)}
                      </span>
                      {hasDiscount && (
                        <span className="text-xs text-[#6B7280] line-through font-light">
                          {formatINR(comparePrice!)}
                        </span>
                      )}
                    </div>

                    {/* Star Rating Line & Quick Add Button */}
                    <div className="flex items-center justify-between pt-2 border-t border-[#E5E2DC]/60 mt-auto">
                      <div className="flex items-center gap-1">
                        <div className="flex items-center text-amber-400">
                          <Star className="size-3 fill-amber-400 text-amber-400" />
                          <Star className="size-3 fill-amber-400 text-amber-400" />
                          <Star className="size-3 fill-amber-400 text-amber-400" />
                          <Star className="size-3 fill-amber-400 text-amber-400" />
                          <Star className="size-3 fill-amber-400 text-amber-400" />
                        </div>
                        <span className="text-[11px] text-[#6B7280] ml-1">
                          ({reviewCount})
                        </span>
                      </div>

                      {/* Quick Add To Cart Button */}
                      <button
                        type="button"
                        onClick={(e) => handleQuickAdd(product, e)}
                        className={`size-8 sm:size-8.5 rounded-full flex items-center justify-center transition-all cursor-pointer shadow-2xs ${
                          isAdded
                            ? "bg-[#5D6B4D] text-white"
                            : "bg-[#F0EDE8] text-[#1A1A1A] hover:bg-[#5D6B4D] hover:text-white"
                        }`}
                        title="Add to cart"
                        aria-label={`Add ${product.title} to cart`}
                      >
                        {isAdded ? (
                          <Check className="size-3.5 stroke-[2.5]" />
                        ) : (
                          <ShoppingBag className="size-3.5 stroke-[1.8]" />
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </MotionWrapper>
      </div>
    </section>
  );
}
