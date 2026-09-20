"use client";

import Link from "next/link";
import {
  Sofa,
  Armchair,
  Table as TableIcon,
  Bed,
  Archive,
  Lamp,
  Flower2,
  TreePine,
} from "lucide-react";
import { MotionWrapper } from "./motion-wrapper";
import { motion } from "framer-motion";

const categories = [
  { name: "Sofas & Couches", slug: "living-room", icon: Sofa },
  { name: "Chairs", slug: "living-room", icon: Armchair },
  { name: "Tables", slug: "dining-room", icon: TableIcon },
  { name: "Beds", slug: "bedroom", icon: Bed },
  { name: "Storage", slug: "home-office", icon: Archive },
  { name: "Lighting", slug: "home-office", icon: Lamp },
  { name: "Decor", slug: "living-room", icon: Flower2 },
  { name: "Outdoor", slug: "outdoor", icon: TreePine },
];

export function CategoriesSection() {
  return (
    <section className="py-16 sm:py-20 lg:py-24 bg-[#F8F6F2]">
      <div className="mx-auto max-w-[1280px] px-4 sm:px-6 lg:px-8">
        <MotionWrapper>
          <div className="grid grid-cols-4 sm:grid-cols-8 gap-5 sm:gap-6 lg:gap-8 justify-items-center items-start">
            {categories.map((cat) => {
              const Icon = cat.icon;
              return (
                <Link
                  key={cat.name}
                  href={`/products?category=${cat.slug}`}
                  className="flex flex-col items-center group w-full max-w-[110px]"
                >
                  {/* 100px Circular Icon Container */}
                  <motion.div
                    whileHover={{ y: -3, scale: 1.04 }}
                    transition={{ type: "spring", stiffness: 350, damping: 25 }}
                    className="size-[84px] sm:size-[100px] rounded-full bg-white border border-[#E5E2DC] flex items-center justify-center shadow-2xs group-hover:border-[#5D6B4D]/50 group-hover:shadow-md transition-all duration-300"
                  >
                    <Icon className="size-6 sm:size-7 text-[#1A1A1A]/80 group-hover:text-[#5D6B4D] stroke-[1.4] transition-colors" />
                  </motion.div>

                  {/* Label Beneath Icon */}
                  <span className="text-xs sm:text-[13px] font-medium text-[#1A1A1A] group-hover:text-[#5D6B4D] transition-colors text-center mt-3 leading-snug">
                    {cat.name}
                  </span>
                </Link>
              );
            })}
          </div>
        </MotionWrapper>
      </div>
    </section>
  );
}
