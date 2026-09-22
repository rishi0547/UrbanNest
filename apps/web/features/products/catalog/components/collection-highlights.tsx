"use client";

import Image from "next/image";
import { ArrowRight } from "lucide-react";

export const HIGHLIGHTS = [
  {
    id: "spring-collection",
    tag: "Seasonal Spotlight",
    title: "Spring Collection",
    description: "Designed for modern living.",
    buttonText: "Shop Now",
    slug: "living-room",
    image: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800&q=80&fit=crop",
  },
  {
    id: "premium-seating",
    tag: "Signature Comfort",
    title: "Premium Seating",
    description: "Crafted for comfort and elegance.",
    buttonText: "Explore",
    slug: "living-room",
    image: "https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?w=800&q=80&fit=crop",
  },
  {
    id: "designer-bedroom",
    tag: "Sanctuary Edit",
    title: "Designer Bedroom",
    description: "Refined materials and timeless forms.",
    buttonText: "View Collection",
    slug: "bedroom",
    image: "https://images.unsplash.com/photo-1616046229478-9901c5536a45?w=800&q=80&fit=crop",
  },
];

interface CollectionHighlightsProps {
  onSelectHighlight?: (slug: string) => void;
}

export function CollectionHighlights({
  onSelectHighlight,
}: CollectionHighlightsProps) {
  const handleClick = (slug: string) => {
    if (onSelectHighlight) {
      onSelectHighlight(slug);
      const filterSection = document.getElementById("catalog-filter-bar");
      if (filterSection) {
        filterSection.scrollIntoView({ behavior: "smooth" });
      }
    }
  };

  return (
    <section id="collection-highlights" className="w-full bg-[#F8F6F2] py-8 sm:py-10">
      <div className="w-full max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 items-stretch">
          {HIGHLIGHTS.map((item) => (
            <div
              key={item.id}
              onClick={() => handleClick(item.slug)}
              className="group relative rounded-3xl overflow-hidden border border-[#E5E2DC] shadow-2xs hover:shadow-xl hover:-translate-y-1 transition-all duration-500 flex flex-col justify-end min-h-[360px] sm:min-h-[400px] lg:min-h-[440px] p-6 sm:p-8 cursor-pointer bg-[#F0EDE8]"
            >
              {/* Background Image */}
              <Image
                src={item.image}
                alt={item.title}
                fill
                unoptimized
                sizes="(max-width: 768px) 100vw, 33vw"
                className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
              />

              {/* Scrim Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/35 to-black/10 transition-opacity duration-300 group-hover:from-black/85" />

              {/* Foreground Content */}
              <div className="relative z-10 space-y-2.5">
                <span className="text-[10px] sm:text-[11px] font-semibold uppercase tracking-[0.25em] text-[#D4A373]">
                  {item.tag}
                </span>

                <h3 className="font-heading text-2xl sm:text-3xl font-normal text-white leading-tight">
                  {item.title}
                </h3>

                <p className="text-xs sm:text-sm text-white/80 font-light leading-relaxed max-w-xs">
                  {item.description}
                </p>

                <div className="pt-2">
                  <span className="inline-flex items-center gap-2 text-xs sm:text-sm font-semibold text-white group-hover:text-[#D4A373] transition-colors">
                    {item.buttonText}
                    <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
