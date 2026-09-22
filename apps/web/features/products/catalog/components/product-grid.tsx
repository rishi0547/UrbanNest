"use client";

import { useState, useMemo } from "react";
import { PackageX } from "lucide-react";
import { useProducts, useCategories } from "../queries";
import { ProductCard } from "./product-card";
import { CompactFilterBar } from "./compact-filter-bar";
import { Button } from "@/components/ui/button";
import { CURATED_CATALOG } from "../catalog-data";
import type { CatalogFilterOptions, CatalogProduct } from "../types";

interface ProductGridProps {
  initialCategory?: string;
  onCategoryChange?: (slug: string) => void;
}

export function ProductGrid({
  initialCategory = "all",
  onCategoryChange: externalOnCategoryChange,
}: ProductGridProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>(initialCategory);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [sortBy, setSortBy] = useState<CatalogFilterOptions["sortBy"]>("newest");
  const [featuredOnly, setFeaturedOnly] = useState<boolean>(false);
  const [priceRange, setPriceRange] = useState<string>("all");
  const [materialFilter, setMaterialFilter] = useState<string>("all");

  const { data: dbProducts, isLoading: productsLoading, isError } = useProducts({
    categorySlug: selectedCategory === "all" ? undefined : selectedCategory,
    searchQuery: searchQuery.trim() || undefined,
    sortBy,
    featuredOnly: featuredOnly ? true : undefined,
  });

  const handleCategorySelect = (slug: string) => {
    setSelectedCategory(slug);
    if (externalOnCategoryChange) {
      externalOnCategoryChange(slug);
    }
  };

  const handleResetFilters = () => {
    setSelectedCategory("all");
    setSearchQuery("");
    setSortBy("newest");
    setFeaturedOnly(false);
    setPriceRange("all");
    setMaterialFilter("all");
    if (externalOnCategoryChange) {
      externalOnCategoryChange("all");
    }
  };

  // Combine database products with curated studio catalog for comprehensive luxury selection
  const filteredProducts = useMemo(() => {
    // Start with curated catalog as baseline and merge DB products
    const dbItems = dbProducts || [];
    const dbSlugs = new Set(dbItems.map((p) => p.slug));

    // Combine unique items
    const merged: CatalogProduct[] = [
      ...dbItems,
      ...CURATED_CATALOG.filter((c) => !dbSlugs.has(c.slug)),
    ];

    let result = merged.filter((item) => {
      // 1. Category Filter
      if (selectedCategory !== "all") {
        const catSlug = item.category?.slug || "";
        if (catSlug !== selectedCategory) return false;
      }

      // 2. Search Query
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchesTitle = item.title.toLowerCase().includes(query);
        const matchesDesc = item.description.toLowerCase().includes(query);
        const matchesCat = item.category?.name.toLowerCase().includes(query);
        if (!matchesTitle && !matchesDesc && !matchesCat) return false;
      }

      // 3. Featured Only
      if (featuredOnly && !item.is_featured) {
        return false;
      }

      // 4. Price Range
      const price = Number(item.price);
      if (priceRange === "under-1000" && price >= 1000) return false;
      if (priceRange === "1000-2000" && (price < 1000 || price > 2000)) return false;
      if (priceRange === "above-2000" && price <= 2000) return false;

      // 5. Material Filter
      if (materialFilter !== "all") {
        const desc = (item.description + " " + item.title).toLowerCase();
        if (materialFilter === "wood" && !desc.includes("oak") && !desc.includes("walnut") && !desc.includes("hardwood") && !desc.includes("timber")) {
          return false;
        }
        if (materialFilter === "boucle" && !desc.includes("bouclé") && !desc.includes("boucle") && !desc.includes("velvet")) {
          return false;
        }
        if (materialFilter === "stone" && !desc.includes("travertine") && !desc.includes("stone")) {
          return false;
        }
      }

      return true;
    });

    // 6. Sorting
    if (sortBy === "price_asc") {
      result.sort((a, b) => Number(a.price) - Number(b.price));
    } else if (sortBy === "price_desc") {
      result.sort((a, b) => Number(b.price) - Number(a.price));
    } else {
      // newest default
      result.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
    }

    return result;
  }, [dbProducts, selectedCategory, searchQuery, sortBy, featuredOnly, priceRange, materialFilter]);

  // Section Heading text
  const headingText = useMemo(() => {
    if (selectedCategory !== "all") {
      return `${selectedCategory.replace("-", " ")} Collection`;
    }
    if (featuredOnly) {
      return "Featured Studio Signatures";
    }
    return "Featured Pieces";
  }, [selectedCategory, featuredOnly]);

  return (
    <div className="w-full space-y-8 sm:space-y-10">
      {/* Section 4: Compact Filter Bar */}
      <CompactFilterBar
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        selectedCategory={selectedCategory}
        onCategoryChange={handleCategorySelect}
        sortBy={sortBy}
        onSortChange={setSortBy}
        featuredOnly={featuredOnly}
        onFeaturedChange={setFeaturedOnly}
        priceRange={priceRange}
        onPriceRangeChange={setPriceRange}
        materialFilter={materialFilter}
        onMaterialChange={setMaterialFilter}
        onResetFilters={handleResetFilters}
        totalCount={filteredProducts.length}
      />

      {/* Section 5: Featured Pieces Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 border-b border-[#E5E2DC] pb-4">
        <div>
          <span className="text-[11px] font-semibold uppercase tracking-[0.25em] text-[#5D6B4D]">
            Studio Curations
          </span>
          <h2 className="font-heading text-2xl sm:text-3xl lg:text-4xl font-normal capitalize text-[#1A1A1A] mt-1">
            {headingText}
          </h2>
          <p className="text-xs sm:text-sm text-[#6B7280] font-light mt-1">
            Curated furniture selected by our design team for architectural harmony.
          </p>
        </div>

        <div className="text-xs text-[#6B7280]">
          Showing <strong className="text-[#1A1A1A]">{filteredProducts.length}</strong> available designs
        </div>
      </div>

      {/* Loading Skeletons */}
      {productsLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6">
          {Array.from({ length: 8 }).map((_, idx) => (
            <div
              key={idx}
              className="flex flex-col rounded-2xl border border-[#E5E2DC] bg-white p-4 space-y-3 animate-pulse"
            >
              <div className="aspect-[4/5] w-full rounded-xl bg-[#F0EDE8]" />
              <div className="h-4 w-3/4 rounded bg-[#E5E2DC]" />
              <div className="h-3 w-1/2 rounded bg-[#E5E2DC]/60" />
              <div className="pt-4 flex justify-between">
                <div className="h-5 w-20 rounded bg-[#E5E2DC]" />
                <div className="h-7 w-20 rounded-full bg-[#E5E2DC]" />
              </div>
            </div>
          ))}
        </div>
      ) : filteredProducts.length === 0 ? (
        /* Empty State */
        <div className="rounded-3xl border border-dashed border-[#E5E2DC] bg-white py-16 px-6 text-center space-y-4 max-w-md mx-auto shadow-2xs">
          <div className="mx-auto size-14 rounded-full bg-[#F8F6F2] border border-[#E5E2DC] flex items-center justify-center text-[#6B7280]">
            <PackageX className="size-6" />
          </div>
          <div className="space-y-1">
            <h3 className="text-base font-semibold text-[#1A1A1A]">No pieces match your filters</h3>
            <p className="text-xs text-[#6B7280] leading-relaxed font-light">
              Try adjusting your search criteria, selecting a different living space, or resetting all filters.
            </p>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={handleResetFilters}
            className="rounded-full border-[#5D6B4D] text-[#5D6B4D] hover:bg-[#5D6B4D] hover:text-white"
          >
            Reset All Filters
          </Button>
        </div>
      ) : (
        /* 4-Column Product Grid (Section 11: 4 desktop, 2-3 tablet, 1-2 mobile) */
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6 items-stretch">
          {filteredProducts.map((product, idx) => (
            <ProductCard
              key={product.id || idx}
              product={product}
              rating={idx % 2 === 0 ? 4.9 : 4.8}
            />
          ))}
        </div>
      )}
    </div>
  );
}
