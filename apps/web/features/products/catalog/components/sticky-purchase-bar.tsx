"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { ShoppingBag, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCart } from "@/features/cart";
import type { CatalogProduct } from "../types";

interface StickyPurchaseBarProps {
  product: CatalogProduct;
  selectedColorHex: string;
}

export function StickyPurchaseBar({ product, selectedColorHex }: StickyPurchaseBarProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [cartFeedback, setCartFeedback] = useState(false);
  const { addItem } = useCart();

  useEffect(() => {
    const handleScroll = () => {
      // Show sticky bar once scrolled past 500px
      if (window.scrollY > 500) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const isOutOfStock = product.stock <= 0;
  const currentPrice = Number(product.price);
  const mainImage = product.images?.[0] || "";

  const handleQuickAdd = () => {
    addItem({
      id: product.id,
      productId: product.id,
      title: product.title,
      slug: product.slug,
      price: currentPrice,
      image: mainImage,
      stock: product.stock,
      categoryName: product.category?.name,
    });

    setCartFeedback(true);
    setTimeout(() => setCartFeedback(false), 3000);
  };

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-[#E5E2DC] shadow-xl py-3 px-4 sm:px-8 transition-all animate-in slide-in-from-bottom-5 duration-300">
      <div className="mx-auto max-w-[1440px] flex items-center justify-between gap-4">
        {/* Left Info: Thumbnail + Title + Price */}
        <div className="flex items-center gap-3 min-w-0">
          {mainImage && (
            <div className="relative size-12 rounded-lg overflow-hidden bg-[#F0EDE8] border border-[#E5E2DC] shrink-0 hidden sm:block">
              <Image
                src={mainImage}
                alt={product.title}
                fill
                sizes="48px"
                className="object-cover"
              />
            </div>
          )}

          <div className="min-w-0">
            <h4 className="text-sm font-semibold text-[#1A1A1A] truncate">
              {product.title}
            </h4>
            <div className="flex items-center gap-2 text-xs text-[#6B7280]">
              <span className="font-semibold text-[#1A1A1A]">
                ${currentPrice.toFixed(2)}
              </span>
              <span className="hidden sm:inline">•</span>
              <span className="hidden sm:flex items-center gap-1">
                Tone:
                <span
                  className="size-2.5 rounded-full inline-block border border-black/10"
                  style={{ backgroundColor: selectedColorHex }}
                />
              </span>
            </div>
          </div>
        </div>

        {/* Right CTA */}
        <div className="flex items-center gap-3 shrink-0">
          <Button
            type="button"
            onClick={handleQuickAdd}
            disabled={isOutOfStock}
            className="h-11 px-6 rounded-full bg-[#5D6B4D] hover:bg-[#4E5A40] text-white font-semibold text-sm gap-2 shadow-xs transition-colors cursor-pointer"
          >
            {cartFeedback ? (
              <>
                <Check className="size-4" /> Added to Bag
              </>
            ) : (
              <>
                <ShoppingBag className="size-4" /> {isOutOfStock ? "Sold Out" : "Add to Cart"}
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
