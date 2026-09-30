"use client";

import React, { useMemo, Suspense } from "react";
import Link from "next/link";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import { ArrowRight } from "lucide-react";
import { useProducts } from "../queries";

export const SPACES = [
  {
    name: "Living Room",
    slug: "living-room",
    fallbackCount: 8,
    image: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=600&q=80&fit=crop",
  },
  {
    name: "Bedroom",
    slug: "bedroom",
    fallbackCount: 7,
    image: "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=600&q=80&fit=crop",
  },
  {
    name: "Dining Room",
    slug: "dining-room",
    fallbackCount: 7,
    image: "https://images.unsplash.com/photo-1615066390971-03e4e1c36ddf?w=600&q=80&fit=crop",
  },
  {
    name: "Home Office",
    slug: "home-office",
    fallbackCount: 6,
    image: "https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?w=600&q=80&fit=crop",
  },
  {
    name: "Storage",
    slug: "storage",
    fallbackCount: 6,
    image: "https://images.unsplash.com/photo-1538688525198-9b88f6f53126?w=600&q=80&fit=crop",
  },
];

interface ShopBySpaceProps {
  selectedCategory?: string;
  onSelectCategory?: (slug: string) => void;
}

function ShopBySpaceContent({
  selectedCategory: propCategory,
  onSelectCategory,
}: ShopBySpaceProps) {
  const searchParams = useSearchParams();
  const currentCategory = propCategory || searchParams.get("category") || "all";

  // Access prefetched products cache to dynamically derive live piece counts per space
  const { data: products } = useProducts();

  const spaceCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    (products || []).forEach((p) => {
      const slug = p.category?.slug;
      if (slug) {
        counts[slug] = (counts[slug] || 0) + 1;
      }
    });
    return counts;
  }, [products]);

  const handleSpaceClick = (slug: string) => {
    if (onSelectCategory) {
      onSelectCategory(slug);
    }
    const filterSection = document.getElementById("catalog-filter-bar");
    if (filterSection) {
      filterSection.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section className="w-full bg-[#F8F6F2] py-8 sm:py-10">
      <div className="w-full max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 mb-6 sm:mb-8 border-b border-[#E5E2DC] pb-4">
          <div>
            <span className="text-[11px] font-semibold uppercase tracking-[0.25em] text-[#5D6B4D]">
              Living Taxonomy
            </span>
            <h2 className="font-heading text-2xl sm:text-3xl font-normal text-[#1A1A1A] mt-1">
              Shop By Space
            </h2>
          </div>
          <Link
            href="/products?category=all#catalog-filter-bar"
            onClick={() => handleSpaceClick("all")}
            className="group inline-flex items-center gap-1.5 text-xs font-semibold text-[#5D6B4D] hover:text-[#1A1A1A] transition-colors cursor-pointer"
          >
            <span>View All Spaces</span>
            <ArrowRight className="size-3.5 transition-transform duration-200 group-hover:translate-x-1" />
          </Link>
        </div>

        {/* 5 Cards Desktop / 3 Tablet / 2 Mobile */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 sm:gap-6 lg:gap-8 justify-items-center">
          {SPACES.map((space) => {
            const isSelected = currentCategory === space.slug;
            const pieceCount = spaceCounts[space.slug] ?? space.fallbackCount;

            return (
              <Link
                key={space.slug}
                href={`/products?category=${space.slug}#catalog-filter-bar`}
                onClick={() => handleSpaceClick(space.slug)}
                aria-label={`Browse ${space.name} furniture (${pieceCount} pieces)`}
                className="group flex flex-col items-center text-center cursor-pointer w-full focus:outline-none focus-visible:ring-2 focus-visible:ring-[#5D6B4D] focus-visible:ring-offset-4 rounded-3xl p-1.5 sm:p-2 transition-transform duration-200 hover:-translate-y-1"
              >
                {/* Circular Image Container */}
                <div
                  className={`relative size-28 sm:size-32 md:size-36 lg:size-40 rounded-full overflow-hidden border-2 transition-all duration-300 p-1 bg-white shadow-2xs group-hover:shadow-md group-hover:scale-105 ${
                    isSelected
                      ? "border-[#5D6B4D] ring-4 ring-[#5D6B4D]/20 scale-105"
                      : "border-[#E5E2DC] group-hover:border-[#5D6B4D]/60"
                  }`}
                >
                  <div className="relative size-full rounded-full overflow-hidden">
                    <Image
                      src={space.image}
                      alt={`${space.name} architectural living space`}
                      fill
                      unoptimized
                      sizes="(max-width: 640px) 120px, 160px"
                      className="object-cover transition-transform duration-500 ease-out group-hover:scale-110"
                    />
                  </div>
                </div>

                {/* Category Name & Count */}
                <div className="mt-3.5">
                  <h3
                    className={`text-sm sm:text-base font-medium transition-colors flex items-center justify-center gap-1 ${
                      isSelected
                        ? "text-[#5D6B4D] font-semibold"
                        : "text-[#1A1A1A] group-hover:text-[#5D6B4D]"
                    }`}
                  >
                    <span>{space.name}</span>
                    <ArrowRight className="size-3 opacity-0 -translate-x-1 transition-all duration-200 group-hover:opacity-100 group-hover:translate-x-0 text-[#5D6B4D]" />
                  </h3>
                  <span className="text-[11px] text-[#6B7280] font-light mt-0.5 block">
                    {pieceCount} {pieceCount === 1 ? "Piece" : "Pieces"}
                  </span>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export function ShopBySpace(props: ShopBySpaceProps) {
  return (
    <Suspense fallback={null}>
      <ShopBySpaceContent {...props} />
    </Suspense>
  );
}
