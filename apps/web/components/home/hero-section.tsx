"use client";

import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Sparkles, Truck, RotateCcw, ShieldCheck, Headphones } from "lucide-react";
import { MotionWrapper } from "./motion-wrapper";
import { motion } from "framer-motion";

export function HeroSection() {
  const benefits = [
    {
      icon: Sparkles,
      title: "Premium Quality",
      subtitle: "Crafted to Last",
    },
    {
      icon: Truck,
      title: "Free Shipping",
      subtitle: "On Orders Over ₹9,999",
    },
    {
      icon: RotateCcw,
      title: "30-Day Returns",
      subtitle: "Hassle-Free Returns",
    },
    {
      icon: ShieldCheck,
      title: "Secure Checkout",
      subtitle: "100% Safe Payments",
    },
    {
      icon: Headphones,
      title: "24/7 Support",
      subtitle: "Dedicated Concierge",
    },
  ];

  return (
    <div className="relative w-full">
      {/* ========================================================
          FULL-BLEED HERO SECTION (No Outer Card, No Rounded Frame)
          Background extends 100% across the viewport.
          ======================================================== */}
      <section className="relative w-full min-h-[560px] sm:min-h-[620px] lg:min-h-[680px] xl:min-h-[720px] flex items-center overflow-hidden bg-[#EBE7DF]">
        {/* Full-width Background Image: Editorial Architecture & Modern Living */}
        <Image
          src="https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=1800&q=85&fit=crop"
          alt="UrbanNest curated architectural living room with bespoke furniture"
          fill
          priority
          sizes="100vw"
          className="object-cover object-center sm:object-[center_35%]"
        />

        {/* Editorial Scrim: Light Ivory Gradient on Left for Razor-Sharp Typography */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#F8F6F2]/90 via-[#F8F6F2]/82 to-[#F8F6F2]/70 sm:bg-gradient-to-r sm:from-[#F8F6F2]/95 sm:via-[#F8F6F2]/80 sm:to-transparent/10 w-full sm:w-[70%] lg:w-[56%] pointer-events-none" />

        {/* Inner Content Container — Aligned strictly to Global 1440px Grid */}
        <div className="relative z-10 w-full max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20 lg:py-24">
          <MotionWrapper>
            <div className="max-w-2xl flex flex-col justify-center">
              {/* Eyebrow Pill */}
              <div className="inline-flex items-center gap-2 mb-4 sm:mb-5">
                <span className="text-[10px] sm:text-[11px] font-semibold uppercase tracking-[0.25em] text-[#5D6B4D]">
                  Designed For Beautiful Living
                </span>
              </div>

              {/* Editorial Serif Headline */}
              <h1 className="font-heading text-4xl sm:text-5xl lg:text-[58px] xl:text-[66px] font-normal leading-[1.05] tracking-tight text-[#1A1A1A]">
                Modern Furniture.
                <span className="block mt-1 sm:mt-2 italic font-normal text-[#1A1A1A]">
                  Timeless Comfort.
                </span>
              </h1>

              {/* Supporting Copy */}
              <p className="mt-4 sm:mt-5 text-sm sm:text-base lg:text-[17px] text-[#6B7280] leading-relaxed font-light max-w-lg mb-8 sm:mb-10">
                Curated furniture and home decor pieces that bring style, comfort,
                and functionality to your home &mdash; every day.
              </p>

              {/* CTA Action Buttons */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5 sm:gap-4">
                <Link href="/products" className="w-full sm:w-auto">
                  <motion.span
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="inline-flex items-center justify-center gap-2 rounded-full bg-[#1A1A1A] hover:bg-[#5D6B4D] text-white px-8 py-3.5 sm:py-4 text-xs sm:text-sm font-semibold tracking-wide transition-colors shadow-sm cursor-pointer w-full sm:w-auto min-h-[48px]"
                  >
                    SHOP NOW
                    <ArrowRight className="size-4" />
                  </motion.span>
                </Link>

                <Link href="/products?featured=true" className="w-full sm:w-auto">
                  <motion.span
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="inline-flex items-center justify-center gap-2 rounded-full bg-white/90 hover:bg-white border border-[#E5E2DC] text-[#1A1A1A] px-8 py-3.5 sm:py-4 text-xs sm:text-sm font-medium tracking-wide transition-colors shadow-2xs cursor-pointer w-full sm:w-auto min-h-[48px]"
                  >
                    EXPLORE COLLECTION
                  </motion.span>
                </Link>
              </div>
            </div>
          </MotionWrapper>
        </div>
      </section>

      {/* ========================================================
          SERVICE BENEFITS STRIP
          Floating card nested directly below the full-width hero,
          aligned to the 1440px global container.
          ======================================================== */}
      <div className="relative z-20 -mt-6 sm:-mt-8 lg:-mt-10 w-full max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
        <MotionWrapper delay={0.1}>
          <div className="bg-white rounded-2xl sm:rounded-3xl border border-[#E5E2DC] p-4 sm:p-6 shadow-sm">
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4 sm:gap-6 divide-y md:divide-y-0 md:divide-x divide-[#E5E2DC]/80">
              {benefits.map((item, idx) => {
                const Icon = item.icon;
                return (
                  <div
                    key={item.title}
                    className={`flex items-center gap-3 sm:gap-4 ${
                      idx !== 0 ? "pt-3 md:pt-0 md:pl-4 lg:pl-6" : ""
                    }`}
                  >
                    <div className="size-10 sm:size-11 rounded-full bg-[#F8F6F2] border border-[#E5E2DC] flex items-center justify-center shrink-0">
                      <Icon className="size-4 sm:size-5 text-[#5D6B4D] stroke-[1.6]" />
                    </div>
                    <div className="min-w-0">
                      <h3 className="text-xs sm:text-sm font-semibold text-[#1A1A1A] truncate">
                        {item.title}
                      </h3>
                      <p className="text-[11px] text-[#6B7280] font-light truncate mt-0.5">
                        {item.subtitle}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </MotionWrapper>
      </div>
    </div>
  );
}
