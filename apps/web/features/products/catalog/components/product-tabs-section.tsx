"use client";

import { useState } from "react";
import {
  FileText,
  Sliders,
  Ruler,
  Truck,
  MessageSquare,
  CheckCircle2,
  PackageCheck,
  ShieldAlert,
} from "lucide-react";
import type { CatalogProduct } from "../types";
import { ProductReviewsSection } from "./product-reviews-section";

interface ProductTabsSectionProps {
  product: CatalogProduct;
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const TABS = [
  { id: "description", label: "Description", icon: FileText },
  { id: "specifications", label: "Specifications", icon: Sliders },
  { id: "dimensions", label: "Dimensions", icon: Ruler },
  { id: "shipping", label: "Shipping & Returns", icon: Truck },
  { id: "reviews", label: "Reviews (128)", icon: MessageSquare },
];

export function ProductTabsSection({
  product,
  activeTab,
  onTabChange,
}: ProductTabsSectionProps) {
  return (
    <div className="w-full bg-white rounded-3xl border border-[#E5E2DC] shadow-xs p-6 sm:p-10 lg:p-12 space-y-8">
      {/* Tab Navigation Header */}
      <div className="flex items-center gap-2 overflow-x-auto pb-3 border-b border-[#E5E2DC] scrollbar-none">
        {TABS.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => onTabChange(tab.id)}
              className={`flex items-center gap-2 px-5 py-3 rounded-full text-xs sm:text-sm font-semibold transition-all cursor-pointer whitespace-nowrap ${
                isActive
                  ? "bg-[#5D6B4D] text-white shadow-xs"
                  : "bg-transparent text-[#6B7280] hover:text-[#1A1A1A] hover:bg-[#F0EDE8]"
              }`}
            >
              <Icon className="size-4" />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Tab Contents */}
      <div className="pt-2">
        {/* 1. Description Tab */}
        {activeTab === "description" && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16">
            <div className="lg:col-span-7 space-y-6">
              <div>
                <h3 className="font-heading text-2xl font-normal text-[#1A1A1A] mb-3">
                  The Design Story
                </h3>
                <p className="text-sm sm:text-base text-[#4A4A4A] leading-relaxed font-light">
                  {product.description}
                </p>
                <p className="text-sm sm:text-base text-[#4A4A4A] leading-relaxed font-light mt-4">
                  Born from an appreciation for architectural simplicity and tactile warmth, this piece
                  anchors the living space with quiet confidence. Every contour is gently curved to soften
                  modern interiors, providing an inviting retreat after long days.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div className="p-4 rounded-xl bg-[#F8F6F2] border border-[#E5E2DC]/80 space-y-1.5">
                  <span className="text-xs font-semibold uppercase tracking-wider text-[#5D6B4D]">
                    Sculptural Balance
                  </span>
                  <p className="text-xs text-[#6B7280] leading-relaxed">
                    Designed to look beautiful from every angle, making it ideal for floating in open-concept spaces.
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-[#F8F6F2] border border-[#E5E2DC]/80 space-y-1.5">
                  <span className="text-xs font-semibold uppercase tracking-wider text-[#5D6B4D]">
                    Enduring Comfort
                  </span>
                  <p className="text-xs text-[#6B7280] leading-relaxed">
                    Multi-layer foam density engineered to retain its loft without sagging over years of daily use.
                  </p>
                </div>
              </div>
            </div>

            <div className="lg:col-span-5 space-y-6 lg:border-l lg:border-[#E5E2DC] lg:pl-10">
              <h4 className="font-heading text-xl font-normal text-[#1A1A1A]">
                Craftsmanship &amp; Highlights
              </h4>
              <ul className="space-y-3.5 text-sm text-[#4A4A4A]">
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="size-4 text-[#5D6B4D] shrink-0 mt-0.5" />
                  <span>Handcrafted from kiln-dried, FSC®-certified solid hardwood frame.</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="size-4 text-[#5D6B4D] shrink-0 mt-0.5" />
                  <span>Reinforced corner blocks and mortise-and-tenon joinery for structural rigidity.</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="size-4 text-[#5D6B4D] shrink-0 mt-0.5" />
                  <span>Sinuous steel spring suspension with silent insulated clip anchors.</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="size-4 text-[#5D6B4D] shrink-0 mt-0.5" />
                  <span>OEKO-TEX® Standard 100 certified upholstery free of harmful chemicals.</span>
                </li>
              </ul>
            </div>
          </div>
        )}

        {/* 2. Specifications Tab */}
        {activeTab === "specifications" && (
          <div className="max-w-4xl space-y-6">
            <h3 className="font-heading text-2xl font-normal text-[#1A1A1A]">
              Technical Specifications
            </h3>
            <div className="divide-y divide-[#E5E2DC] border border-[#E5E2DC] rounded-2xl overflow-hidden bg-[#F8F6F2]/40">
              <div className="grid grid-cols-1 sm:grid-cols-3 p-4 text-xs sm:text-sm">
                <span className="font-semibold text-[#1A1A1A]">Frame Construction</span>
                <span className="sm:col-span-2 text-[#6B7280]">
                  Kiln-dried solid beech and engineered hardwood, double-doweled and glued.
                </span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 p-4 text-xs sm:text-sm">
                <span className="font-semibold text-[#1A1A1A]">Cushion Core</span>
                <span className="sm:col-span-2 text-[#6B7280]">
                  High-resilience foam core (2.8 lb density) wrapped in hypoallergenic down-blend fiber.
                </span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 p-4 text-xs sm:text-sm">
                <span className="font-semibold text-[#1A1A1A]">Upholstery Rub Count</span>
                <span className="sm:col-span-2 text-[#6B7280]">
                  50,000+ Martindale cycles (Commercial &amp; Heavy Residential Grade).
                </span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 p-4 text-xs sm:text-sm">
                <span className="font-semibold text-[#1A1A1A]">Suspension</span>
                <span className="sm:col-span-2 text-[#6B7280]">
                  Heavy gauge 8-way hand-tied sinuous springs with sound-deadening wire insulators.
                </span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 p-4 text-xs sm:text-sm">
                <span className="font-semibold text-[#1A1A1A]">Care Instructions</span>
                <span className="sm:col-span-2 text-[#6B7280]">
                  Vacuum periodically with soft brush attachment. Spot clean water-based spills immediately with a clean, damp cloth.
                </span>
              </div>
            </div>
          </div>
        )}

        {/* 3. Dimensions Tab */}
        {activeTab === "dimensions" && (
          <div className="space-y-8">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h3 className="font-heading text-2xl font-normal text-[#1A1A1A]">
                  Detailed Dimensions &amp; Fit Guide
                </h3>
                <p className="text-sm text-[#6B7280] font-light mt-1">
                  Ensure seamless doorway clearance and ideal room proportions before delivery.
                </p>
              </div>
              <span className="text-xs font-semibold text-[#5D6B4D] bg-[#5D6B4D]/10 px-3 py-1.5 rounded-full border border-[#5D6B4D]/20 self-start sm:self-auto">
                Fits 32" Doorways or Larger
              </span>
            </div>

            {/* Premium Dimension Table */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
              <div className="p-4 rounded-2xl bg-[#F8F6F2] border border-[#E5E2DC] text-center space-y-1">
                <span className="text-xs text-[#6B7280] uppercase tracking-wider font-medium">Overall Width</span>
                <p className="text-xl sm:text-2xl font-semibold text-[#1A1A1A]">88"</p>
                <span className="text-[11px] text-[#6B7280]">224 cm</span>
              </div>

              <div className="p-4 rounded-2xl bg-[#F8F6F2] border border-[#E5E2DC] text-center space-y-1">
                <span className="text-xs text-[#6B7280] uppercase tracking-wider font-medium">Overall Depth</span>
                <p className="text-xl sm:text-2xl font-semibold text-[#1A1A1A]">38"</p>
                <span className="text-[11px] text-[#6B7280]">97 cm</span>
              </div>

              <div className="p-4 rounded-2xl bg-[#F8F6F2] border border-[#E5E2DC] text-center space-y-1">
                <span className="text-xs text-[#6B7280] uppercase tracking-wider font-medium">Overall Height</span>
                <p className="text-xl sm:text-2xl font-semibold text-[#1A1A1A]">32"</p>
                <span className="text-[11px] text-[#6B7280]">81 cm</span>
              </div>

              <div className="p-4 rounded-2xl bg-[#F8F6F2] border border-[#E5E2DC] text-center space-y-1">
                <span className="text-xs text-[#6B7280] uppercase tracking-wider font-medium">Seat Height</span>
                <p className="text-xl sm:text-2xl font-semibold text-[#1A1A1A]">18.5"</p>
                <span className="text-[11px] text-[#6B7280]">47 cm</span>
              </div>

              <div className="p-4 rounded-2xl bg-[#F8F6F2] border border-[#E5E2DC] text-center space-y-1">
                <span className="text-xs text-[#6B7280] uppercase tracking-wider font-medium">Seat Depth</span>
                <p className="text-xl sm:text-2xl font-semibold text-[#1A1A1A]">24"</p>
                <span className="text-[11px] text-[#6B7280]">61 cm</span>
              </div>

              <div className="p-4 rounded-2xl bg-[#F8F6F2] border border-[#E5E2DC] text-center space-y-1">
                <span className="text-xs text-[#6B7280] uppercase tracking-wider font-medium">Net Weight</span>
                <p className="text-xl sm:text-2xl font-semibold text-[#1A1A1A]">142 lbs</p>
                <span className="text-[11px] text-[#6B7280]">64 kg</span>
              </div>
            </div>

            {/* Packaging & Weight Details */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div className="p-5 rounded-2xl border border-[#E5E2DC] bg-white flex items-start gap-4">
                <PackageCheck className="size-6 text-[#5D6B4D] shrink-0 mt-1" />
                <div className="space-y-1 text-xs">
                  <strong className="block text-sm font-semibold text-[#1A1A1A]">
                    Packaging Box Dimensions
                  </strong>
                  <p className="text-[#6B7280]">
                    Shipped in 1 protective wooden crate: 91"W × 41"D × 35"H (160 lbs).
                  </p>
                </div>
              </div>

              <div className="p-5 rounded-2xl border border-[#E5E2DC] bg-white flex items-start gap-4">
                <ShieldAlert className="size-6 text-[#5D6B4D] shrink-0 mt-1" />
                <div className="space-y-1 text-xs">
                  <strong className="block text-sm font-semibold text-[#1A1A1A]">
                    Doorway &amp; Elevator Verification
                  </strong>
                  <p className="text-[#6B7280]">
                    Legs are removable for passage through hallways, tight stairwells, and elevators.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 4. Shipping & Returns Tab */}
        {activeTab === "shipping" && (
          <div className="max-w-4xl space-y-6">
            <h3 className="font-heading text-2xl font-normal text-[#1A1A1A]">
              White Glove Delivery &amp; Returns
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="p-6 rounded-2xl bg-[#F8F6F2] border border-[#E5E2DC] space-y-3">
                <span className="size-9 rounded-full bg-[#5D6B4D]/10 text-[#5D6B4D] flex items-center justify-center font-bold text-sm">
                  1
                </span>
                <h4 className="font-semibold text-base text-[#1A1A1A]">
                  White-Glove In-Home Placement
                </h4>
                <p className="text-xs sm:text-sm text-[#6B7280] leading-relaxed">
                  Our professional delivery team will transport this piece to your room of choice, assemble
                  any components, inspect the upholstery, and remove all packaging materials.
                </p>
              </div>

              <div className="p-6 rounded-2xl bg-[#F8F6F2] border border-[#E5E2DC] space-y-3">
                <span className="size-9 rounded-full bg-[#5D6B4D]/10 text-[#5D6B4D] flex items-center justify-center font-bold text-sm">
                  2
                </span>
                <h4 className="font-semibold text-base text-[#1A1A1A]">
                  30-Day Risk-Free In-Home Trial
                </h4>
                <p className="text-xs sm:text-sm text-[#6B7280] leading-relaxed">
                  Experience your new furniture piece in your home for 30 days. If you are not completely
                  in love, contact our concierge for a hassle-free return and full refund.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* 5. Reviews Tab */}
        {activeTab === "reviews" && (
          <ProductReviewsSection product={product} />
        )}
      </div>
    </div>
  );
}
