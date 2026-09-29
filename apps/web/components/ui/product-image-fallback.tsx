"use client";

import React, { useState } from "react";
import Image, { type ImageProps } from "next/image";
import { Armchair, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

interface ProductImageFallbackProps {
  productTitle?: string;
  className?: string;
  compact?: boolean;
}

/**
 * Elegant UrbanNest placeholder displayed when an image is unavailable or fails to load.
 */
export function ProductImageFallback({
  productTitle,
  className,
  compact = false,
}: ProductImageFallbackProps) {
  return (
    <div
      className={cn(
        "relative flex flex-col items-center justify-center text-center bg-[#F8F6F2] border border-[#E5E2DC] rounded-xl overflow-hidden p-4 select-none size-full",
        className
      )}
      role="img"
      aria-label={productTitle ? `Image unavailable for ${productTitle}` : "Image unavailable"}
    >
      {/* Background Decorative Pattern */}
      <div className="absolute inset-0 bg-[radial-gradient(#E5E2DC_1px,transparent_1px)] [background-size:16px_16px] opacity-40 pointer-events-none" />

      {/* Luxury Monogram / Furniture Icon */}
      <div className="relative z-10 flex size-12 sm:size-14 items-center justify-center rounded-2xl bg-white border border-[#E5E2DC] text-[#5D6B4D] shadow-2xs mb-2.5">
        <Armchair className="size-6 stroke-[1.5]" />
      </div>

      {/* Typography */}
      <div className="relative z-10 space-y-1 max-w-[220px]">
        <div className="flex items-center justify-center gap-1.5 text-[10px] uppercase tracking-[0.2em] font-semibold text-[#5D6B4D]">
          <Sparkles className="size-3" />
          <span>Studio Archive</span>
        </div>
        <p className="text-xs sm:text-sm font-heading font-medium text-[#1A1A1A] leading-tight line-clamp-1">
          {productTitle || "Architectural Piece"}
        </p>
        {!compact && (
          <p className="text-[11px] text-[#6B7280] font-light leading-snug">
            Image Unavailable. We&apos;re updating this product photo.
          </p>
        )}
      </div>
    </div>
  );
}

interface SafeProductImageProps extends Omit<ImageProps, "onError" | "src"> {
  src?: ImageProps["src"] | null;
  productTitle?: string;
  fallbackClassName?: string;
}

/**
 * Next.js Image wrapper with built-in onError detection and automatic fallback rendering.
 */
export function SafeProductImage({
  src,
  alt,
  productTitle,
  className,
  fallbackClassName,
  ...props
}: SafeProductImageProps) {
  const [hasError, setHasError] = useState(false);

  // If no source is provided or error occurred, show fallback immediately
  if (!src || src === "" || hasError) {
    return (
      <ProductImageFallback
        productTitle={productTitle || alt}
        className={cn(fallbackClassName, className)}
      />
    );
  }

  return (
    <Image
      src={src}
      alt={alt || productTitle || "Furniture Piece"}
      className={className}
      onError={() => setHasError(true)}
      {...props}
    />
  );
}

export default ProductImageFallback;
