"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Package, Sparkles, Star, Heart, ShoppingBag, Check } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useCart } from "@/features/cart";
import type { CatalogProduct } from "../types";

interface ProductCardProps {
  product: CatalogProduct;
  rating?: number;
}

export function ProductCard({ product, rating = 4.8 }: ProductCardProps) {
  const thumbnail = product.images?.[0];
  const isOutOfStock = product.stock <= 0;
  const isLowStock = product.stock > 0 && product.stock <= 5;
  const { addItem } = useCart();
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [isAdded, setIsAdded] = useState(false);

  const currentPrice = Number(product.price);
  const comparePrice = product.compare_at_price ? Number(product.compare_at_price) : null;
  const hasDiscount = comparePrice && comparePrice > currentPrice;
  const savings = hasDiscount ? comparePrice - currentPrice : 0;
  const savingsPercent = hasDiscount ? Math.round((savings / comparePrice) * 100) : 0;

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    addItem({
      id: product.id,
      productId: product.id,
      title: product.title,
      slug: product.slug,
      price: currentPrice,
      image: thumbnail || "",
      stock: product.stock,
      categoryName: product.category?.name,
    });

    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 2200);
  };

  return (
    <div className="group relative bg-white rounded-2xl border border-[#E5E2DC] p-3.5 sm:p-4 shadow-2xs hover:shadow-lg transition-all duration-500 flex flex-col justify-between h-full">
      {/* 1. Image Container with Badges & Wishlist Button */}
      <Link
        href={`/products/${product.slug}`}
        className="relative aspect-[4/5] w-full rounded-xl overflow-hidden bg-[#F0EDE8] block mb-3.5"
      >
        {thumbnail ? (
          <Image
            src={thumbnail}
            alt={product.title}
            fill
            unoptimized
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
            className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-[#6B7280]">
            <Package className="size-10" />
          </div>
        )}

        {/* Top-Left Floating Badges */}
        <div className="absolute top-2.5 left-2.5 flex flex-col gap-1.5 z-10 pointer-events-none">
          {product.category && (
            <Badge
              variant="secondary"
              className="bg-white/95 backdrop-blur-xs text-[#1A1A1A] text-[11px] font-semibold px-2.5 py-0.5 shadow-2xs border border-[#E5E2DC]"
            >
              {product.category.name}
            </Badge>
          )}
          {product.is_featured && (
            <Badge className="bg-[#D4A373] text-white text-[10px] font-semibold px-2 py-0.5 shadow-2xs gap-1">
              <Sparkles className="size-2.5" />
              Featured
            </Badge>
          )}
          {hasDiscount && (
            <Badge className="bg-[#5D6B4D] text-white text-[10px] font-bold px-2 py-0.5 shadow-2xs">
              Save {savingsPercent}%
            </Badge>
          )}
        </div>

        {/* Top-Right Wishlist Button */}
        <button
          type="button"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            setIsWishlisted(!isWishlisted);
          }}
          className={`absolute top-2.5 right-2.5 z-10 size-8 rounded-full border flex items-center justify-center transition-all cursor-pointer shadow-2xs ${
            isWishlisted
              ? "border-rose-300 bg-rose-50 text-rose-600 scale-105"
              : "border-[#E5E2DC] bg-white/90 text-[#6B7280] hover:text-[#1A1A1A] hover:bg-white"
          }`}
          title={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
        >
          <Heart
            className={`size-3.5 transition-all ${
              isWishlisted ? "fill-rose-600 stroke-rose-600" : "stroke-[1.75]"
            }`}
          />
        </button>

        {/* Out of Stock Overlay */}
        {isOutOfStock && (
          <div className="absolute inset-0 z-20 flex items-center justify-center bg-[#F8F6F2]/80 backdrop-blur-xs">
            <span className="rounded-full border border-[#E5E2DC] bg-[#1A1A1A] px-3.5 py-1 text-xs font-semibold uppercase tracking-wider text-white shadow-md">
              Sold Out
            </span>
          </div>
        )}
      </Link>

      {/* 2. Product Information */}
      <div className="flex flex-col flex-1">
        {/* Rating Line */}
        <div className="flex items-center gap-1.5 mb-1.5">
          <Star className="size-3 fill-amber-400 text-amber-400" />
          <span className="text-xs font-semibold text-[#1A1A1A]">{rating}</span>
          <span className="text-[11px] text-[#6B7280]">
            ({product.category?.name || "Design Studio"})
          </span>
        </div>

        {/* Product Title */}
        <Link href={`/products/${product.slug}`} className="block mb-1.5">
          <h3 className="font-heading text-sm sm:text-base font-normal text-[#1A1A1A] truncate group-hover:text-[#5D6B4D] transition-colors leading-snug">
            {product.title}
          </h3>
        </Link>

        {/* Pricing Line */}
        <div className="flex items-baseline gap-2 mb-3">
          <span className="text-sm sm:text-base font-semibold text-[#1A1A1A]">
            ${currentPrice.toFixed(2)}
          </span>
          {hasDiscount && (
            <span className="text-xs text-[#6B7280] line-through font-light">
              ${comparePrice.toFixed(2)}
            </span>
          )}
          {hasDiscount && (
            <span className="text-[10px] font-semibold text-[#5D6B4D] bg-[#5D6B4D]/10 px-1.5 py-0.5 rounded">
              -${savings.toFixed(0)}
            </span>
          )}
        </div>

        {/* Card Footer: Stock Status & Quick Add Button */}
        <div className="flex items-center justify-between gap-2 pt-3 border-t border-[#E5E2DC]/70 mt-auto">
          {/* Stock Status Pill */}
          <div>
            {isOutOfStock ? (
              <span className="text-[11px] font-semibold text-rose-600">
                Out of Stock
              </span>
            ) : isLowStock ? (
              <span className="inline-flex items-center gap-1 text-[11px] font-medium text-amber-600">
                <span className="size-1.5 rounded-full bg-amber-500 animate-ping" />
                Only {product.stock} left
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 text-[11px] font-medium text-emerald-700">
                <span className="size-1.5 rounded-full bg-emerald-600" />
                In Stock
              </span>
            )}
          </div>

          {/* Quick Add Button */}
          <Button
            type="button"
            size="xs"
            onClick={handleAddToCart}
            disabled={isOutOfStock}
            className="rounded-full bg-[#F8F6F2] hover:bg-[#5D6B4D] text-[#1A1A1A] hover:text-white border border-[#E5E2DC] text-xs font-semibold px-3 py-1.5 transition-colors gap-1.5 shadow-2xs cursor-pointer"
          >
            {isAdded ? (
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
  );
}
