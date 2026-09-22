"use client";

import { Truck, RotateCcw, ShieldCheck, Headphones } from "lucide-react";
import { MotionWrapper } from "./motion-wrapper";

const features = [
  {
    icon: Truck,
    title: "Free Shipping",
    description: "On all orders over $50",
  },
  {
    icon: RotateCcw,
    title: "30-Day Returns",
    description: "Hassle-free return policy",
  },
  {
    icon: ShieldCheck,
    title: "Secure Payments",
    description: "100% encrypted checkout",
  },
  {
    icon: Headphones,
    title: "24/7 Support",
    description: "Dedicated concierge care",
  },
];

export function TrustBadges() {
  return (
    <section className="pt-8 sm:pt-10 lg:pt-10 pb-10 sm:pb-12 lg:pb-[50px] bg-[#F8F6F2]">
      <div className="mx-auto max-w-[1280px] px-4 sm:px-6 lg:px-8">
        <MotionWrapper>
          <div className="bg-white rounded-2xl border border-[#E5E2DC] py-10 sm:py-12 px-8 sm:px-12 shadow-2xs">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
              {features.map((item) => {
                const Icon = item.icon;
                return (
                  <div
                    key={item.title}
                    className="flex items-center gap-4"
                  >
                    <div className="size-12 rounded-xl bg-[#F8F6F2] border border-[#E5E2DC]/80 flex items-center justify-center shrink-0">
                      <Icon className="size-5 text-[#5D6B4D] stroke-[1.6]" />
                    </div>
                    <div className="min-w-0">
                      <h4 className="text-sm font-semibold text-[#1A1A1A] leading-tight mb-1">
                        {item.title}
                      </h4>
                      <p className="text-xs text-[#6B7280] font-light leading-normal">
                        {item.description}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </MotionWrapper>
      </div>
    </section>
  );
}
