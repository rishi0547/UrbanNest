"use client";

import Image from "next/image";
import { ChevronLeft, ChevronRight, Quote } from "lucide-react";
import { MotionWrapper } from "./motion-wrapper";

const testimonials = [
  {
    quote:
      "The quality is outstanding and the designs are simply beautiful. Highly recommend UrbanNest Furniture!",
    name: "Emily R.",
    location: "Los Angeles, CA",
    avatar:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&q=80&fit=crop&crop=face",
  },
  {
    quote:
      "Fast delivery, easy assembly, and the sofa is incredibly comfortable!",
    name: "James T.",
    location: "Austin, TX",
    avatar:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&q=80&fit=crop&crop=face",
  },
  {
    quote:
      "Customer service was amazing and the product exceeded my expectations.",
    name: "Sophia L.",
    location: "New York, NY",
    avatar:
      "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&q=80&fit=crop&crop=face",
  },
];

export function TestimonialsSection() {
  return (
    <section className="py-16 lg:py-24 bg-[#F8F6F2]">
      <div className="mx-auto max-w-[1280px] px-6">
        {/* Centered Heading with Navigation Controls */}
        <MotionWrapper className="text-center mb-10 sm:mb-14 relative">
          <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#6B7280]">
            What Our Customers Say
          </p>
          <h2 className="font-heading text-3xl sm:text-4xl font-normal text-[#1A1A1A] mt-2.5">
            Real homes. Real stories.
          </h2>

          {/* Carousel Arrows on top-right for desktop */}
          <div className="hidden sm:flex items-center gap-2 absolute right-0 bottom-0">
            <button
              className="size-8 rounded-full border border-[#E5E2DC] bg-white flex items-center justify-center text-[#1A1A1A] hover:bg-[#F0EDE8] transition-colors shadow-2xs"
              title="Previous testimonials"
            >
              <ChevronLeft className="size-4" />
            </button>
            <button
              className="size-8 rounded-full border border-[#E5E2DC] bg-white flex items-center justify-center text-[#1A1A1A] hover:bg-[#F0EDE8] transition-colors shadow-2xs"
              title="Next testimonials"
            >
              <ChevronRight className="size-4" />
            </button>
          </div>
        </MotionWrapper>

        {/* Three Equal Cards */}
        <MotionWrapper delay={0.15}>
          <div>
            {/* Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch">
              {testimonials.map((item) => (
                <div
                  key={item.name}
                  className="bg-white rounded-2xl border border-[#E5E2DC] p-6 sm:p-7 shadow-2xs flex flex-col justify-between h-full hover:border-[#5D6B4D]/30 transition-colors"
                >
                  <div>
                    <Quote className="size-5 text-[#5D6B4D]/60 mb-4 fill-[#5D6B4D]/10 stroke-[1.5]" />
                    <p className="text-xs sm:text-sm text-[#1A1A1A] leading-relaxed">
                      &ldquo;{item.quote}&rdquo;
                    </p>
                  </div>

                  <div className="flex items-center gap-3 pt-6 mt-6 border-t border-[#E5E2DC]/60">
                    <div className="relative size-10 rounded-full overflow-hidden border border-[#E5E2DC] shrink-0">
                      <Image
                        src={item.avatar}
                        alt={item.name}
                        fill
                        className="object-cover"
                        sizes="40px"
                      />
                    </div>
                    <div>
                      <p className="text-xs sm:text-[13px] font-semibold text-[#1A1A1A]">
                        {item.name}
                      </p>
                      <p className="text-[11px] text-[#6B7280]">
                        {item.location}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination Dots */}
            <div className="flex items-center justify-center gap-1.5 mt-8">
              <span className="size-1.5 rounded-full bg-[#1A1A1A]" />
              <span className="w-4 h-1.5 rounded-full bg-[#5D6B4D]" />
              <span className="size-1.5 rounded-full bg-[#E5E2DC]" />
            </div>
          </div>
        </MotionWrapper>
      </div>
    </section>
  );
}
