"use client";

import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Star } from "lucide-react";
import { MotionWrapper } from "./motion-wrapper";
import { motion } from "framer-motion";

const avatarUrls = [
  "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&q=80&fit=crop&crop=face",
  "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&q=80&fit=crop&crop=face",
  "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&q=80&fit=crop&crop=face",
  "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&q=80&fit=crop&crop=face",
];

export function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-[#F8F6F2] pt-12 sm:pt-16 lg:pt-16 pb-8 sm:pb-10 lg:pb-10">
      {/* Single Centered Content Container */}
      <div className="mx-auto max-w-[1280px] px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 xl:gap-14 items-center">
          {/* Left Text Content (42% / 5 cols) */}
          <MotionWrapper className="lg:col-span-5 flex flex-col justify-center">
            {/* Collection Badge → 24px gap */}
            <div className="inline-flex items-center gap-2.5 text-xs font-medium text-[#6B7280] mb-6">
              <span className="size-2 rounded-full bg-[#D4A373]" />
              New Collection 2026
            </div>

            {/* Serif Heading: elegant 50px-52px desktop, 1.0 line-height, max-width ~520px */}
            <h1 className="font-heading text-4xl sm:text-5xl lg:text-[50px] xl:text-[52px] font-normal leading-[1.0] tracking-tight text-[#1A1A1A] max-w-[520px] mb-8">
              <span className="block">Crafted for Comfort.</span>
              {/* Heading Line 1 → Heading Line 2: 12px gap */}
              <span className="block mt-3 italic text-[#1A1A1A]">
                Made for Life.
              </span>
            </h1>

            {/* Description: max 500px, 1.7 line-height → 32px gap */}
            <p className="text-base sm:text-lg text-[#6B7280] leading-[1.7] max-w-[500px] mb-8 font-light">
              Timeless design, premium materials, and unmatched comfort for
              every space in your home.
            </p>

            {/* CTA Buttons: Single horizontal row, 16px gap, vertically aligned → 28px gap */}
            <div className="flex flex-row items-center gap-4 mb-7 flex-nowrap">
              <Link href="/products">
                <motion.span
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="inline-flex items-center gap-2.5 rounded-full bg-[#5D6B4D] hover:bg-[#4E5A40] text-white px-8 py-4 text-sm font-semibold transition-colors shadow-2xs group cursor-pointer whitespace-nowrap"
                >
                  Shop Now
                  <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
                </motion.span>
              </Link>

              <Link href="/products?featured=true">
                <motion.span
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="inline-flex items-center gap-2 rounded-full border border-[#E5E2DC] bg-white hover:bg-[#F0EDE8] text-[#1A1A1A] px-8 py-4 text-sm font-medium transition-colors shadow-2xs cursor-pointer whitespace-nowrap"
                >
                  Explore Collections
                </motion.span>
              </Link>
            </div>

            {/* Customer Trust Row: Avatars & text aligned on same baseline, more spacing */}
            <div className="flex items-center gap-4">
              <div className="flex -space-x-2.5 shrink-0">
                {avatarUrls.map((url, i) => (
                  <div
                    key={i}
                    className="relative size-8 rounded-full border-2 border-[#F8F6F2] overflow-hidden shadow-2xs"
                  >
                    <Image
                      src={url}
                      alt="Verified buyer"
                      fill
                      className="object-cover"
                      sizes="32px"
                    />
                  </div>
                ))}
              </div>
              <p className="text-xs sm:text-[13px] text-[#6B7280]">
                Trusted by{" "}
                <span className="font-semibold text-[#1A1A1A]">25,000+</span>{" "}
                happy customers
              </p>
            </div>
          </MotionWrapper>

          {/* Right Hero Image (58% / 7 cols): Vertically centered with text block */}
          <MotionWrapper delay={0.15} className="lg:col-span-7 relative">
            <div className="relative aspect-[4/3] rounded-[32px] overflow-hidden shadow-sm border border-[#E5E2DC]/60">
              <Image
                src="https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=1400&q=85&fit=crop"
                alt="Modern luxury warm living room with bespoke furniture"
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 58vw"
                priority
              />
            </div>

            {/* Floating Info Card */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.5 }}
              className="absolute bottom-5 left-5 sm:bottom-6 sm:left-6 bg-white/95 backdrop-blur-md rounded-2xl p-3 sm:p-3.5 shadow-xl border border-[#E5E2DC] flex items-center justify-between gap-4 max-w-[280px]"
            >
              <div className="flex items-center gap-3">
                <div className="relative size-11 rounded-xl bg-[#F0EDE8] overflow-hidden shrink-0">
                  <Image
                    src="https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=120&q=80&fit=crop"
                    alt="Living room thumbnail"
                    fill
                    className="object-cover"
                    sizes="44px"
                  />
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-semibold text-[#1A1A1A] truncate">
                    Modern Living Room
                  </p>
                  <Link
                    href="/products"
                    className="text-[11px] text-[#6B7280] hover:text-[#5D6B4D] transition-colors flex items-center gap-1 mt-0.5"
                  >
                    Shop the look <ArrowRight className="size-2.5" />
                  </Link>
                </div>
              </div>

              <div className="flex items-center gap-1 bg-[#F8F6F2] px-2 py-1 rounded-lg shrink-0 border border-[#E5E2DC]/60">
                <span className="text-xs font-bold text-[#1A1A1A]">4.9</span>
                <Star className="size-3 fill-amber-400 text-amber-400" />
              </div>
            </motion.div>
          </MotionWrapper>
        </div>
      </div>
    </section>
  );
}
