"use client";

import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Compass, ShieldCheck, Gem, Leaf } from "lucide-react";
import { MotionWrapper } from "./motion-wrapper";
import { motion } from "framer-motion";

export function PromoBanner() {
  const highlights = [
    {
      icon: Compass,
      title: "Modern & Elegant Designs",
      description: "Style that fits every home",
    },
    {
      icon: ShieldCheck,
      title: "Premium Materials",
      description: "Built for beauty & durability",
    },
    {
      icon: Gem,
      title: "Affordable Luxury",
      description: "High quality at fair prices",
    },
    {
      icon: Leaf,
      title: "Sustainable Choices",
      description: "Better for your home & planet",
    },
  ];

  return (
    <section className="pt-8 sm:pt-12 pb-8 sm:pb-12 bg-[#F8F6F2]">
      {/* Unified 1440px Master Container */}
      <div className="w-full max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
        <MotionWrapper>
          <div className="relative rounded-[24px] sm:rounded-[32px] overflow-hidden bg-[#ECE7DF] border border-[#E5E2DC] shadow-sm grid grid-cols-1 lg:grid-cols-12 min-h-[400px] lg:min-h-[440px]">
            {/* Left 8 Columns: Headline, Subtitle, CTA and Staged Furniture Image */}
            <div className="lg:col-span-8 relative flex flex-col justify-between p-6 sm:p-10 lg:p-14 z-10">
              {/* Background Staged Interior Image */}
              <div className="absolute inset-0 z-0">
                <Image
                  src="https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?w=1400&q=85&fit=crop"
                  alt="Considered furniture setting with credenza and lounge chair"
                  fill
                  sizes="(min-width: 1024px) 66vw, 100vw"
                  className="object-cover object-[center_60%]"
                />
                {/* Soft gradient to keep typography crisp */}
                <div className="absolute inset-0 bg-gradient-to-r from-[#ECE7DF]/95 via-[#ECE7DF]/85 to-transparent w-full sm:w-[75%]" />
              </div>

              {/* Text Content */}
              <div className="relative z-10 max-w-lg mb-8">
                <span className="text-[10px] sm:text-[11px] font-semibold uppercase tracking-[0.25em] text-[#5D6B4D] mb-3 block">
                  Seasonal Curation
                </span>
                <h2 className="font-heading text-3xl sm:text-4xl lg:text-[46px] font-normal leading-[1.08] text-[#1A1A1A] tracking-tight mb-3">
                  Transform Your House
                  <span className="block mt-1 italic">Into a Home</span>
                </h2>
                <p className="text-xs sm:text-sm text-[#6B7280] font-light leading-relaxed mb-6">
                  Up to 20% Off on Selected Handcrafted Living &amp; Dining Collections.
                </p>

                <Link href="/products?featured=true" className="inline-block">
                  <motion.span
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="inline-flex items-center gap-2 rounded-full bg-[#1A1A1A] hover:bg-[#5D6B4D] text-white px-7 sm:px-8 py-3.5 text-xs sm:text-sm font-semibold tracking-wide transition-colors shadow-sm cursor-pointer"
                  >
                    SHOP THE SALE
                    <ArrowRight className="size-4" />
                  </motion.span>
                </Link>
              </div>
            </div>

            {/* Right 4 Columns: Dark Olive Value Matrix (Inspired by Reference) */}
            <div className="lg:col-span-4 bg-[#313A29] p-6 sm:p-8 lg:p-10 text-white flex flex-col justify-center gap-6 relative z-10 border-t lg:border-t-0 lg:border-l border-white/10">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-5 sm:gap-6">
                {highlights.map((item) => {
                  const Icon = item.icon;
                  return (
                    <div key={item.title} className="flex items-start gap-3.5">
                      <div className="size-10 rounded-xl bg-white/10 border border-white/15 flex items-center justify-center shrink-0 mt-0.5 text-[#D4C5A9]">
                        <Icon className="size-4.5 stroke-[1.8]" />
                      </div>
                      <div>
                        <h3 className="text-xs sm:text-sm font-semibold text-white tracking-wide">
                          {item.title}
                        </h3>
                        <p className="text-[11px] text-white/75 font-light leading-snug mt-0.5">
                          {item.description}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </MotionWrapper>
      </div>
    </section>
  );
}
