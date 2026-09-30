"use client";

import Image from "next/image";
import { Users, Package, ThumbsUp, Star, Quote } from "lucide-react";
import { MotionWrapper } from "./motion-wrapper";

export function TrustBadges() {
  const stats = [
    {
      icon: Users,
      value: "25K+",
      label: "Happy Customers",
    },
    {
      icon: Package,
      value: "10K+",
      label: "Products Sold",
    },
    {
      icon: ThumbsUp,
      value: "98%",
      label: "Positive Reviews",
    },
    {
      icon: Star,
      value: "4.8★",
      label: "Average Rating",
    },
  ];

  return (
    <section className="pt-6 sm:pt-8 pb-10 sm:pb-12 bg-[#F8F6F2]">
      {/* Unified 1440px Master Container */}
      <div className="w-full max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
        <MotionWrapper>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 sm:gap-6 items-stretch">
            {/* Left 7 Columns: 4 Key Metric Callouts in White Card */}
            <div className="lg:col-span-6 bg-white rounded-2xl sm:rounded-3xl border border-[#E5E2DC] p-6 sm:p-8 shadow-2xs flex flex-col justify-center">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6 divide-y sm:divide-y-0 sm:divide-x divide-[#E5E2DC]/80">
                {stats.map((stat, idx) => {
                  const Icon = stat.icon;
                  return (
                    <div
                      key={stat.label}
                      className={`flex flex-col items-center text-center ${
                        idx !== 0 ? "pt-3 sm:pt-0 sm:pl-3 lg:pl-4" : ""
                      }`}
                    >
                      <div className="size-10 rounded-full bg-[#F8F6F2] border border-[#E5E2DC] flex items-center justify-center text-[#5D6B4D] mb-2.5">
                        <Icon className="size-4.5 stroke-[1.8]" />
                      </div>
                      <span className="font-heading text-xl sm:text-2xl font-bold text-[#1A1A1A] leading-tight">
                        {stat.value}
                      </span>
                      <span className="text-[11px] text-[#6B7280] font-light mt-1">
                        {stat.label}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Right 5 Columns: Featured Testimonial with Staged Photo */}
            <div className="lg:col-span-6 bg-white rounded-2xl sm:rounded-3xl border border-[#E5E2DC] p-5 sm:p-6 shadow-2xs flex items-center justify-between gap-5 sm:gap-6">
              <div className="flex-1 flex flex-col justify-between py-1">
                <div>
                  <Quote className="size-6 text-[#5D6B4D]/40 mb-2 fill-[#5D6B4D]/10 stroke-[1.5]" />
                  <p className="text-xs sm:text-sm text-[#1A1A1A] leading-relaxed font-normal">
                    &ldquo;The quality is outstanding and the designs are simply beautiful. UrbanNest has completely transformed my living space!&rdquo;
                  </p>
                </div>
                <div className="mt-4 pt-3 border-t border-[#E5E2DC]/70">
                  <p className="text-xs font-semibold text-[#1A1A1A]">
                    &mdash; Sarah J.
                  </p>
                  <p className="text-[11px] text-[#6B7280] font-light">
                    Interior Architect &bull; Verified Buyer
                  </p>
                </div>
              </div>

              {/* Staged Armchair / Vignette Image */}
              <div className="relative size-28 sm:size-36 lg:size-40 rounded-xl sm:rounded-2xl overflow-hidden bg-[#F0EDE8] shrink-0 border border-[#E5E2DC]">
                <Image
                  src="https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&q=80&fit=crop"
                  alt="Customer living room with UrbanNest armchair"
                  fill
                  sizes="160px"
                  className="object-cover"
                />
              </div>
            </div>
          </div>
        </MotionWrapper>
      </div>
    </section>
  );
}
