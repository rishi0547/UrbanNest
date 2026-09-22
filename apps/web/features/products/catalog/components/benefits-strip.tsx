"use client";

import { Truck, RotateCcw, ShieldCheck, Leaf } from "lucide-react";

export const BENEFITS = [
  {
    icon: Truck,
    title: "White-Glove Delivery",
    description: "Professional in-home placement & packaging removal.",
  },
  {
    icon: RotateCcw,
    title: "30-Day Returns",
    description: "Risk-free in-home comfort & styling guarantee.",
  },
  {
    icon: ShieldCheck,
    title: "5-Year Warranty",
    description: "Built to last with reinforced joinery & frame protection.",
  },
  {
    icon: Leaf,
    title: "Sustainable Materials",
    description: "Responsibly sourced FSC® hardwoods & non-toxic finishes.",
  },
];

export function BenefitsStrip() {
  return (
    <section className="w-full bg-[#F8F6F2] py-8 sm:py-10">
      <div className="w-full max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {BENEFITS.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={idx}
                className="group flex items-start gap-4 p-5 rounded-2xl bg-white border border-[#E5E2DC] shadow-2xs hover:border-[#5D6B4D]/40 hover:shadow-xs transition-all duration-300"
              >
                <div className="size-11 rounded-xl bg-[#5D6B4D]/10 text-[#5D6B4D] flex items-center justify-center shrink-0 group-hover:bg-[#5D6B4D] group-hover:text-white transition-colors duration-300 mt-0.5">
                  <Icon className="size-5 stroke-[1.75]" />
                </div>
                <div className="flex flex-col min-w-0">
                  <h3 className="text-sm sm:text-base font-semibold text-[#1A1A1A] leading-snug">
                    {item.title}
                  </h3>
                  <p className="text-xs text-[#6B7280] leading-relaxed font-light mt-1">
                    {item.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
