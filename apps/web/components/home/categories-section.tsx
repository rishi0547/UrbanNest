"use client";

import Link from "next/link";
import Image from "next/image";
import { MotionWrapper } from "./motion-wrapper";
import { motion } from "framer-motion";

const categories = [
  {
    name: "Living Room",
    slug: "living-room",
    image: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=500&q=80&fit=crop",
  },
  {
    name: "Bedroom",
    slug: "bedroom",
    image: "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=500&q=80&fit=crop",
  },
  {
    name: "Dining Room",
    slug: "dining-room",
    image: "https://images.unsplash.com/photo-1615066390971-03e4e1c36ddf?w=500&q=80&fit=crop",
  },
  {
    name: "Home Office",
    slug: "home-office",
    image: "https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?w=500&q=80&fit=crop",
  },
  {
    name: "Storage",
    slug: "storage",
    image: "https://images.unsplash.com/photo-1538688525198-9b88f6f53126?w=500&q=80&fit=crop",
  },
  {
    name: "Lighting",
    slug: "all",
    image: "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=500&q=80&fit=crop",
  },
  {
    name: "Decor & Accents",
    slug: "all",
    image: "https://images.unsplash.com/photo-1616486029423-aaa4789e8c9a?w=500&q=80&fit=crop",
  },
];

export function CategoriesSection() {
  return (
    <section className="pt-12 sm:pt-16 pb-12 sm:pb-16 bg-[#F8F6F2]">
      {/* Unified 1440px Master Container */}
      <div className="w-full max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
        <MotionWrapper>
          {/* Centered Editorial Header */}
          <div className="text-center mb-10 sm:mb-12">
            <span className="text-[11px] font-semibold uppercase tracking-[0.25em] text-[#5D6B4D] block mb-2">
              Collections
            </span>
            <h2 className="font-heading text-2xl sm:text-3xl lg:text-4xl font-normal text-[#1A1A1A] tracking-tight">
              Shop by Category
            </h2>
            <p className="mt-2 text-xs sm:text-sm text-[#6B7280] font-light max-w-md mx-auto">
              Find architectural pieces handcrafted for every room in your home.
            </p>
          </div>

          {/* 7 Circular Category Items Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-5 sm:gap-6 lg:gap-6 justify-items-center">
            {categories.map((cat, i) => (
              <motion.div
                key={cat.name}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05, duration: 0.4 }}
                className="w-full flex flex-col items-center"
              >
                <Link
                  href={`/products?category=${cat.slug}`}
                  className="group flex flex-col items-center text-center w-full focus:outline-none"
                >
                  {/* Circular Image Container */}
                  <div className="relative size-24 sm:size-28 lg:size-32 rounded-full overflow-hidden border-2 border-[#E5E2DC] p-1 bg-white shadow-2xs group-hover:border-[#5D6B4D] group-hover:shadow-md transition-all duration-300">
                    <div className="relative size-full rounded-full overflow-hidden bg-[#F0EDE8]">
                      <Image
                        src={cat.image}
                        alt={cat.name}
                        fill
                        sizes="(max-width: 640px) 100px, 140px"
                        className="object-cover transition-transform duration-500 ease-out group-hover:scale-110"
                      />
                    </div>
                  </div>

                  {/* Category Title Beneath */}
                  <span className="mt-3.5 text-xs sm:text-sm font-medium text-[#1A1A1A] group-hover:text-[#5D6B4D] transition-colors leading-tight">
                    {cat.name}
                  </span>
                </Link>
              </motion.div>
            ))}
          </div>
        </MotionWrapper>
      </div>
    </section>
  );
}
