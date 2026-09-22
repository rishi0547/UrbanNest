"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Star,
  ShoppingBag,
  Heart,
  Check,
  ChevronRight,
  Zap,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useCart } from "@/features/cart";
import type { CatalogProduct } from "../types";

interface ProductInfoPanelProps {
  product: CatalogProduct;
  onTabSelect?: (tabId: string) => void;
  selectedColorHex: string;
  onColorChange: (hex: string) => void;
}

export const FABRICS = [
  { id: "boucle", name: "Bouclé", desc: "Textured & Plush", badge: "Most Popular" },
  { id: "linen", name: "Belgian Linen", desc: "Breathable & Organic" },
  { id: "velvet", name: "Performance Velvet", desc: "Stain-Resistant & Rich" },
];

export const COLOR_SWATCHES = [
  { id: "oatmeal", name: "Oatmeal Sand", hex: "#E8E3DA" },
  { id: "olive", name: "Forest Olive", hex: "#5D6B4D" },
  { id: "charcoal", name: "Warm Charcoal", hex: "#2B2B2A" },
  { id: "terracotta", name: "Sunbaked Terracotta", hex: "#B86B52" },
  { id: "ochre", name: "Amber Ochre", hex: "#C49258" },
];

export const WOOD_FINISHES = [
  { id: "natural-oak", name: "Natural Oak" },
  { id: "smoked-walnut", name: "Smoked Walnut" },
  { id: "ebonized-ash", name: "Ebonized Ash" },
];

