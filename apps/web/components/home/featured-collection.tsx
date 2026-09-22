"use client";

import Link from "next/link";
import Image from "next/image";
import { ArrowRight, ChevronLeft, ChevronRight, Heart, Star } from "lucide-react";
import { MotionWrapper } from "./motion-wrapper";
import { motion } from "framer-motion";
import type { CatalogProduct } from "@/features/products/catalog/types";

interface FeaturedCollectionProps {
  products: CatalogProduct[];
}

const fallbackProducts = [
  {
    id: "fb-1",
    title: "Luna 3-Seater Sofa",
    slug: "luna-3-seater-sofa",
    price: 899,
    rating: 4.8,
    image: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=700&q=80&fit=crop",
    colors: ["#C5B49E", "#7C6354", "#2B2B2A"],
  },
  {
    id: "fb-2",
    title: "Haven Dining Table",
    slug: "haven-dining-table",
    price: 699,
    rating: 4.7,
    image: "https://images.unsplash.com/photo-1615066390971-03e4e1c36ddf?w=700&q=80&fit=crop",
    colors: ["#B8977E", "#5A4232", "#1F1F1E"],
  },
  {
    id: "fb-3",
    title: "Casa Lounge Chair",
    slug: "casa-lounge-chair",
    price: 299,
    rating: 4.9,
    image: "https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?w=700&q=80&fit=crop",
    colors: ["#5D6B4D", "#D4C5A9", "#3E3B36"],
  },
  {
    id: "fb-4",
    title: "Milo Sideboard",
    slug: "milo-sideboard",
    price: 449,
    rating: 4.8,
    image: "https://images.unsplash.com/photo-1538688525198-9b88f6f53126?w=700&q=80&fit=crop",
    colors: ["#C4A482", "#3D3D3D"],
  },
];

export function FeaturedCollection({ products }: FeaturedCollectionProps) {
  // Combine real database products with fallbacks to guarantee 4 balanced cards
  const displayItems = fallbackProducts.map((fb, idx) => {
    const real = products[idx];
    if (real) {
      return {
        id: real.id,
        title: real.title,
        slug: real.slug,
        price: Number(real.price),
        rating: fb.rating,
        image: real.images?.[0] || fb.image,
        colors: fb.colors,
      };
    }
    return fb;
  });

  return (
    <section className="pt-10 sm:pt-12 lg:pt-[50px] pb-10 sm:pb-12 lg:pb-[50px] bg-[#F8F6F2]">
      <div className="mx-auto max-w-[1280px] px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-start">
          {/* Left Intro Content Block (3 cols) */}
          <MotionWrapper className="lg:col-span-3 flex flex-col justify-between self-stretch pr-0 lg:pr-2">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#6B7280] mb-3">
                Best Sellers
              </p>
              <h2 className="font-heading text-3xl sm:text-4xl font-normal leading-[1.12] text-[#1A1A1A] mb-4">
                Our Most Loved<br />Pieces
              </h2>
              <p className="text-sm text-[#6B7280] leading-relaxed font-light mb-8 max-w-xs">
                Handpicked favorites that blend style, quality, and functionality.
              </p>
            </div>

            <div className="mt-auto pt-2">
              <Link href="/products">
                <motion.span
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="inline-flex items-center gap-2 rounded-full bg-[#5D6B4D] hover:bg-[#4E5A40] text-white px-6 py-3 text-xs sm:text-sm font-semibold transition-colors shadow-2xs cursor-pointer whitespace-nowrap"
                >
                  View All Products
                  <ArrowRight className="size-3.5" />
                </motion.span>
              </Link>
            </div>
          </MotionWrapper>

          {/* Right Product Cards Grid (9 cols) */}
          <div className="lg:col-span-9 flex flex-col">
            {/* Top Carousel Navigation Arrows */}
            <div className="hidden sm:flex items-center justify-end gap-2 mb-6">
              <button
                className="size-9 rounded-full border border-[#E5E2DC] bg-white flex items-center justify-center text-[#1A1A1A] hover:bg-[#F0EDE8] transition-colors shadow-2xs"
                title="Previous"
              >
                <ChevronLeft className="size-4" />
              </button>
              <button
                className="size-9 rounded-full border border-[#E5E2DC] bg-white flex items-center justify-center text-[#1A1A1A] hover:bg-[#F0EDE8] transition-colors shadow-2xs"
                title="Next"
              >
                <ChevronRight className="size-4" />
              </button>
            </div>

            {/* 4 Cards Grid - 24px gap */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 items-stretch">
              {displayItems.map((item, i) => (
                <MotionWrapper key={item.id} delay={i * 0.08} className="h-full">
                  <div className="group bg-white rounded-2xl border border-[#E5E2DC] p-4 shadow-2xs hover:shadow-lg transition-all duration-500 flex flex-col h-full justify-between">
                    {/* Image Container with Restrained Zoom */}
                    <Link
                      href={`/products/${item.slug}`}
                      className="relative aspect-[4/5] w-full rounded-xl overflow-hidden bg-[#F0EDE8] block mb-3.5"
                    >
                      <Image
                        src={item.image}
                        alt={item.title}
                        fill
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 22vw"
                        className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03]"
                      />

                      {/* Subtle Wishlist Button */}
                      <button
                        type="button"
                        className="absolute top-3 right-3 z-10 size-8 rounded-full bg-white/90 backdrop-blur-xs flex items-center justify-center text-[#6B7280] hover:text-rose-600 transition-colors shadow-2xs"
                        title="Add to wishlist"
                      >
                        <Heart className="size-3.5 stroke-[1.75]" />
                      </button>
                    </Link>

                    {/* Metadata & Typography Hierarchy */}
                    <div className="flex flex-col flex-1">
                      {/* Rating */}
                      <div className="flex items-center gap-1.5 mb-2">
                        <Star className="size-3 fill-amber-400 text-amber-400" />
                        <span className="text-xs font-medium text-[#1A1A1A]">
                          {item.rating}
                        </span>
                      </div>

                      {/* Product Title */}
                      <Link href={`/products/${item.slug}`} className="block mb-1.5">
                        <h3 className="text-sm sm:text-[15px] font-medium text-[#1A1A1A] truncate group-hover:text-[#5D6B4D] transition-colors leading-snug">
                          {item.title}
                        </h3>
                      </Link>

                      {/* Price */}
                      <p className="text-sm sm:text-[15px] font-semibold text-[#1A1A1A] mb-3">
                        ${item.price.toFixed(2)}
                      </p>

                      {/* Color Swatches */}
                      <div className="flex items-center gap-2 pt-3 border-t border-[#E5E2DC]/60 mt-auto">
                        {item.colors.map((color, cIdx) => (
                          <span
                            key={cIdx}
                            className="size-2.5 rounded-full border border-black/10"
                            style={{ backgroundColor: color }}
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                </MotionWrapper>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
