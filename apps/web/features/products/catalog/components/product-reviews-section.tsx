"use client";

import { useState } from "react";
import Image from "next/image";
import { Star, ThumbsUp, CheckCircle, Camera } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { CatalogProduct } from "../types";

interface ProductReviewsSectionProps {
  product: CatalogProduct;
}

const customerPhotos = [
  "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=300&q=80&fit=crop",
  "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=300&q=80&fit=crop",
  "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=300&q=80&fit=crop",
  "https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?w=300&q=80&fit=crop",
];

const initialReviews = [
  {
    id: 1,
    author: "Elena Rostova",
    location: "Seattle, WA",
    date: "September 14, 2026",
    rating: 5,
    title: "Unmatched craftsmanship & comfort",
    content:
      "This piece exceeded every expectation. The bouclé fabric is rich, textural, and soft to the touch without being fragile. White-glove delivery was flawless—they placed it right in my sunroom and removed the packaging within 15 minutes.",
    helpful: 24,
    verified: true,
  },
  {
    id: 2,
    author: "Marcus Sterling",
    location: "Austin, TX",
    date: "August 29, 2026",
    rating: 5,
    title: "The centerpiece of our living room",
    content:
      "We spent months searching through RH and CB2 before discovering UrbanNest. The wood joinery and solid feel are extraordinary for this price point. Clean lines, deep comfortable seating, and beautiful proportions.",
    helpful: 19,
    verified: true,
  },
  {
    id: 3,
    author: "Sophia Vanderberg",
    location: "New York, NY",
    date: "August 12, 2026",
    rating: 4,
    title: "Gorgeous design and sturdy structure",
    content:
      "Stunning design. Fabric color is true to the website swatches. It has a medium-firm supportive seat which I prefer for posture. Only docking one star because delivery took 7 business days instead of 5.",
    helpful: 8,
    verified: true,
  },
];

export function ProductReviewsSection({ product }: ProductReviewsSectionProps) {
  const [reviews, setReviews] = useState(initialReviews);
  const [helpfulClicked, setHelpfulClicked] = useState<Record<number, boolean>>({});

  const handleHelpful = (id: number) => {
    if (helpfulClicked[id]) return;
    setHelpfulClicked((prev) => ({ ...prev, [id]: true }));
    setReviews((prev) =>
      prev.map((r) => (r.id === id ? { ...r, helpful: r.helpful + 1 } : r))
    );
  };

  return (
    <div className="space-y-10">
      {/* 1. Review Summary Header: Rating Score + Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 p-6 sm:p-8 rounded-2xl bg-[#F8F6F2] border border-[#E5E2DC]">
        {/* Left Score Block */}
        <div className="lg:col-span-4 flex flex-col justify-center items-center text-center sm:border-r sm:border-[#E5E2DC] sm:pr-8">
          <span className="font-heading text-5xl sm:text-6xl font-normal text-[#1A1A1A]">
            4.9
          </span>
          <div className="flex items-center gap-1 my-2">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className="size-4 fill-amber-400 text-amber-400" />
            ))}
          </div>
          <p className="text-xs text-[#6B7280]">
            Based on <strong className="text-[#1A1A1A]">128 verified customer reviews</strong>
          </p>
          <p className="text-xs text-emerald-700 font-medium mt-1">
            98% of owners recommend this piece
          </p>
        </div>

        {/* Right Star Breakdown Bars */}
        <div className="lg:col-span-8 flex flex-col justify-center space-y-2">
          {[
            { stars: 5, pct: 88, count: 112 },
            { stars: 4, pct: 9, count: 12 },
            { stars: 3, pct: 2, count: 3 },
            { stars: 2, pct: 1, count: 1 },
            { stars: 1, pct: 0, count: 0 },
          ].map((bar) => (
            <div key={bar.stars} className="flex items-center gap-3 text-xs">
              <span className="w-12 text-[#1A1A1A] font-medium shrink-0 flex items-center gap-1">
                {bar.stars} <Star className="size-3 fill-amber-400 text-amber-400" />
              </span>
              <div className="flex-1 h-2 rounded-full bg-[#E5E2DC] overflow-hidden">
                <div
                  className="h-full rounded-full bg-[#5D6B4D]"
                  style={{ width: `${bar.pct}%` }}
                />
              </div>
              <span className="w-10 text-right text-[#6B7280] font-mono shrink-0">
                {bar.pct}%
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* 2. Real Customer Photos Gallery */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Camera className="size-4 text-[#5D6B4D]" />
            <h4 className="text-sm font-semibold text-[#1A1A1A]">
              Customer Room Submissions ({customerPhotos.length})
            </h4>
          </div>
          <span className="text-xs text-[#6B7280]">Styled in real homes</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {customerPhotos.map((url, i) => (
            <div
              key={i}
              className="relative aspect-square rounded-xl overflow-hidden bg-[#F0EDE8] border border-[#E5E2DC] group cursor-pointer"
            >
              <Image
                src={url}
                alt={`Customer room submission ${i + 1}`}
                fill
                sizes="(max-width: 640px) 50vw, 25vw"
                className="object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white text-xs font-medium">
                Verified Photo
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 3. Verified Customer Review Cards */}
      <div className="space-y-4 pt-2">
        <div className="flex items-center justify-between">
          <h4 className="text-base font-semibold text-[#1A1A1A]">
            Customer Reviews
          </h4>
          <span className="text-xs text-[#6B7280]">Showing verified purchases</span>
        </div>

        <div className="divide-y divide-[#E5E2DC] border-t border-[#E5E2DC]">
          {reviews.map((rev) => (
            <div key={rev.id} className="py-6 space-y-3">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-sm text-[#1A1A1A]">
                      {rev.author}
                    </span>
                    {rev.verified && (
                      <span className="inline-flex items-center gap-1 text-[11px] font-medium text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                        <CheckCircle className="size-3" />
                        Verified Buyer
                      </span>
                    )}
                  </div>
                  <span className="text-xs text-[#6B7280]">
                    {rev.location} • {rev.date}
                  </span>
                </div>

                {/* Rating Stars */}
                <div className="flex items-center gap-0.5">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`size-3.5 ${
                        i < rev.rating
                          ? "fill-amber-400 text-amber-400"
                          : "text-[#E5E2DC]"
                      }`}
                    />
                  ))}
                </div>
              </div>

              {/* Review Title & Content */}
              <div className="space-y-1">
                <h5 className="text-sm font-semibold text-[#1A1A1A]">
                  {rev.title}
                </h5>
                <p className="text-xs sm:text-sm text-[#4A4A4A] leading-relaxed font-light">
                  {rev.content}
                </p>
              </div>

              {/* Helpful vote */}
              <div className="flex items-center gap-2 pt-1 text-xs text-[#6B7280]">
                <span>Was this review helpful?</span>
                <button
                  type="button"
                  onClick={() => handleHelpful(rev.id)}
                  disabled={helpfulClicked[rev.id]}
                  className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md border text-xs transition-colors cursor-pointer ${
                    helpfulClicked[rev.id]
                      ? "border-[#5D6B4D] bg-[#5D6B4D]/10 text-[#5D6B4D] font-semibold"
                      : "border-[#E5E2DC] hover:bg-[#F0EDE8] text-[#1A1A1A]"
                  }`}
                >
                  <ThumbsUp className="size-3" />
                  <span>{rev.helpful}</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
