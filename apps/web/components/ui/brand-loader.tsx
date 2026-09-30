"use client";

import React from "react";
import { cn } from "@/lib/utils";

interface BrandLoaderProps {
  isExiting?: boolean;
  className?: string;
  fullscreen?: boolean;
}

export function BrandLoader({
  isExiting = false,
  className,
  fullscreen = true,
}: BrandLoaderProps) {
  return (
    <div
      role="status"
      aria-live="polite"
      aria-label="Loading UrbanNest"
      className={cn(
        "flex flex-col items-center justify-center bg-[#F8F6F2] select-none",
        fullscreen
          ? "fixed inset-0 z-[100] min-h-screen w-screen"
          : "w-full min-h-[60vh] py-16",
        isExiting
          ? "opacity-0 transition-opacity duration-350 ease-out pointer-events-none"
          : "opacity-100",
        className
      )}
    >
      <div
        className={cn(
          "flex flex-col items-center justify-center transition-all duration-350 ease-out",
          isExiting ? "scale-[0.97] opacity-0" : "scale-100 opacity-100"
        )}
      >
        {/* Subtle Architectural Horizontal Accent Hairstyle */}
        <div className="relative flex items-center justify-center mb-5 sm:mb-6">
          {/* Subtle architectural background hairline */}
          <div
            className={cn(
              "absolute h-[1px] bg-[#5D6B4D]/25 transition-all duration-350 ease-out pointer-events-none",
              isExiting ? "w-0 opacity-0" : "w-32 sm:w-40 un-arch-line"
            )}
          />

          {/* Central UN Brand Monogram Mark */}
          <div
            className={cn(
              "relative z-10 size-14 sm:size-16 rounded-2xl bg-white border border-[#E5E2DC] shadow-xs flex items-center justify-center transition-all duration-350 ease-out un-logo-reveal",
              isExiting ? "scale-95 opacity-0" : "scale-100 opacity-100"
            )}
          >
            <span className="font-heading font-semibold text-lg sm:text-xl text-[#1A1A1A] tracking-wider">
              UN
            </span>
          </div>
        </div>

        {/* Editorial Decorative Line */}
        <div className="h-[1px] flex items-center justify-center my-3 sm:my-3.5 overflow-hidden">
          <div
            className={cn(
              "h-full bg-[#5D6B4D]/70 rounded-full transition-all duration-350 ease-out",
              isExiting ? "w-0 opacity-0" : "w-12 sm:w-14 un-line-expand"
            )}
          />
        </div>

        {/* Refined Editorial Typography */}
        <div
          className={cn(
            "mt-2 mb-4 text-center transition-all duration-350 ease-out",
            isExiting ? "opacity-0 -translate-y-1" : "opacity-100 translate-y-0 un-text-reveal"
          )}
        >
          <span className="text-[10px] sm:text-[11px] uppercase tracking-[0.32em] text-[#6B7280] font-medium block">
            Loading UrbanNest
          </span>
        </div>

        {/* Three Refined Progress Dots (gentle in-place pulse in sequence, no vertical jumping) */}
        <div
          className={cn(
            "flex items-center gap-2 mt-1 transition-opacity duration-300",
            isExiting ? "opacity-0" : "opacity-100"
          )}
        >
          <span className="size-1.5 rounded-full bg-[#5D6B4D] un-dot-pulse-1" />
          <span className="size-1.5 rounded-full bg-[#5D6B4D] un-dot-pulse-2" />
          <span className="size-1.5 rounded-full bg-[#5D6B4D] un-dot-pulse-3" />
        </div>
      </div>
    </div>
  );
}
