"use client";

import { useState, useRef, MouseEvent } from "react";
import Image from "next/image";
import { Sparkles, Maximize2, X, ChevronLeft, ChevronRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import type { CatalogProduct } from "../types";

interface ProductGalleryProps {
  product: CatalogProduct;
  selectedColorHex?: string;
}

// Curated high-resolution detail and room scenes to supplement single-image products
const curatedLifestyleAdditions = [
  "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=1200&q=85&fit=crop", // styled room perspective
  "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=1200&q=85&fit=crop", // architectural living scene
  "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=1200&q=85&fit=crop", // detail carpentry / upholstery
  "https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?w=1200&q=85&fit=crop", // intimate armchair / texture
];

export function ProductGallery({ product }: ProductGalleryProps) {
  // Build a comprehensive gallery of at least 4-5 photos
  const rawImages = product.images && product.images.length > 0 ? product.images : [];
  const galleryImages = [
    ...rawImages,
    ...curatedLifestyleAdditions.slice(0, Math.max(0, 5 - rawImages.length)),
  ].filter(Boolean);

  const [activeIndex, setActiveIndex] = useState(0);
  const [isZoomed, setIsZoomed] = useState(false);
  const [zoomPos, setZoomPos] = useState({ x: 50, y: 50 });
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const imageContainerRef = useRef<HTMLDivElement>(null);

  const currentImage = galleryImages[activeIndex] || galleryImages[0] || "";

  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    if (!imageContainerRef.current) return;
    const { left, top, width, height } = imageContainerRef.current.getBoundingClientRect();
    const x = Math.max(0, Math.min(100, ((e.clientX - left) / width) * 100));
    const y = Math.max(0, Math.min(100, ((e.clientY - top) / height) * 100));
    setZoomPos({ x, y });
  };

  const handleNext = () => {
    setActiveIndex((prev) => (prev + 1) % galleryImages.length);
  };

  const handlePrev = () => {
    setActiveIndex((prev) => (prev - 1 + galleryImages.length) % galleryImages.length);
  };

  return (
    <div className="w-full flex flex-col-reverse md:flex-row gap-4 lg:gap-6">
      {/* Desktop Vertical Thumbnail Gallery (Left Side) */}
      <div className="flex md:flex-col gap-3 overflow-x-auto md:overflow-y-auto md:max-h-[640px] scrollbar-none shrink-0 py-1">
        {galleryImages.map((imgUrl, idx) => {
          const isActive = activeIndex === idx;
          return (
            <button
              key={idx}
              type="button"
              onClick={() => setActiveIndex(idx)}
              onMouseEnter={() => setActiveIndex(idx)}
              className={`relative w-16 h-16 sm:w-20 sm:h-20 lg:w-[84px] lg:h-[84px] rounded-xl overflow-hidden border-2 transition-all duration-200 cursor-pointer shrink-0 bg-[#F0EDE8] ${
                isActive
                  ? "border-[#5D6B4D] ring-2 ring-[#5D6B4D]/30 shadow-xs scale-[1.02]"
                  : "border-[#E5E2DC] opacity-75 hover:opacity-100 hover:border-[#5D6B4D]/60"
              }`}
              title={`View perspective ${idx + 1}`}
            >
              <Image
                src={imgUrl}
                alt={`${product.title} perspective ${idx + 1}`}
                fill
                sizes="88px"
                className="object-cover"
              />
            </button>
          );
        })}
      </div>

      {/* Main Showcase Image Area */}
      <div className="relative flex-1 min-w-0">
        <div
          ref={imageContainerRef}
          onMouseEnter={() => setIsZoomed(true)}
          onMouseLeave={() => setIsZoomed(false)}
          onMouseMove={handleMouseMove}
          className="relative aspect-[4/3] sm:aspect-[5/4] lg:aspect-[1.08/1] min-h-[440px] sm:min-h-[500px] lg:min-h-[620px] w-full rounded-2xl overflow-hidden bg-[#F0EDE8] border border-[#E5E2DC] shadow-xs cursor-crosshair select-none"
        >
          {currentImage ? (
            <Image
              src={currentImage}
              alt={product.title}
              fill
              priority
              sizes="(max-width: 1024px) 100vw, 55vw"
              className="object-cover transition-transform duration-200 ease-out"
              style={
                isZoomed
                  ? {
                      transformOrigin: `${zoomPos.x}% ${zoomPos.y}%`,
                      transform: "scale(1.75)",
                    }
                  : { transform: "scale(1)" }
              }
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-[#6B7280]">
              No image available
            </div>
          )}

          {/* Floating Badges */}
          <div className="absolute top-4 left-4 z-10 flex flex-wrap gap-2 pointer-events-none">
            {product.category && (
              <Badge
                variant="secondary"
                className="bg-white/90 backdrop-blur-md text-[#1A1A1A] text-xs font-semibold px-3 py-1 shadow-2xs border border-[#E5E2DC]"
              >
                {product.category.name}
              </Badge>
            )}
            {product.is_featured && (
              <Badge className="bg-[#D4A373] hover:bg-[#C49258] text-white text-xs font-medium px-3 py-1 shadow-2xs gap-1">
                <Sparkles className="size-3" />
                Curated Pick
              </Badge>
            )}
          </div>

          {/* Expand Lightbox Button */}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setLightboxOpen(true);
            }}
            className="absolute bottom-4 right-4 z-10 size-10 rounded-full bg-white/90 hover:bg-white text-[#1A1A1A] backdrop-blur-md flex items-center justify-center shadow-md border border-[#E5E2DC] transition-all hover:scale-105 cursor-pointer"
            title="Open fullscreen view"
          >
            <Maximize2 className="size-4" />
          </button>

          {/* Subtle Zoom Hint */}
          <div className="absolute bottom-4 left-4 z-10 hidden sm:block pointer-events-none">
            <span className="text-[11px] font-medium tracking-wide text-[#6B7280] bg-white/80 backdrop-blur-xs px-2.5 py-1 rounded-md border border-[#E5E2DC]/80 shadow-2xs">
              Roll over image to zoom
            </span>
          </div>
        </div>
      </div>

      {/* Fullscreen Lightbox Modal */}
      {lightboxOpen && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4 sm:p-8 animate-in fade-in duration-200"
          onClick={() => setLightboxOpen(false)}
        >
          {/* Close Button */}
          <button
            type="button"
            onClick={() => setLightboxOpen(false)}
            className="absolute top-6 right-6 z-50 size-11 rounded-full bg-white/15 hover:bg-white/30 text-white flex items-center justify-center transition-colors cursor-pointer"
            title="Close viewer"
          >
            <X className="size-6" />
          </button>

          {/* Navigation Arrows */}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              handlePrev();
            }}
            className="absolute left-6 top-1/2 -translate-y-1/2 z-50 size-12 rounded-full bg-white/15 hover:bg-white/30 text-white flex items-center justify-center transition-colors cursor-pointer"
            title="Previous image"
          >
            <ChevronLeft className="size-6" />
          </button>

          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              handleNext();
            }}
            className="absolute right-6 top-1/2 -translate-y-1/2 z-50 size-12 rounded-full bg-white/15 hover:bg-white/30 text-white flex items-center justify-center transition-colors cursor-pointer"
            title="Next image"
          >
            <ChevronRight className="size-6" />
          </button>

          {/* Main Large Lightbox Image */}
          <div
            className="relative w-full max-w-5xl h-[80vh] rounded-2xl overflow-hidden select-none"
            onClick={(e) => e.stopPropagation()}
          >
            <Image
              src={currentImage}
              alt={product.title}
              fill
              className="object-contain"
              sizes="100vw"
              priority
            />
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/60 backdrop-blur-md text-white/90 text-xs px-4 py-1.5 rounded-full">
              {activeIndex + 1} of {galleryImages.length} • {product.title}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
