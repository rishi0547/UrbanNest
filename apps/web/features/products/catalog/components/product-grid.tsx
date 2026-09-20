"use client";

import { useState } from "react";
import { Search, SlidersHorizontal, PackageX, Sparkles } from "lucide-react";
import { useProducts, useCategories } from "../queries";
import { ProductCard } from "./product-card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import type { CatalogFilterOptions } from "../types";

export function ProductGrid() {
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [sortBy, setSortBy] = useState<CatalogFilterOptions["sortBy"]>("newest");
  const [featuredOnly, setFeaturedOnly] = useState<boolean>(false);

  const { data: categories, isLoading: categoriesLoading } = useCategories();

  const {
    data: products,
    isLoading: productsLoading,
    isError,
    refetch,
  } = useProducts({
    categorySlug: selectedCategory === "all" ? undefined : selectedCategory,
    searchQuery: searchQuery.trim() || undefined,
    sortBy,
    featuredOnly: featuredOnly ? true : undefined,
  });

  const allItems = products || [];

  return (
    <div className="space-y-8">
      {/* Controls Bar: Category Pills, Search, and Sort */}
      <div className="flex flex-col gap-5 rounded-2xl border border-border/60 bg-card/40 p-4 sm:p-5 backdrop-blur-xs shadow-xs">
        {/* Row 1: Search & Sorting */}
        <div className="flex flex-col sm:flex-row items-center gap-3 justify-between">
          <div className="relative w-full sm:max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search handcrafted furniture, wood, finishes..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 bg-background"
            />
          </div>

          <div className="flex items-center gap-2.5 w-full sm:w-auto justify-end">
            <Button
              type="button"
              variant={featuredOnly ? "default" : "outline"}
              size="sm"
              onClick={() => setFeaturedOnly(!featuredOnly)}
              className="text-xs h-9 gap-1.5 shrink-0"
            >
              <Sparkles className="size-3.5 text-amber-400" />
              Featured
            </Button>

            <div className="flex items-center gap-2">
              <label htmlFor="sort-select" className="text-xs text-muted-foreground hidden md:inline">
                Sort:
              </label>
              <select
                id="sort-select"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as CatalogFilterOptions["sortBy"])}
                className="h-9 rounded-lg border border-border bg-background px-3 text-xs font-medium text-foreground outline-none focus:border-primary focus:ring-2 focus:ring-ring/40 cursor-pointer"
              >
                <option value="newest">Newest Arrivals</option>
                <option value="price_asc">Price: Low to High</option>
                <option value="price_desc">Price: High to Low</option>
              </select>
            </div>
          </div>
        </div>

        {/* Row 2: Category Taxonomy Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          <button
            type="button"
            onClick={() => setSelectedCategory("all")}
            className={`rounded-full px-3.5 py-1.5 text-xs font-medium transition-all whitespace-nowrap ${
              selectedCategory === "all"
                ? "bg-primary text-primary-foreground shadow-xs"
                : "bg-muted/70 text-muted-foreground hover:bg-muted hover:text-foreground"
            }`}
          >
            All Collections
          </button>

          {!categoriesLoading &&
            categories?.map((category) => (
              <button
                key={category.id}
                type="button"
                onClick={() => setSelectedCategory(category.slug)}
                className={`rounded-full px-3.5 py-1.5 text-xs font-medium transition-all whitespace-nowrap ${
                  selectedCategory === category.slug
                    ? "bg-primary text-primary-foreground shadow-xs"
                    : "bg-muted/70 text-muted-foreground hover:bg-muted hover:text-foreground"
                }`}
              >
                {category.name}
              </button>
            ))}
        </div>
      </div>

      {/* Results Header */}
      <div className="flex items-center justify-between text-xs text-muted-foreground px-1">
        <div>
          Showing <span className="font-semibold text-foreground">{allItems.length}</span>{" "}
          {allItems.length === 1 ? "design piece" : "design pieces"}
          {selectedCategory !== "all" && (
            <span> in <span className="capitalize font-medium text-foreground">{selectedCategory.replace("-", " ")}</span></span>
          )}
        </div>
      </div>

      {/* Query Error State */}
      {isError && (
        <div className="rounded-xl border border-destructive/40 bg-destructive/10 p-6 text-center space-y-3">
          <p className="text-sm font-medium text-destructive">
            Unable to load catalog products at this time.
          </p>
          <Button variant="outline" size="sm" onClick={() => refetch()}>
            Try Again
          </Button>
        </div>
      )}

      {/* Loading Skeletons */}
      {productsLoading ? (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {Array.from({ length: 8 }).map((_, idx) => (
            <div
              key={idx}
              className="flex flex-col rounded-xl border border-border/60 bg-card p-4 space-y-3 animate-pulse"
            >
              <div className="aspect-4/3 w-full rounded-lg bg-muted/60" />
              <div className="h-4 w-3/4 rounded bg-muted/80" />
              <div className="h-3 w-1/2 rounded bg-muted/50" />
              <div className="pt-4 flex justify-between">
                <div className="h-5 w-16 rounded bg-muted/70" />
                <div className="h-4 w-12 rounded bg-muted/50" />
              </div>
            </div>
          ))}
        </div>
      ) : allItems.length === 0 ? (
        /* Empty State */
        <div className="rounded-2xl border border-dashed border-border py-16 text-center space-y-4 max-w-md mx-auto">
          <div className="mx-auto size-12 rounded-full bg-muted flex items-center justify-center text-muted-foreground">
            <PackageX className="size-6" />
          </div>
          <div className="space-y-1">
            <h3 className="text-base font-semibold text-foreground">No pieces match your filters</h3>
            <p className="text-xs text-muted-foreground">
              Try adjusting your search query, removing category filters, or toggling off featured items.
            </p>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              setSelectedCategory("all");
              setSearchQuery("");
              setFeaturedOnly(false);
            }}
          >
            Reset All Filters
          </Button>
        </div>
      ) : (
        /* Product Grid */
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {allItems.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}
