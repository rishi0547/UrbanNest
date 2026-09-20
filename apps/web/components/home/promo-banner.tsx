"use client";

import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { MotionWrapper } from "./motion-wrapper";
import { motion } from "framer-motion";

export function PromoBanner() {
  return (
    <section className="py-16 sm:py-20 lg:py-28 bg-[#F8F6F2]">
      <div className="mx-auto max-w-[1280px] px-4 sm:px-6 lg:px-8">
        <MotionWrapper>
          <div className="relative rounded-[32px] overflow-hidden grid grid-cols-1 lg:grid-cols-12 bg-[#313A29] shadow-sm border border-[#E5E2DC]/40 min-h-[380px] lg:min-h-[440px]">
            {/* Left Content (5 cols) */}
            <div className="lg:col-span-5 p-10 sm:p-14 lg:p-16 xl:p-20 flex flex-col justify-center relative z-10">
              <span className="text-xs uppercase tracking-[0.25em] text-[#D4C5A9] font-medium mb-4">
                Summer Sale
              </span>
              <h2 className="font-heading text-3xl sm:text-5xl lg:text-[52px] font-normal text-white leading-[1.08] mb-5">
                Up to 30% Off
              </h2>
              <p className="text-sm sm:text-base text-white/80 max-w-md leading-relaxed font-light mb-8">
                Selected items for a limited time only. Transform your sanctuary
                with our seasonal curation.
              </p>

              <div>
                <Link href="/products?sale=true">
                  <motion.span
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="inline-flex items-center gap-2.5 rounded-full bg-white text-[#1A1A1A] hover:bg-[#F8F6F2] px-8 py-3.5 text-sm font-semibold transition-colors shadow-2xs group cursor-pointer"
                  >
                    Shop Sale
                    <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
                  </motion.span>
                </Link>
              </div>
            </div>

            {/* Right Lifestyle Image (7 cols) with Soft Gradient Overlay */}
            <div className="lg:col-span-7 relative min-h-[300px] sm:min-h-[360px] lg:min-h-full">
              <Image
                src="https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=1400&q=85&fit=crop"
                alt="Green armchair in an editorial modern living space"
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 58vw"
              />
              {/* Soft Gradient Overlay for Smooth Transition */}
              <div className="absolute inset-0 bg-gradient-to-t lg:bg-gradient-to-r from-[#313A29] via-[#313A29]/30 to-transparent pointer-events-none" />
            </div>
          </div>
        </MotionWrapper>
      </div>
    </section>
  );
}
