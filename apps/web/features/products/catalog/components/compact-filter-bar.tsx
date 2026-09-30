"use client";

import React from "react";
import {
  Search,
  X,
  Sparkles,
  SlidersHorizontal,
  Layers,
  ArrowUpDown,
  RotateCcw,
} from "lucide-react";
import type { CatalogFilterOptions } from "../types";

export const CATEGORY_CHIPS = [
  { name: "All", slug: "all" },
  { name: "Living Room", slug: "living-room" },
  { name: "Bedroom", slug: "bedroom" },
  { name: "Dining Room", slug: "dining-room" },
  { name: "Home Office", slug: "home-office" },
  { name: "Storage", slug: "storage" },
  { name: "Lighting", slug: "lighting" },
  { name: "Decor & Accents", slug: "decor-accents" },
];

export const PRICE_OPTIONS = [
  { label: "Price: All", value: "all" },
  { label: "Under ₹10,000", value: "under-10k" },
  { label: "₹10,000 – ₹25,000", value: "10k-25k" },
  { label: "₹25,000+", value: "above-25k" },
];

export const MATERIAL_OPTIONS = [
  { label: "Material: All", value: "all" },
  { label: "Solid Hardwood", value: "wood" },
  { label: "Tactile Bouclé", value: "boucle" },
  { label: "Travertine & Stone", value: "stone" },
];

export const SORT_OPTIONS = [
  { label: "Sort: Newest Arrivals", value: "newest" },
  { label: "Sort: Price (Low to High)", value: "price_asc" },
  { label: "Sort: Price (High to Low)", value: "price_desc" },
];

interface CompactFilterBarProps {
  searchQuery: string;
  onSearchChange: (val: string) => void;
  selectedCategory: string;
  onCategoryChange: (slug: string) => void;
  sortBy: CatalogFilterOptions["sortBy"];
  onSortChange: (sort: CatalogFilterOptions["sortBy"]) => void;
  featuredOnly: boolean;
  onFeaturedChange: (featured: boolean) => void;
  priceRange: string;
  onPriceRangeChange: (val: string) => void;
  materialFilter: string;
  onMaterialChange: (val: string) => void;
  onResetFilters: () => void;
  totalCount: number;
}

