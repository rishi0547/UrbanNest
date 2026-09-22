"use client";

import { Search, Sparkles, SlidersHorizontal, RotateCcw } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import type { CatalogFilterOptions } from "../types";

export const CATEGORY_CHIPS = [
  { name: "All", slug: "all" },
  { name: "Living Room", slug: "living-room" },
  { name: "Bedroom", slug: "bedroom" },
  { name: "Dining Room", slug: "dining-room" },
  { name: "Home Office", slug: "home-office" },
  { name: "Storage", slug: "storage" },
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
    <div
      id="catalog-filter-bar"
      className="w-full bg-white/90 backdrop-blur-md rounded-2xl border border-[#E5E2DC] p-3.5 sm:p-4 shadow-2xs space-y-3"
    >
      {/* Top Row: Search + Category Chips + Right Dropdowns */}
      <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3">
        {/* Left: Search Input */}
        <div className="relative w-full lg:w-72 shrink-0">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-[#6B7280]" />
          <Input
            type="text"
            placeholder="Search handcrafted furniture..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-9 h-10 rounded-full border-[#E5E2DC] bg-[#F8F6F2] focus:bg-white text-xs font-normal placeholder:text-[#6B7280]"
          />
        </div>

        {/* Center: Category Chips */}
        <div className="flex items-center gap-1.5 overflow-x-auto py-1 scrollbar-none">
          {CATEGORY_CHIPS.map((chip) => {
            const isActive = selectedCategory === chip.slug;
            return (
              <button
                key={chip.slug}
                type="button"
                onClick={() => onCategoryChange(chip.slug)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-medium transition-all cursor-pointer whitespace-nowrap shrink-0 ${
                  isActive
                    ? "bg-[#5D6B4D] text-white shadow-2xs"
                    : "bg-[#F8F6F2] text-[#4A4A4A] hover:bg-[#E5E2DC] hover:text-[#1A1A1A]"
                }`}
              >
                {chip.name}
              </button>
            );
          })}
        </div>

        {/* Right: Dropdowns & Action Controls */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 lg:pb-0 justify-end shrink-0">
          {/* Featured Toggle */}
          <Button
            type="button"
            variant={featuredOnly ? "default" : "outline"}
            size="sm"
            onClick={() => onFeaturedChange(!featuredOnly)}
            className={`h-9 px-3 rounded-full text-xs font-semibold gap-1.5 transition-colors cursor-pointer shrink-0 ${
              featuredOnly
                ? "bg-[#D4A373] hover:bg-[#C49258] text-white border-transparent"
                : "border-[#E5E2DC] bg-white text-[#1A1A1A] hover:bg-[#F8F6F2]"
            }`}
          >
            <Sparkles className="size-3 text-amber-400" />
            Featured
          </Button>

          {/* Price Range Filter */}
          <select
            value={priceRange}
            aria-label="Filter by Price"
            onChange={(e) => onPriceRangeChange(e.target.value)}
            className="h-9 rounded-full border border-[#E5E2DC] bg-white px-3 text-xs font-medium text-[#1A1A1A] outline-none hover:border-[#5D6B4D]/50 transition-colors cursor-pointer shrink-0"
          >
            <option value="all">Price: All</option>
            <option value="under-1000">Under $1,000</option>
            <option value="1000-2000">$1,000 – $2,000</option>
            <option value="above-2000">$2,000+</option>
          </select>

          {/* Material Filter */}
          <select
            value={materialFilter}
            aria-label="Filter by Material"
            onChange={(e) => onMaterialChange(e.target.value)}
            className="h-9 rounded-full border border-[#E5E2DC] bg-white px-3 text-xs font-medium text-[#1A1A1A] outline-none hover:border-[#5D6B4D]/50 transition-colors cursor-pointer shrink-0"
          >
            <option value="all">Material: All</option>
            <option value="wood">Solid Hardwood</option>
            <option value="boucle">Tactile Bouclé</option>
            <option value="stone">Travertine & Stone</option>
          </select>

          {/* Sort By */}
          <select
            value={sortBy}
            aria-label="Sort products"
            onChange={(e) => onSortChange(e.target.value as CatalogFilterOptions["sortBy"])}
            className="h-9 rounded-full border border-[#E5E2DC] bg-white px-3 text-xs font-medium text-[#1A1A1A] outline-none hover:border-[#5D6B4D]/50 transition-colors cursor-pointer shrink-0"
          >
            <option value="newest">Sort: Newest Arrivals</option>
            <option value="price_asc">Sort: Price (Low to High)</option>
            <option value="price_desc">Sort: Price (High to Low)</option>
          </select>

          {/* Reset Filters Button (when active) */}
          {isFiltered && (
            <button
              type="button"
              onClick={onResetFilters}
              className="h-9 px-2.5 rounded-full text-xs text-[#6B7280] hover:text-rose-600 hover:bg-rose-50 transition-colors flex items-center gap-1 cursor-pointer shrink-0"
              title="Reset all filters"
            >
              <RotateCcw className="size-3" />
              Reset
            </button>
          )}
        </div>
      </div>

      {/* Meta Bar: Item Count & Active Status */}
      <div className="flex items-center justify-between text-xs text-[#6B7280] px-1 pt-1 border-t border-[#E5E2DC]/60">
        <div>
          Showing <strong className="text-[#1A1A1A] font-semibold">{totalCount}</strong>{" "}
          {totalCount === 1 ? "handcrafted piece" : "handcrafted pieces"}
          {selectedCategory !== "all" && (
            <span>
              {" "}in{" "}
              <strong className="text-[#5D6B4D] capitalize">
                {selectedCategory.replace("-", " ")}
              </strong>
            </span>
          )}
        </div>
        <div className="hidden sm:block text-[11px] font-light">
          Complimentary white-glove setup on orders over $1,500
        </div>
      </div>
    </div>
  );
}
