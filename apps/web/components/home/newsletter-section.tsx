"use client";

import { ArrowUpRight } from "lucide-react";
import { MotionWrapper } from "./motion-wrapper";
import { motion } from "framer-motion";

export function NewsletterSection() {
  return (
    <section className="pt-12 sm:pt-14 lg:pt-[60px] pb-8 sm:pb-10 lg:pb-10 bg-[#F8F6F2]">
      <div className="mx-auto max-w-[1280px] px-4 sm:px-6 lg:px-8">
        <MotionWrapper>
          <div className="rounded-[32px] bg-[#313A29] px-5 py-8 sm:px-14 sm:py-16 lg:px-20 lg:py-20 flex flex-col lg:flex-row items-center justify-between gap-8 lg:gap-16 shadow-sm border border-[#E5E2DC]/30">
            {/* Left Content */}
            <div className="text-center lg:text-left">
              <h3 className="font-heading text-2xl sm:text-4xl lg:text-[42px] font-normal text-white leading-tight mb-3">
                Stay inspired
              </h3>
              <p className="text-xs sm:text-base text-white/80 max-w-lg leading-relaxed font-light">
                Join our private newsletter for new collection debuts, exclusive
                design previews, and seasonal inspiration.
              </p>
            </div>

            {/* Right Form: Generous luxury input & CTA aligned */}
            <form
              onSubmit={(e) => e.preventDefault()}
              className="w-full max-w-lg flex flex-col min-[480px]:flex-row gap-3 min-[480px]:gap-0 min-[480px]:bg-white min-[480px]:rounded-full min-[480px]:p-2 min-[480px]:pl-6 shadow-xs focus-within:ring-2 focus-within:ring-[#D4C5A9]/50 transition-all"
            >
              <input
                type="email"
                placeholder="Enter your email address"
                required
                className="w-full bg-white min-[480px]:bg-transparent text-sm sm:text-base text-[#1A1A1A] placeholder:text-[#6B7280] outline-none h-12 px-5 min-[480px]:px-0 min-[480px]:pr-2 rounded-full min-[480px]:rounded-none"
              />
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                className="h-12 px-6 sm:px-7 rounded-full bg-[#1A1A1A] min-[480px]:bg-[#313A29] hover:bg-[#242B1E] text-white flex items-center justify-center gap-2 text-xs sm:text-sm font-semibold transition-colors shrink-0 shadow-2xs w-full min-[480px]:w-auto border border-white/20 min-[480px]:border-transparent cursor-pointer"
                title="Subscribe to newsletter"
              >
                <span>Subscribe</span>
                <ArrowUpRight className="size-4" />
              </motion.button>
            </form>
          </div>
        </MotionWrapper>
      </div>
    </section>
  );
}