export function CompactFilterBar({
  searchQuery,
  onSearchChange,
  selectedCategory,
  onCategoryChange,
  sortBy,
  onSortChange,
  featuredOnly,
  onFeaturedChange,
  priceRange,
  onPriceRangeChange,
  materialFilter,
  onMaterialChange,
  onResetFilters,
  totalCount,
}: CompactFilterBarProps) {
  const isFiltered =
    selectedCategory !== "all" ||
    searchQuery.trim() !== "" ||
    featuredOnly ||
    priceRange !== "all" ||
    materialFilter !== "all";

  return (
    <div id="catalog-filter-bar" className="w-full space-y-6 sm:space-y-7">
      {/* ========================================================
          1. SEARCH / DISCOVERY AREA
          Wide, prominent search field aligned to content grid
          ======================================================== */}
      <div className="w-full max-w-xl">
        <div className="relative flex items-center w-full">
          <Search className="absolute left-4 size-4.5 text-[#6B7280] pointer-events-none transition-colors" />
          <input
            type="text"
            placeholder="Search handcrafted furniture..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full h-11 sm:h-12 pl-11 pr-10 rounded-full border border-[#E5E2DC] bg-white text-xs sm:text-sm font-normal text-[#1A1A1A] placeholder:text-[#6B7280] shadow-xs outline-none transition-all duration-200 hover:border-[#C5C0B6] focus:border-[#5D6B4D] focus:ring-1 focus:ring-[#5D6B4D]/30"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => onSearchChange("")}
              aria-label="Clear search"
              className="absolute right-3.5 size-6 rounded-full flex items-center justify-center text-[#6B7280] hover:text-[#1A1A1A] hover:bg-[#F0EDE8] transition-colors cursor-pointer"
            >
              <X className="size-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* ========================================================
          2. SHOP BY CATEGORY
          Editorial label + Spacious, unclipped category pills
          ======================================================== */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-semibold uppercase tracking-[0.25em] text-[#5D6B4D] block">
            Shop by Category
          </span>
          <span className="text-xs text-[#6B7280] font-light hidden sm:inline-block">
            {selectedCategory === "all"
              ? "All collections"
              : CATEGORY_CHIPS.find((c) => c.slug === selectedCategory)?.name}
          </span>
        </div>

        {/* Category Pills Container:
            - Desktop: flex-wrap with comfortable gaps, zero clipping
            - Mobile: smooth horizontal swipe container with no clipping */}
        <div className="flex items-center gap-2 sm:gap-2.5 overflow-x-auto pb-2 -mx-4 px-4 sm:mx-0 sm:px-0 sm:overflow-visible sm:flex-wrap scrollbar-none">
          {CATEGORY_CHIPS.map((chip) => {
            const isActive = selectedCategory === chip.slug;
            return (
              <button
                key={chip.slug}
                type="button"
                onClick={() => onCategoryChange(chip.slug)}
                className={`px-4 sm:px-5 py-2 sm:py-2.5 rounded-full text-xs font-medium transition-all duration-200 cursor-pointer whitespace-nowrap shrink-0 min-h-[40px] sm:min-h-[38px] ${
                  isActive
                    ? "bg-[#5D6B4D] border border-[#5D6B4D] text-white shadow-2xs font-semibold"
                    : "bg-[#F8F6F2] border border-[#E5E2DC] text-[#4A4A4A] hover:bg-[#EFECE6] hover:border-[#D0CCC3] hover:text-[#1A1A1A]"
                }`}
              >
                {chip.name}
              </button>
            );
          })}
        </div>
      </div>

      {/* ========================================================
          3. SEPARATOR & FILTER / RESULT ROW
          Refined editorial divider leading into filters
          ======================================================== */}
      <div className="pt-3 sm:pt-4 border-t border-[#E5E2DC]/80 space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          {/* Result Count + Active Status */}
          <div className="flex flex-wrap items-center gap-3">
            <div className="text-xs sm:text-sm text-[#6B7280]">
              Showing{" "}
              <strong className="text-[#1A1A1A] font-semibold text-sm sm:text-base">
                {totalCount}
              </strong>{" "}
              {totalCount === 1 ? "handcrafted piece" : "handcrafted pieces"}
              {selectedCategory !== "all" && (
                <span className="text-[#6B7280]">
                  {" "}in{" "}
                  <span className="text-[#5D6B4D] font-medium capitalize">
                    {CATEGORY_CHIPS.find((c) => c.slug === selectedCategory)?.name || selectedCategory.replace("-", " ")}
                  </span>
                </span>
              )}
            </div>

            {/* Clear all action when filters applied */}
            {isFiltered && (
              <button
                type="button"
                onClick={onResetFilters}
                className="text-xs text-[#5D6B4D] hover:text-[#1A1A1A] font-medium underline underline-offset-4 flex items-center gap-1 transition-colors cursor-pointer ml-1"
              >
                <RotateCcw className="size-3" />
                Clear all filters
              </button>
            )}
          </div>

          {/* Right: Compact Refined Filter Controls */}
          <div className="flex flex-wrap items-center gap-2 sm:gap-2.5">
            {/* Featured Only Toggle Button */}
            <button
              type="button"
              onClick={() => onFeaturedChange(!featuredOnly)}
              className={`h-9 sm:h-10 min-h-[38px] px-3.5 rounded-full text-xs font-medium inline-flex items-center gap-1.5 transition-all duration-200 cursor-pointer shrink-0 ${
                featuredOnly
                  ? "bg-[#5D6B4D] text-white border border-[#5D6B4D] shadow-2xs font-semibold"
                  : "bg-white border border-[#E5E2DC] text-[#4A4A4A] hover:bg-[#F8F6F2] hover:border-[#D0CCC3] hover:text-[#1A1A1A]"
              }`}
            >
              <Sparkles className={`size-3.5 ${featuredOnly ? "text-amber-300 fill-amber-300" : "text-[#6B7280]"}`} />
              <span>Featured</span>
            </button>

            {/* Price Filter Dropdown */}
            <div className="relative inline-flex items-center shrink-0">
              <SlidersHorizontal className="absolute left-3.5 size-3.5 text-[#6B7280] pointer-events-none" />
              <select
                value={priceRange}
                aria-label="Filter by Price"
                onChange={(e) => onPriceRangeChange(e.target.value)}
                className={`h-9 sm:h-10 min-h-[38px] rounded-full border pl-8.5 pr-7 text-xs font-medium appearance-none outline-none transition-all duration-200 cursor-pointer ${
                  priceRange !== "all"
                    ? "bg-[#F0EDE8] border-[#5D6B4D] text-[#1A1A1A] font-semibold"
                    : "bg-white border-[#E5E2DC] text-[#4A4A4A] hover:border-[#C5C0B6] hover:text-[#1A1A1A] focus:border-[#5D6B4D]"
                }`}
              >
                {PRICE_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
              <span className="absolute right-2.5 text-[#6B7280] pointer-events-none text-[9px]">▼</span>
            </div>

            {/* Material Filter Dropdown */}
            <div className="relative inline-flex items-center shrink-0">
              <Layers className="absolute left-3.5 size-3.5 text-[#6B7280] pointer-events-none" />
              <select
                value={materialFilter}
                aria-label="Filter by Material"
                onChange={(e) => onMaterialChange(e.target.value)}
                className={`h-9 sm:h-10 min-h-[38px] rounded-full border pl-8.5 pr-7 text-xs font-medium appearance-none outline-none transition-all duration-200 cursor-pointer ${
                  materialFilter !== "all"
                    ? "bg-[#F0EDE8] border-[#5D6B4D] text-[#1A1A1A] font-semibold"
                    : "bg-white border-[#E5E2DC] text-[#4A4A4A] hover:border-[#C5C0B6] hover:text-[#1A1A1A] focus:border-[#5D6B4D]"
                }`}
              >
                {MATERIAL_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
              <span className="absolute right-2.5 text-[#6B7280] pointer-events-none text-[9px]">▼</span>
            </div>

            {/* Sort Dropdown */}
            <div className="relative inline-flex items-center shrink-0">
              <ArrowUpDown className="absolute left-3.5 size-3.5 text-[#6B7280] pointer-events-none" />
              <select
                value={sortBy}
                aria-label="Sort products"
                onChange={(e) => onSortChange(e.target.value as CatalogFilterOptions["sortBy"])}
                className="h-9 sm:h-10 min-h-[38px] rounded-full border border-[#E5E2DC] bg-white pl-8.5 pr-7 text-xs font-medium text-[#4A4A4A] hover:border-[#C5C0B6] hover:text-[#1A1A1A] focus:border-[#5D6B4D] appearance-none outline-none transition-all duration-200 cursor-pointer"
              >
                {SORT_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
              <span className="absolute right-2.5 text-[#6B7280] pointer-events-none text-[9px]">▼</span>
            </div>
          </div>
        </div>

        {/* Active Filter Chips Row (shown when filters are selected) */}
        {isFiltered && (
          <div className="flex flex-wrap items-center gap-2 pt-1">
            <span className="text-[10px] sm:text-[11px] font-semibold text-[#6B7280] uppercase tracking-wider">
              Active:
            </span>

            {searchQuery && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs bg-white border border-[#E5E2DC] text-[#1A1A1A] shadow-2xs">
                <span>Search: &ldquo;{searchQuery}&rdquo;</span>
                <button
                  type="button"
                  onClick={() => onSearchChange("")}
                  className="hover:text-rose-600 transition-colors cursor-pointer"
                  aria-label="Remove search filter"
                >
                  <X className="size-3" />
                </button>
              </span>
            )}

            {selectedCategory !== "all" && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs bg-[#5D6B4D]/10 border border-[#5D6B4D]/30 text-[#5D6B4D] font-medium">
                <span>Category: {CATEGORY_CHIPS.find((c) => c.slug === selectedCategory)?.name || selectedCategory}</span>
                <button
                  type="button"
                  onClick={() => onCategoryChange("all")}
                  className="hover:text-rose-600 transition-colors cursor-pointer"
                  aria-label="Clear category filter"
                >
                  <X className="size-3" />
                </button>
              </span>
            )}

            {priceRange !== "all" && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs bg-white border border-[#E5E2DC] text-[#1A1A1A] shadow-2xs">
                <span>{PRICE_OPTIONS.find((p) => p.value === priceRange)?.label}</span>
                <button
                  type="button"
                  onClick={() => onPriceRangeChange("all")}
                  className="hover:text-rose-600 transition-colors cursor-pointer"
                  aria-label="Remove price filter"
                >
                  <X className="size-3" />
                </button>
              </span>
            )}

            {materialFilter !== "all" && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs bg-white border border-[#E5E2DC] text-[#1A1A1A] shadow-2xs">
                <span>{MATERIAL_OPTIONS.find((m) => m.value === materialFilter)?.label}</span>
                <button
                  type="button"
                  onClick={() => onMaterialChange("all")}
                  className="hover:text-rose-600 transition-colors cursor-pointer"
                  aria-label="Remove material filter"
                >
                  <X className="size-3" />
                </button>
              </span>
            )}

            {featuredOnly && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs bg-amber-50 border border-amber-200 text-amber-900 shadow-2xs font-medium">
                <span>Featured Pieces Only</span>
                <button
                  type="button"
                  onClick={() => onFeaturedChange(false)}
                  className="hover:text-rose-600 transition-colors cursor-pointer"
                  aria-label="Remove featured filter"
                >
                  <X className="size-3" />
                </button>
              </span>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
