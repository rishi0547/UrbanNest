"use client";

import { Truck, RotateCcw, ShieldCheck, Leaf } from "lucide-react";

const TRUST_FEATURES = [
  {
    icon: Truck,
    title: "White Glove Delivery",
    description: "In-home placement, unboxing & packaging removal",
  },
  {
    icon: RotateCcw,
    title: "30-Day Home Trial",
    description: "Risk-free in-home comfort & styling guarantee",
  },
  {
    icon: ShieldCheck,
    title: "10-Year Frame Warranty",
    description: "Solid hardwood frame & structural joint protection",
  },
  {
    icon: Leaf,
    title: "FSC® Certified Timber",
    description: "Sustainably harvested wood & non-toxic organic finishes",
  },
];

export function ProductTrustBadges() {
  return (
    <div className="w-full">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 sm:gap-4 lg:gap-5">
        {TRUST_FEATURES.map((item, idx) => {
          const Icon = item.icon;
          return (
            <div
              key={idx}
              className="group flex items-center gap-3.5 p-3.5 sm:p-4 rounded-2xl bg-white border border-[#E5E2DC] shadow-2xs hover:border-[#5D6B4D]/40 hover:shadow-xs transition-all duration-300"
            >
              <div className="size-10 rounded-xl bg-[#5D6B4D]/10 text-[#5D6B4D] flex items-center justify-center shrink-0 group-hover:bg-[#5D6B4D] group-hover:text-white transition-colors duration-300">
                <Icon className="size-5 stroke-[1.75]" />
              </div>
              <div className="flex flex-col min-w-0">
                <span className="text-xs sm:text-[13px] font-semibold text-[#1A1A1A] leading-snug truncate">
                  {item.title}
                </span>
                <span className="text-[11px] text-[#6B7280] leading-tight font-light truncate mt-0.5">
                  {item.description}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
