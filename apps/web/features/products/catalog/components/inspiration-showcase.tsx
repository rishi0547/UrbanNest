"use client";

import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

export function InspirationShowcase() {
  return (
    <section className="w-full bg-[#F8F6F2] py-10 sm:py-14">
      <div className="w-full max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 xl:gap-16 items-center bg-white rounded-3xl border border-[#E5E2DC] p-6 sm:p-10 lg:p-14 shadow-sm">
          {/* Left Column: Large Lifestyle Interior Image (7 cols out of 12) */}
          <div className="lg:col-span-7 relative aspect-[4/3] sm:aspect-[16/10] w-full rounded-2xl overflow-hidden bg-[#F0EDE8] border border-[#E5E2DC]">
            <Image
              src="https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?w=1200&q=85&fit=crop"
              alt="Designed For Modern Living - UrbanNest Studio Edit"
              fill
              unoptimized
              sizes="(max-width: 1024px) 100vw, 58vw"
              className="object-cover"
            />
            {/* Subtle Gradient Scrim */}
            <div className="absolute inset-0 bg-gradient-to-tr from-black/20 via-transparent to-transparent pointer-events-none" />

            {/* Room Tag Overlay */}
            <div className="absolute bottom-4 left-4 sm:bottom-5 sm:left-5 z-10 rounded-full bg-white/95 backdrop-blur-md px-4 py-1.5 border border-[#E5E2DC] shadow-2xs text-xs font-semibold text-[#1A1A1A]">
              Nordic Loft • Stockholm Architecture
            </div>
          </div>

          {/* Right Column: Editorial Copy & CTA (5 cols out of 12) */}
          <div className="lg:col-span-5 flex flex-col justify-center space-y-5 lg:space-y-6">
            {/* Editorial Perspective Badge */}
            <div className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-[0.25em] text-[#5D6B4D]">
              <Sparkles className="size-3.5 text-[#5D6B4D]" />
              <span>Editorial Perspective</span>
            </div>

            {/* Large Playfair Display Heading */}
            <h2 className="font-heading text-3xl sm:text-4xl lg:text-[42px] font-normal leading-[1.12] tracking-tight text-[#1A1A1A]">
              Designed For Modern Living
            </h2>

            {/* Description */}
            <p className="text-sm sm:text-base text-[#4A4A4A] leading-relaxed font-light">
              UrbanNest pieces are conceived to harmonize effortlessly. From the gentle contour of our
              curved boucle sofas to the honed mineral texture of solid travertine tables, discover how
              thoughtful proportion and organic materials transform every room into an enduring sanctuary.
            </p>

            {/* Feature Points */}
            <div className="space-y-2.5 pt-1 text-xs sm:text-sm text-[#6B7280]">
              <div className="flex items-center gap-2">
                <span className="size-1.5 rounded-full bg-[#5D6B4D]" />
                <span>Hand-finished joinery using kiln-dried solid hardwoods</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="size-1.5 rounded-full bg-[#5D6B4D]" />
                <span>Cohesive warm palettes designed to pair across collections</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="size-1.5 rounded-full bg-[#5D6B4D]" />
                <span>Complimentary design consultation with studio specialists</span>
              </div>
            </div>

            {/* CTA Button */}
            <div className="pt-2">
              <Link href="/#inspiration">
                <Button className="h-12 px-7 rounded-full bg-[#1A1A1A] hover:bg-[#5D6B4D] text-white text-sm font-semibold transition-all shadow-xs gap-2 cursor-pointer">
                  Explore Inspiration
                  <ArrowRight className="size-4" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
