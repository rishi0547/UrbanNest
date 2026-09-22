"use client";

import { ArrowRight } from "lucide-react";
import { ProductCard } from "./product-card";
import type { CatalogProduct } from "../types";

interface CatalogShowcaseSectionProps {
  kicker?: string;
  title: string;
  subtitle?: string;
  products: CatalogProduct[];
  onViewAll?: () => void;
  viewAllLabel?: string;
}

export function CatalogShowcaseSection({
  kicker = "Curated Edit",
  title,
  subtitle,
  products,
  onViewAll,
  viewAllLabel = "View All",
}: CatalogShowcaseSectionProps) {
  const handleScrollToCatalog = () => {
    if (onViewAll) {
      onViewAll();
    }
    const filterSection = document.getElementById("catalog-filter-bar");
    if (filterSection) {
      filterSection.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section className="w-full bg-[#F8F6F2] py-8 sm:py-10">
      <div className="w-full max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 mb-6 sm:mb-8 border-b border-[#E5E2DC] pb-4">
          <div>
            {kicker && (
              <span className="text-[11px] font-semibold uppercase tracking-[0.25em] text-[#5D6B4D]">
                {kicker}
              </span>
            )}
            <h2 className="font-heading text-2xl sm:text-3xl lg:text-4xl font-normal text-[#1A1A1A] mt-1">
              {title}
            </h2>
            {subtitle && (
              <p className="text-xs sm:text-sm text-[#6B7280] font-light mt-1 max-w-xl">
                {subtitle}
              </p>
            )}
          </div>

          <button
            type="button"
            onClick={handleScrollToCatalog}
            className="text-xs font-semibold text-[#5D6B4D] hover:underline flex items-center gap-1.5 cursor-pointer w-fit"
          >
            {viewAllLabel} <ArrowRight className="size-3.5" />
          </button>
        </div>

        {/* 4 Cards Responsive Grid (4 desktop, 2-3 tablet, 1-2 mobile) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6 items-stretch">
          {products.slice(0, 4).map((product, idx) => (
            <ProductCard
              key={product.id || idx}
              product={product}
              rating={idx % 2 === 0 ? 4.9 : 4.8}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