export function ProductInfoPanel({
  product,
  onTabSelect,
  selectedColorHex,
  onColorChange,
}: ProductInfoPanelProps) {
  const router = useRouter();
  const { addItem } = useCart();

  const [selectedFabric, setSelectedFabric] = useState(FABRICS[0]!.id);
  const [selectedWood, setSelectedWood] = useState(WOOD_FINISHES[0]!.id);
  const [quantity, setQuantity] = useState(1);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [cartNotice, setCartNotice] = useState(false);

  const isOutOfStock = product.stock <= 0;
  const isLowStock = product.stock > 0 && product.stock <= 5;

  const currentPrice = Number(product.price);
  const comparePrice = product.compare_at_price ? Number(product.compare_at_price) : null;
  const savings = comparePrice && comparePrice > currentPrice ? comparePrice - currentPrice : null;
  const savingsPercent = comparePrice && comparePrice > currentPrice
    ? Math.round(((comparePrice - currentPrice) / comparePrice) * 100)
    : null;

  const activeColor = COLOR_SWATCHES.find((s) => s.hex === selectedColorHex) || COLOR_SWATCHES[0]!;
  const activeFabric = FABRICS.find((f) => f.id === selectedFabric) || FABRICS[0]!;
  const activeWood = WOOD_FINISHES.find((w) => w.id === selectedWood) || WOOD_FINISHES[0]!;

  const handleAddToCart = () => {
    const mainImage = product.images?.[0] || "";
    addItem(
      {
        id: product.id,
        productId: product.id,
        title: `${product.title} (${activeFabric.name}, ${activeColor.name})`,
        slug: product.slug,
        price: currentPrice,
        image: mainImage,
        stock: product.stock,
        categoryName: product.category?.name,
      },
      quantity
    );

    setCartNotice(true);
    setTimeout(() => setCartNotice(false), 5000);
  };

  const handleBuyNow = () => {
    handleAddToCart();
    router.push("/checkout");
  };

  return (
    <div className="flex flex-col space-y-4 sm:space-y-5">
      {/* 1. Breadcrumb Hierarchy */}
      <nav className="flex items-center gap-1.5 text-xs text-[#6B7280] flex-wrap">
        <Link href="/" className="hover:text-[#1A1A1A] transition-colors">
          Home
        </Link>
        <ChevronRight className="size-3 text-[#6B7280]/60" />
        <Link href="/products" className="hover:text-[#1A1A1A] transition-colors">
          Catalog
        </Link>
        {product.category && (
          <>
            <ChevronRight className="size-3 text-[#6B7280]/60" />
            <Link
              href={`/products?category=${product.category.slug}`}
              className="hover:text-[#1A1A1A] transition-colors"
            >
              {product.category.name}
            </Link>
          </>
        )}
        <ChevronRight className="size-3 text-[#6B7280]/60" />
        <span className="text-[#1A1A1A] font-medium truncate max-w-[220px]">
          {product.title}
        </span>
      </nav>

      {/* 2. Header & Title Area */}
      <div className="space-y-2">
        {/* Category & SKU Line */}
        <div className="flex items-center justify-between gap-4">
          <span className="text-[11px] font-semibold uppercase tracking-[0.25em] text-[#5D6B4D]">
            {product.category?.name || "Exclusive Collection"}
          </span>
          <span className="text-xs font-mono text-[#6B7280] tracking-wider">
            SKU: UN-{product.id.slice(0, 6).toUpperCase()}
          </span>
        </div>

        {/* Large Luxury Title (48-52px) */}
        <h1 className="font-heading text-3xl sm:text-4xl lg:text-[44px] xl:text-[48px] font-normal leading-[1.08] tracking-tight text-[#1A1A1A]">
          {product.title}
        </h1>

        {/* Reviews & Social Proof Line */}
        <div className="flex items-center gap-3 pt-1">
          <button
            type="button"
            onClick={() => onTabSelect?.("reviews")}
            className="flex items-center gap-1.5 group cursor-pointer"
          >
            <div className="flex items-center gap-0.5">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="size-3.5 fill-amber-400 text-amber-400" />
              ))}
            </div>
            <span className="text-xs font-semibold text-[#1A1A1A]">4.9</span>
            <span className="text-xs text-[#6B7280] underline group-hover:text-[#5D6B4D] transition-colors">
              (128 verified reviews)
            </span>
          </button>
          <span className="text-[#E5E2DC]">•</span>
          <button
            type="button"
            onClick={() => onTabSelect?.("reviews")}
            className="text-xs text-[#5D6B4D] hover:underline font-medium cursor-pointer"
          >
            Write a Review
          </button>
        </div>
      </div>

      {/* 3. Pricing & Savings Area */}
      <div className="flex items-baseline flex-wrap gap-3 pb-4 border-b border-[#E5E2DC]">
        <span className="text-3xl sm:text-4xl font-semibold tracking-tight text-[#1A1A1A]">
          ${currentPrice.toFixed(2)}
        </span>

        {comparePrice && comparePrice > currentPrice && (
          <span className="text-xl text-[#6B7280] line-through font-light">
            ${comparePrice.toFixed(2)}
          </span>
        )}

        {savings && (
          <Badge className="bg-[#5D6B4D]/10 text-[#5D6B4D] border border-[#5D6B4D]/25 font-semibold text-xs px-2.5 py-1">
            Save ${savings.toFixed(0)} ({savingsPercent}%)
          </Badge>
        )}

        {/* Availability Badge */}
        <div className="ml-auto">
          {isOutOfStock ? (
            <Badge variant="destructive" className="text-xs font-semibold">
              Currently Out of Stock
            </Badge>
          ) : isLowStock ? (
            <span className="inline-flex items-center gap-1.5 text-xs font-medium text-amber-600">
              <span className="size-2 rounded-full bg-amber-500 animate-ping" />
              Only {product.stock} left in studio
            </span>
          ) : (
            <span className="inline-flex items-center gap-1.5 text-xs font-medium text-emerald-700">
              <span className="size-2 rounded-full bg-emerald-600" />
              In Stock & Ready to Ship
            </span>
          )}
        </div>
      </div>

      {/* 4. Structured Product Overview */}
      <div className="space-y-2 py-0.5">
        <p className="text-sm text-[#4A4A4A] leading-relaxed font-light line-clamp-3">
          {product.description}
        </p>
        <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-[#6B7280]">
          <span>
            <strong className="text-[#1A1A1A] font-medium">Materials:</strong> FSC® Hardwood & Foam
          </span>
          <span>
            <strong className="text-[#1A1A1A] font-medium">Joinery:</strong> Mortise-and-Tenon
          </span>
          <span>
            <strong className="text-[#1A1A1A] font-medium">Dimensions:</strong> 88"W &times; 38"D &times; 32"H
          </span>
        </div>
      </div>

      {/* 5. Variant Selectors */}
      <div className="space-y-5 pt-2 border-t border-[#E5E2DC]">
        {/* Fabric Selection */}
        <div className="space-y-2.5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-[#1A1A1A]">
              Upholstery Fabric: <strong className="font-semibold">{activeFabric.name}</strong>
            </span>
            <span className="text-[11px] text-[#6B7280]">{activeFabric.desc}</span>
          </div>
          <div className="grid grid-cols-3 gap-2.5">
            {FABRICS.map((fabric) => (
              <button
                key={fabric.id}
                type="button"
                onClick={() => setSelectedFabric(fabric.id)}
                className={`flex flex-col items-start p-3 rounded-xl border text-left transition-all cursor-pointer ${
                  selectedFabric === fabric.id
                    ? "border-[#5D6B4D] bg-[#5D6B4D]/5 ring-1 ring-[#5D6B4D] shadow-2xs"
                    : "border-[#E5E2DC] bg-white hover:border-[#5D6B4D]/40"
                }`}
              >
                <div className="flex items-center justify-between w-full">
                  <span className="text-xs font-semibold text-[#1A1A1A]">{fabric.name}</span>
                  {selectedFabric === fabric.id && (
                    <Check className="size-3.5 text-[#5D6B4D]" />
                  )}
                </div>
                <span className="text-[11px] text-[#6B7280] mt-0.5">{fabric.desc}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Color Swatches */}
        <div className="space-y-2.5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-[#1A1A1A]">
              Color Tone: <strong className="font-semibold">{activeColor.name}</strong>
            </span>
          </div>
          <div className="flex items-center gap-3">
            {COLOR_SWATCHES.map((swatch) => {
              const isSelected = swatch.hex === selectedColorHex;
              return (
                <button
                  key={swatch.id}
                  type="button"
                  onClick={() => onColorChange(swatch.hex)}
                  className={`group relative size-10 rounded-full transition-all cursor-pointer flex items-center justify-center ${
                    isSelected
                      ? "ring-2 ring-[#5D6B4D] ring-offset-2 scale-110 shadow-xs"
                      : "hover:scale-105 border border-black/15 opacity-85 hover:opacity-100"
                  }`}
                  style={{ backgroundColor: swatch.hex }}
                  title={swatch.name}
                >
                  {isSelected && (
                    <Check
                      className={`size-4 ${
                        swatch.hex === "#E8E3DA" ? "text-black" : "text-white"
                      }`}
                    />
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Wood Finish Selection */}
        <div className="space-y-2.5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-[#1A1A1A]">
              Wood Base Finish: <strong className="font-semibold">{activeWood.name}</strong>
            </span>
          </div>
          <div className="flex flex-wrap gap-2">
            {WOOD_FINISHES.map((wood) => (
              <button
                key={wood.id}
                type="button"
                onClick={() => setSelectedWood(wood.id)}
                className={`px-3.5 py-2 rounded-lg text-xs font-medium border transition-all cursor-pointer ${
                  selectedWood === wood.id
                    ? "border-[#5D6B4D] bg-[#5D6B4D]/10 text-[#5D6B4D] font-semibold"
                    : "border-[#E5E2DC] bg-white text-[#1A1A1A] hover:bg-[#F0EDE8]"
                }`}
              >
                {wood.name}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* 6. Quantity & Purchase Section */}
      <div className="space-y-3 pt-3 border-t border-[#E5E2DC]">
        <div className="flex items-center gap-3">
          {/* Quantity Selector */}
          <div className="flex items-center rounded-full border border-[#E5E2DC] bg-white p-1 shadow-2xs shrink-0">
            <button
              type="button"
              onClick={() => setQuantity(Math.max(1, quantity - 1))}
              disabled={isOutOfStock || quantity <= 1}
              className="size-10 rounded-full flex items-center justify-center text-sm font-semibold text-[#1A1A1A] hover:bg-[#F0EDE8] disabled:opacity-30 transition-colors cursor-pointer"
              title="Decrease quantity"
            >
              -
            </button>
            <span className="w-10 text-center text-sm font-semibold text-[#1A1A1A] select-none">
              {quantity}
            </span>
            <button
              type="button"
              onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
              disabled={isOutOfStock || quantity >= product.stock}
              className="size-10 rounded-full flex items-center justify-center text-sm font-semibold text-[#1A1A1A] hover:bg-[#F0EDE8] disabled:opacity-30 transition-colors cursor-pointer"
              title="Increase quantity"
            >
              +
            </button>
          </div>

          {/* Primary Add to Cart Button */}
          <Button
            type="button"
            onClick={handleAddToCart}
            disabled={isOutOfStock}
            className="flex-1 h-12 rounded-full bg-[#5D6B4D] hover:bg-[#4E5A40] text-white font-semibold text-sm sm:text-base gap-2 shadow-xs transition-colors cursor-pointer"
          >
            <ShoppingBag className="size-4" />
            {isOutOfStock ? "Sold Out" : `Add to Cart • $${(currentPrice * quantity).toFixed(2)}`}
          </Button>

          {/* Wishlist Button */}
          <button
            type="button"
            onClick={() => setIsWishlisted(!isWishlisted)}
            className={`size-12 rounded-full border flex items-center justify-center transition-all cursor-pointer shrink-0 ${
              isWishlisted
                ? "border-rose-300 bg-rose-50 text-rose-600 shadow-xs"
                : "border-[#E5E2DC] bg-white text-[#6B7280] hover:text-[#1A1A1A] hover:bg-[#F0EDE8]"
            }`}
            title={isWishlisted ? "Remove from Wishlist" : "Add to Wishlist"}
          >
            <Heart
              className={`size-5 transition-transform ${
                isWishlisted ? "fill-rose-600 scale-110" : "stroke-[1.6]"
              }`}
            />
          </button>
        </div>

        {/* Secondary Instant Buy Now Button */}
        <Button
          type="button"
          variant="outline"
          onClick={handleBuyNow}
          disabled={isOutOfStock}
          className="w-full h-12 rounded-full border-[#1A1A1A] bg-white text-[#1A1A1A] hover:bg-[#1A1A1A] hover:text-white font-semibold text-sm transition-all gap-2 cursor-pointer"
        >
          <Zap className="size-4" />
          Buy Now with 1-Click Checkout
        </Button>

        {/* Added to Cart Toast Feedback */}
        {cartNotice && (
          <div className="rounded-xl border border-[#5D6B4D]/30 bg-[#5D6B4D]/10 p-3.5 text-xs text-[#5D6B4D] flex items-center justify-between gap-3 animate-in fade-in slide-in-from-top-2 duration-300">
            <div className="flex items-center gap-2 min-w-0">
              <Check className="size-4 shrink-0 text-[#5D6B4D]" />
              <span className="truncate">
                Added <strong>{quantity} &times; {product.title}</strong> to your shopping bag!
              </span>
            </div>
            <Link href="/cart">
              <Button size="xs" className="h-7 px-3 bg-[#5D6B4D] hover:bg-[#4E5A40] text-white text-xs font-semibold rounded-full shrink-0">
                View Cart
              </Button>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
