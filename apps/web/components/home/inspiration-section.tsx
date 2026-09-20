"use client";

import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { MotionWrapper } from "./motion-wrapper";
import { motion } from "framer-motion";

const articles = [
  {
    image:
      "https://images.unsplash.com/photo-1617806118233-18e1de247200?w=700&q=80&fit=crop",
    category: "Design Tips",
    title: "5 Ways to Style Your Dining Room",
    date: "May 12, 2026",
    readTime: "5 min read",
  },
  {
    image:
      "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=700&q=80&fit=crop",
    category: "Inspiration",
    title: "Create a Calm & Cozy Bedroom",
    date: "April 28, 2026",
    readTime: "6 min read",
  },
  {
    image:
      "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=700&q=80&fit=crop",
    category: "Trends",
    title: "Top Interior Design Trends for 2026",
    date: "April 15, 2026",
    readTime: "4 min read",
  },
];

export function InspirationSection() {
  return (
    <section className="py-16 sm:py-20 lg:py-28 bg-[#F8F6F2]">
      <div className="mx-auto max-w-[1280px] px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-start">
          {/* Left Text Content (3 cols) */}
          <MotionWrapper className="lg:col-span-3 flex flex-col justify-between self-stretch pr-0 lg:pr-2">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#6B7280] mb-3">
                Get Inspired
              </p>
              <h2 className="font-heading text-3xl sm:text-4xl font-normal leading-[1.12] text-[#1A1A1A] mb-4">
                Designed to inspire<br />your home
              </h2>
              <p className="text-sm text-[#6B7280] leading-relaxed font-light mb-8 max-w-xs">
                Explore architectural ideas and curated styling guides to create
                spaces that feel uniquely yours.
              </p>
            </div>

            <div className="mt-auto pt-2">
              <Link href="/products">
                <motion.span
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="inline-flex items-center gap-2 rounded-full bg-[#5D6B4D] hover:bg-[#4E5A40] text-white px-6 py-3 text-xs sm:text-sm font-semibold transition-colors shadow-2xs cursor-pointer whitespace-nowrap"
                >
                  Explore Inspiration
                  <ArrowRight className="size-3.5" />
                </motion.span>
              </Link>
            </div>
          </MotionWrapper>

          {/* Right Three Editorial Article Cards (9 cols) */}
          <div className="lg:col-span-9 grid grid-cols-1 sm:grid-cols-3 gap-6 items-stretch">
            {articles.map((article, i) => (
              <MotionWrapper key={article.title} delay={i * 0.1} className="h-full">
                <div className="group bg-white rounded-2xl border border-[#E5E2DC] p-4 shadow-2xs hover:shadow-lg transition-all duration-500 flex flex-col h-full justify-between">
                  {/* Article Image - Equal 16/11 Ratio */}
                  <div className="relative aspect-[16/11] w-full rounded-xl overflow-hidden bg-[#F0EDE8] mb-3.5">
                    <Image
                      src={article.image}
                      alt={article.title}
                      fill
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 33vw, 25vw"
                      className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03]"
                    />
                  </div>

                  {/* Article Meta */}
                  <div className="flex flex-col flex-1">
                    <span className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[#6B7280] mb-2 block">
                      {article.category}
                    </span>
                    <h3 className="text-sm sm:text-[15px] font-medium text-[#1A1A1A] group-hover:text-[#5D6B4D] transition-colors leading-snug line-clamp-2 mb-3">
                      {article.title}
                    </h3>
                    <div className="pt-3 border-t border-[#E5E2DC]/60 mt-auto flex items-center justify-between text-xs text-[#6B7280]">
                      <span>{article.date}</span>
                      <span>{article.readTime}</span>
                    </div>
                  </div>
                </div>
              </MotionWrapper>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
