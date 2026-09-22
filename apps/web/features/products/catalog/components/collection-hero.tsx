"use client";

import Image from "next/image";
import { ArrowDown, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

export function CollectionHero() {
  const handleScrollToCatalog = () => {
    const filterSection = document.getElementById("catalog-filter-bar");
    if (filterSection) {
      filterSection.scrollIntoView({ behavior: "smooth" });
    } else {
      window.scrollTo({ top: 650, behavior: "smooth" });
    }
  };

  return (
    <section className="w-full bg-[#F8F6F2] pt-4 pb-8 sm:pb-12">
      <div className="w-full max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 xl:gap-16 items-center min-h-[480px] lg:min-h-[540px]">
          {/* Left Content Column (5 cols out of 12) */}
          <div className="lg:col-span-5 flex flex-col justify-center space-y-5 lg:space-y-6">
            {/* Curated Collections Badge */}
            <div className="inline-flex items-center gap-2 rounded-full border border-[#5D6B4D]/25 bg-[#5D6B4D]/10 px-3.5 py-1 text-xs font-semibold text-[#5D6B4D] w-fit shadow-2xs">
              <Sparkles className="size-3.5 text-[#5D6B4D]" />
              <span>Curated Collections</span>
            </div>

            {/* Heading */}
            <h1 className="font-heading text-4xl sm:text-5xl lg:text-[52px] xl:text-[56px] font-normal leading-[1.08] tracking-tight text-[#1A1A1A]">
              Architectural Living Catalog
            </h1>

            {/* Description */}
            <p className="text-sm sm:text-base text-[#4A4A4A] leading-relaxed font-light max-w-lg">
              Thoughtfully engineered furniture crafted for balance, comfort, and longevity.
              Every piece celebrates natural hardwoods, organic textiles, and enduring silhouettes.
            </p>

            {/* Primary CTA Button */}
            <div className="pt-2 flex items-center gap-4">
              <Button
                type="button"
                onClick={handleScrollToCatalog}
                className="h-12 px-7 rounded-full bg-[#5D6B4D] hover:bg-[#4E5A40] text-white text-sm font-semibold transition-all shadow-xs gap-2 cursor-pointer"
              >
                Explore Collection
                <ArrowDown className="size-4 animate-bounce" />
              </Button>
              <span className="text-xs text-[#6B7280] font-light hidden sm:inline">
                Over 40 studio signatures
              </span>
            </div>
          </div>

          {/* Right Image Column (7 cols out of 12) */}
          <div className="lg:col-span-7 relative h-[360px] sm:h-[440px] lg:h-[520px] w-full rounded-3xl overflow-hidden border border-[#E5E2DC] shadow-sm bg-[#F0EDE8]">
            <Image
              src="https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?w=1400&q=85&fit=crop"
              alt="UrbanNest Architectural Living Catalog"
              fill
              priority
              unoptimized
              sizes="(max-width: 1024px) 100vw, 58vw"
              className="object-cover"
            />
            {/* Subtle Gradient Scrim on Bottom */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/35 via-transparent to-transparent pointer-events-none" />

            {/* Floating Luxury Detail Badge */}
            <div className="absolute bottom-5 left-5 sm:bottom-6 sm:left-6 z-10 rounded-2xl bg-white/90 backdrop-blur-md border border-[#E5E2DC] p-3.5 sm:p-4 shadow-sm max-w-xs">
              <div className="flex items-center gap-2 mb-1">
                <span className="size-2 rounded-full bg-emerald-600" />
                <span className="text-[11px] font-semibold uppercase tracking-wider text-[#5D6B4D]">
                  Studio Feature
                </span>
              </div>
              <p className="text-xs sm:text-sm font-medium text-[#1A1A1A] leading-snug">
                The Kōben & Nordic Collections
              </p>
              <p className="text-[11px] text-[#6B7280] font-light mt-0.5">
                Hand-finished in solid walnut & tactile bouclé
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
