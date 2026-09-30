"use client";

import { useState } from "react";
import { Mail, Check, ArrowRight } from "lucide-react";
import { MotionWrapper } from "./motion-wrapper";
import { motion } from "framer-motion";

export function NewsletterSection() {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      setSubscribed(true);
      setTimeout(() => {
        setEmail("");
        setSubscribed(false);
      }, 4000);
    }
  };

  return (
    <section className="pt-8 sm:pt-12 pb-12 sm:pb-16 bg-[#F8F6F2]">
      {/* Unified 1440px Master Container */}
      <div className="w-full max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
        <MotionWrapper>
          <div className="rounded-[24px] sm:rounded-[32px] bg-[#313A29] p-6 sm:p-10 lg:p-12 text-white flex flex-col lg:flex-row items-center justify-between gap-6 sm:gap-8 shadow-sm border border-white/10">
            {/* Left Content with Mail Icon Badge */}
            <div className="flex items-center gap-4 sm:gap-5 w-full lg:w-auto">
              <div className="size-12 sm:size-14 rounded-full bg-white/10 border border-white/20 flex items-center justify-center shrink-0 text-[#D4C5A9]">
                <Mail className="size-5 sm:size-6 stroke-[1.8]" />
              </div>
              <div>
                <h3 className="font-heading text-2xl sm:text-3xl font-normal text-white leading-tight">
                  Join Our Community
                </h3>
                <p className="text-xs sm:text-sm text-white/80 font-light mt-1">
                  Subscribe for design tips, new arrivals &amp; exclusive seasonal previews.
                </p>
              </div>
            </div>

            {/* Right Form: Clean White Pill Input */}
            <form
              onSubmit={handleSubmit}
              className="w-full lg:max-w-md flex flex-col sm:flex-row items-center bg-white rounded-2xl sm:rounded-full p-1.5 pl-4 sm:pl-5 shadow-xs gap-2 sm:gap-0 focus-within:ring-2 focus-within:ring-[#D4C5A9]/60 transition-all"
            >
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email address"
                required
                disabled={subscribed}
                className="w-full bg-transparent text-xs sm:text-sm text-[#1A1A1A] placeholder:text-[#6B7280] outline-none h-11 sm:h-10 pr-2 disabled:opacity-50"
              />
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                disabled={subscribed}
                className="h-10 sm:h-11 px-6 rounded-full bg-[#1A1A1A] hover:bg-[#5D6B4D] text-white flex items-center justify-center gap-1.5 text-xs font-semibold tracking-wider uppercase transition-colors shrink-0 cursor-pointer w-full sm:w-auto min-w-[120px]"
              >
                {subscribed ? (
                  <>
                    <Check className="size-3.5 stroke-[2.5]" />
                    <span>Joined</span>
                  </>
                ) : (
                  <>
                    <span>Subscribe</span>
                    <ArrowRight className="size-3.5" />
                  </>
                )}
              </motion.button>
            </form>
          </div>
        </MotionWrapper>
      </div>
    </section>
  );
}
