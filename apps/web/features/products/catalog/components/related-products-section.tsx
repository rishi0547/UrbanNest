"use client";

import { useState } from "react";
import Link from "next/link";
import { Star, Heart, ShoppingBag, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCart } from "@/features/cart";
import { formatINR } from "@/utils/currency";
import { SafeProductImage } from "@/components/ProductImageFallback";
import { useRelatedProducts } from "../queries";
import type { CatalogProduct } from "../types";

interface RelatedProductsSectionProps {
  currentProduct: CatalogProduct;
}

export function RelatedProductsSection({ currentProduct }: RelatedProductsSectionProps) {
  const { data: dbRelated, isLoading } = useRelatedProducts(
    currentProduct.slug,
    currentProduct.category_id,
    4
  );

  const { addItem } = useCart();
  const [quickAddedId, setQuickAddedId] = useState<string | null>(null);

  if (isLoading) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="h-8 w-48 rounded bg-[#E5E2DC]" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {Array.from({ length: 4 }).map((_, idx) => (
            <div key={idx} className="h-72 rounded-2xl bg-[#E5E2DC]/50" />
          ))}
        </div>
      </div>
    );
  }

  if (!dbRelated || dbRelated.length === 0) {
    return null;
  }

  const displayProducts = dbRelated.slice(0, 4).map((real, idx) => ({
    id: real.id,
    title: real.title,
    slug: real.slug,
    price: Number(real.price),
    rating: idx % 2 === 0 ? 4.9 : 4.8,
    image: real.image_url || real.images?.[0] || "",
    colors: ["#5D6B4D", "#D4C5A9", "#3E3B36"],
    categoryName: real.category?.name || "Architectural Piece",
    stock: real.stock,
  }));

  const handleQuickAdd = (product: typeof displayProducts[0]) => {
    addItem({
      id: product.id,
      productId: product.id,
      title: product.title,
      slug: product.slug,
      price: product.price,
      image: product.image,
      stock: product.stock,
      categoryName: product.categoryName,
    });

    setQuickAddedId(product.id);
    setTimeout(() => setQuickAddedId(null), 2500);
  };

  return (
    <section className="space-y-6 sm:space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 border-b border-[#E5E2DC] pb-4">
        <div>
          <span className="text-[11px] font-semibold uppercase tracking-[0.25em] text-[#5D6B4D]">
            Curated Pairings
          </span>
          <h2 className="font-heading text-2xl sm:text-3xl font-normal text-[#1A1A1A] mt-1">
            You May Also Like
          </h2>
        </div>
        <Link
          href="/products"
          className="text-xs font-semibold text-[#5D6B4D] hover:underline"
        >
          View Full Catalog &rarr;
        </Link>
      </div>

      {/* 4 Cards Grid matching homepage cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 items-stretch">
        {displayProducts.map((item) => (
          <div
            key={item.id}
            className="group bg-white rounded-2xl border border-[#E5E2DC] p-4 shadow-2xs hover:shadow-lg transition-all duration-500 flex flex-col justify-between"
          >
            {/* Image Container with Subtle Zoom */}
            <Link
              href={`/products/${item.slug}`}
              className="relative aspect-[4/5] w-full rounded-xl overflow-hidden bg-[#F0EDE8] block mb-3.5"
            >
              <SafeProductImage
                src={item.image}
                alt={item.title}
                fill
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03]"
              />

              {/* Wishlist Button */}
              <button
                type="button"
                className="absolute top-3 right-3 z-10 size-8 rounded-full bg-white/90 backdrop-blur-xs flex items-center justify-center text-[#6B7280] hover:text-rose-600 transition-colors shadow-2xs cursor-pointer"
                title="Add to wishlist"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                }}
              >
                <Heart className="size-3.5 stroke-[1.75]" />
              </button>
            </Link>

            {/* Content & Metadata */}
            <div className="flex flex-col flex-1">
              {/* Rating */}
              <div className="flex items-center gap-1.5 mb-2">
                <Star className="size-3 fill-amber-400 text-amber-400" />
                <span className="text-xs font-medium text-[#1A1A1A]">
                  {item.rating}
                </span>
                <span className="text-[11px] text-[#6B7280] ml-1">
                  ({item.categoryName})
                </span>
              </div>

              {/* Title */}
              <Link href={`/products/${item.slug}`} className="block mb-1.5">
                <h3 className="text-sm sm:text-[15px] font-medium text-[#1A1A1A] truncate group-hover:text-[#5D6B4D] transition-colors leading-snug">
                  {item.title}
                </h3>
              </Link>

              {/* Price */}
              <p className="text-sm sm:text-[15px] font-semibold text-[#1A1A1A] mb-3">
                {formatINR(item.price)}
              </p>

              {/* Color Swatches & Quick Add Button */}
              <div className="flex items-center justify-between gap-2 pt-3 border-t border-[#E5E2DC]/60 mt-auto">
                <div className="flex items-center gap-1.5">
                  {item.colors.map((color, cIdx) => (
                    <span
                      key={cIdx}
                      className="size-2.5 rounded-full border border-black/10"
                      style={{ backgroundColor: color }}
                    />
                  ))}
                </div>

                <Button
                  type="button"
                  size="xs"
                  onClick={() => handleQuickAdd(item)}
                  className="rounded-full bg-[#F8F6F2] hover:bg-[#5D6B4D] text-[#1A1A1A] hover:text-white border border-[#E5E2DC] text-xs font-semibold px-3 py-1.5 transition-colors gap-1 shadow-2xs cursor-pointer"
                >
                  {quickAddedId === item.id ? (
                    <>
                      <Check className="size-3 text-emerald-600" /> Added
                    </>
                  ) : (
                    <>
                      <ShoppingBag className="size-3" /> Quick Add
                    </>
                  )}
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
