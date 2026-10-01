"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import {
  Search,
  Plus,
  Edit,
  SlidersHorizontal,
  X,
  Package,
  Layers,
  ArrowUpDown,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { DeleteProductButton } from "@/features/products/components/delete-product-button";
import { formatINR } from "@/utils/currency";
import { SafeProductImage } from "@/components/ProductImageFallback";

export interface ProductRecord {
  id: string;
  title: string;
  slug: string;
  description: string | null;
  price: number;
  stock: number;
  images: string[] | null;
  image_url?: string | null;
  is_featured: boolean;
  is_published: boolean;
  created_at: string;
  category_id: string | null;
  category: {
    id: string;
    name: string;
    slug: string;
  } | null;
}

export interface CategoryRecord {
  id: string;
  name: string;
  slug: string;
}

interface AdminProductsCatalogProps {
  initialProducts: ProductRecord[];
  categories: CategoryRecord[];
}

export function AdminProductsCatalog({
  initialProducts,
  categories,
}: AdminProductsCatalogProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [selectedStock, setSelectedStock] = useState("all");
  const [featuredOnly, setFeaturedOnly] = useState(false);
  const [sortBy, setSortBy] = useState<"newest" | "price-asc" | "price-desc" | "stock-asc">("newest");

  // Filter and sort products based on real available fields
  const filteredProducts = useMemo(() => {
    return initialProducts
      .filter((product) => {
        // Search query
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase().trim();
          const matchTitle = product.title.toLowerCase().includes(q);
          const matchSlug = product.slug.toLowerCase().includes(q);
          const matchCategory = product.category?.name.toLowerCase().includes(q);
          if (!matchTitle && !matchSlug && !matchCategory) return false;
        }

        // Category filter
        if (selectedCategory !== "all") {
          if (product.category_id !== selectedCategory && product.category?.slug !== selectedCategory) {
            return false;
          }
        }

        // Status filter
        if (selectedStatus === "active" && !product.is_published) return false;
        if (selectedStatus === "draft" && product.is_published) return false;

        // Stock filter
        if (selectedStock === "in-stock" && product.stock <= 5) return false;
        if (selectedStock === "low-stock" && (product.stock > 5 || product.stock === 0)) return false;
        if (selectedStock === "out-of-stock" && product.stock > 0) return false;

        // Featured filter
        if (featuredOnly && !product.is_featured) return false;

        return true;
      })
      .sort((a, b) => {
        switch (sortBy) {
          case "price-asc":
            return Number(a.price) - Number(b.price);
          case "price-desc":
            return Number(b.price) - Number(a.price);
          case "stock-asc":
            return a.stock - b.stock;
          case "newest":
          default:
            return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
        }
      });
  }, [initialProducts, searchQuery, selectedCategory, selectedStatus, selectedStock, featuredOnly, sortBy]);

  const hasActiveFilters =
    searchQuery.trim() !== "" ||
    selectedCategory !== "all" ||
    selectedStatus !== "all" ||
    selectedStock !== "all" ||
    featuredOnly ||
    sortBy !== "newest";

  const handleResetFilters = () => {
    setSearchQuery("");
    setSelectedCategory("all");
    setSelectedStatus("all");
    setSelectedStock("all");
    setFeaturedOnly(false);
    setSortBy("newest");
  };

  return (
    <div className="space-y-6">
      {/* Controls Bar: Search & Multi-Filters */}
      <div className="rounded-xl border border-[#E5E2DC] bg-white p-4 sm:p-5 shadow-2xs space-y-4">
        {/* Row 1: Search and Sort */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-[#A3A3A3]" />
            <input
              type="text"
              placeholder="Search products by title or slug..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full h-10 pl-10 pr-4 rounded-lg border border-[#E5E2DC] bg-[#F8F6F2]/50 text-xs sm:text-sm text-[#1A1A1A] placeholder:text-[#A3A3A3] focus:outline-none focus:border-[#5D6B4D] focus:bg-white transition-colors"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#A3A3A3] hover:text-[#1A1A1A]"
              >
                <X className="size-4" />
              </button>
            )}
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs text-[#6B7280] hidden sm:inline whitespace-nowrap">Sort:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="h-10 rounded-lg border border-[#E5E2DC] bg-white px-3 text-xs font-medium text-[#1A1A1A] focus:outline-none focus:border-[#5D6B4D] cursor-pointer shadow-2xs"
            >
              <option value="newest">Newest First</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="stock-asc">Stock: Low to High</option>
            </select>
          </div>
        </div>

        {/* Row 2: Category, Status, Stock, Featured Filters */}
        <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-[#E5E2DC]/60">
          {/* Category Dropdown */}
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="h-8.5 rounded-lg border border-[#E5E2DC] bg-white px-2.5 text-xs font-medium text-[#1A1A1A] focus:outline-none focus:border-[#5D6B4D] cursor-pointer shadow-2xs"
          >
            <option value="all">All Categories</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>

          {/* Status Dropdown */}
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="h-8.5 rounded-lg border border-[#E5E2DC] bg-white px-2.5 text-xs font-medium text-[#1A1A1A] focus:outline-none focus:border-[#5D6B4D] cursor-pointer shadow-2xs"
          >
            <option value="all">All Status</option>
            <option value="active">Active (Published)</option>
            <option value="draft">Draft (Hidden)</option>
          </select>

          {/* Stock Dropdown */}
          <select
            value={selectedStock}
            onChange={(e) => setSelectedStock(e.target.value)}
            className="h-8.5 rounded-lg border border-[#E5E2DC] bg-white px-2.5 text-xs font-medium text-[#1A1A1A] focus:outline-none focus:border-[#5D6B4D] cursor-pointer shadow-2xs"
          >
            <option value="all">All Stock Levels</option>
            <option value="in-stock">In Stock (&gt; 5)</option>
            <option value="low-stock">Low Stock (1-5)</option>
            <option value="out-of-stock">Out of Stock (0)</option>
          </select>

          {/* Featured Toggle Button */}
          <button
            type="button"
            onClick={() => setFeaturedOnly(!featuredOnly)}
            className={`inline-flex items-center gap-1.5 h-8.5 px-3 rounded-lg text-xs font-medium border transition-colors ${
              featuredOnly
                ? "bg-[#5D6B4D] text-white border-[#5D6B4D]"
                : "bg-white text-[#6B7280] border-[#E5E2DC] hover:text-[#1A1A1A] hover:bg-[#F0EDE8]/50"
            }`}
          >
            <Sparkles className="size-3" />
            <span>Featured Only</span>
          </button>

          {/* Reset Filters Shortcut */}
          {hasActiveFilters && (
            <button
              type="button"
              onClick={handleResetFilters}
              className="inline-flex items-center gap-1 text-xs font-semibold text-[#5D6B4D] hover:text-[#4E5A40] ml-auto py-1 px-2"
            >
              <X className="size-3" />
              <span>Reset Filters</span>
            </button>
          )}
        </div>

        {/* Filter Results Counter */}
        <div className="flex items-center justify-between text-xs text-[#6B7280] pt-1">
          <span>
            Showing <strong className="text-[#1A1A1A] font-semibold">{filteredProducts.length}</strong> of {initialProducts.length} products
          </span>
          {hasActiveFilters && (
            <span className="text-[11px] text-[#5D6B4D] font-medium">
              Filtered view active
            </span>
          )}
        </div>
      </div>

      {/* Product List / Table */}
      {filteredProducts.length === 0 ? (
        <div className="rounded-xl border border-dashed border-[#E5E2DC] bg-white py-16 px-4 text-center max-w-md mx-auto space-y-3">
          <div className="mx-auto size-12 rounded-full bg-[#F0EDE8] flex items-center justify-center text-[#6B7280]">
            <Package className="size-6" />
          </div>
          <h3 className="font-heading text-lg font-bold text-[#1A1A1A]">
            No products match criteria
          </h3>
          <p className="text-xs text-[#6B7280]">
            Try adjusting your search terms, changing the category or clearing active filters.
          </p>
          {hasActiveFilters ? (
            <Button
              variant="outline"
              size="sm"
              onClick={handleResetFilters}
              className="rounded-lg text-xs"
            >
              Reset All Filters
            </Button>
          ) : (
            <Link href="/admin/products/new">
              <Button size="sm" className="rounded-lg text-xs">
                <Plus className="size-3.5 mr-1" />
                Add Your First Product
              </Button>
            </Link>
          )}
        </div>
      ) : (
        <div className="rounded-xl border border-[#E5E2DC] bg-white shadow-2xs overflow-hidden">
          {/* Desktop Table View */}
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#F8F6F2]/80 text-[11px] font-semibold text-[#6B7280] uppercase tracking-wider border-b border-[#E5E2DC]">
                <tr>
                  <th className="py-3.5 px-4">Product</th>
                  <th className="py-3.5 px-4">Category</th>
                  <th className="py-3.5 px-4">Price</th>
                  <th className="py-3.5 px-4">Stock</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E5E2DC]/60 font-medium">
                {filteredProducts.map((product) => {
                  const thumbnail = product.image_url || product.images?.[0];
                  const categoryName = product.category?.name || "Unassigned";

                  return (
                    <tr
                      key={product.id}
                      className="hover:bg-[#F8F6F2]/60 transition-colors group"
                    >
                      {/* Product Thumbnail & Details */}
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3.5">
                          <div className="relative size-12 rounded-lg overflow-hidden bg-[#F0EDE8] border border-[#E5E2DC] shrink-0 flex items-center justify-center">
                            <SafeProductImage
                              src={thumbnail}
                              alt={product.title}
                              fill
                              sizes="48px"
                              className="object-cover"
                            />
                          </div>
                          <div className="min-w-0 max-w-xs lg:max-w-md">
                            <Link
                              href={`/admin/products/${product.id}`}
                              className="font-semibold text-sm text-[#1A1A1A] hover:text-[#5D6B4D] transition-colors truncate block"
                            >
                              {product.title}
                            </Link>
                            <span className="font-mono text-[11px] text-[#6B7280] truncate block">
                              /{product.slug}
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* Category */}
                      <td className="py-3 px-4">
                        <span className="inline-flex items-center rounded-md bg-[#F0EDE8] px-2.5 py-1 text-[11px] font-medium text-[#1A1A1A]">
                          {categoryName}
                        </span>
                      </td>

                      {/* Price */}
                      <td className="py-3 px-4 font-mono font-bold text-sm text-[#1A1A1A]">
                        {formatINR(Number(product.price))}
                      </td>

                      {/* Stock */}
                      <td className="py-3 px-4">
                        {product.stock === 0 ? (
                          <span className="inline-flex items-center rounded-md bg-rose-50 px-2 py-0.5 text-[11px] font-semibold text-rose-700 border border-rose-200">
                            Out of Stock
                          </span>
                        ) : product.stock <= 5 ? (
                          <span className="inline-flex items-center rounded-md bg-amber-50 px-2 py-0.5 text-[11px] font-semibold text-amber-700 border border-amber-200">
                            {product.stock} units left
                          </span>
                        ) : (
                          <span className="text-xs font-medium text-[#1A1A1A]">
                            {product.stock} units
                          </span>
                        )}
                      </td>

                      {/* Status Badges */}
                      <td className="py-3 px-4">
                        <div className="flex flex-wrap items-center gap-1.5">
                          {product.is_published ? (
                            <span className="inline-flex items-center rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-emerald-700 border border-emerald-200">
                              Active
                            </span>
                          ) : (
                            <span className="inline-flex items-center rounded-full bg-gray-100 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-gray-600 border border-gray-200">
                              Draft
                            </span>
                          )}
                          {product.is_featured && (
                            <span className="inline-flex items-center rounded-full bg-[#5D6B4D]/10 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-[#5D6B4D] border border-[#5D6B4D]/20">
                              Featured
                            </span>
                          )}
                        </div>
                      </td>

                      {/* Actions */}
                      <td className="py-3 px-4 text-right">
                        <div className="inline-flex items-center justify-end gap-1">
                          <Link href={`/admin/products/${product.id}`}>
                            <Button
                              size="sm"
                              variant="ghost"
                              className="h-8 px-2.5 text-[#6B7280] hover:text-[#1A1A1A] hover:bg-[#F0EDE8]"
                              title="Edit product"
                            >
                              <Edit className="size-4" />
                              <span className="sr-only">Edit</span>
                            </Button>
                          </Link>
                          <DeleteProductButton
                            productId={product.id}
                            productName={product.title}
                          />
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Mobile Stacked Cards View */}
          <div className="md:hidden divide-y divide-[#E5E2DC]/60 p-4 space-y-4">
            {filteredProducts.map((product) => {
              const thumbnail = product.image_url || product.images?.[0];
              const categoryName = product.category?.name || "Unassigned";

              return (
                <div key={product.id} className="pt-4 first:pt-0 space-y-3">
                  <div className="flex items-start gap-3">
                    <div className="relative size-14 rounded-lg overflow-hidden bg-[#F0EDE8] border border-[#E5E2DC] shrink-0">
                      <SafeProductImage
                        src={thumbnail}
                        alt={product.title}
                        fill
                        sizes="56px"
                        className="object-cover"
                      />
                    </div>
                    <div className="min-w-0 flex-1 space-y-1">
                      <Link
                        href={`/admin/products/${product.id}`}
                        className="font-semibold text-sm text-[#1A1A1A] hover:text-[#5D6B4D] line-clamp-1"
                      >
                        {product.title}
                      </Link>
                      <div className="flex items-center gap-2">
                        <span className="text-[11px] text-[#6B7280] bg-[#F0EDE8] px-2 py-0.5 rounded-md font-medium">
                          {categoryName}
                        </span>
                        {product.is_published ? (
                          <span className="text-[10px] font-bold text-emerald-700">Active</span>
                        ) : (
                          <span className="text-[10px] font-bold text-gray-500">Draft</span>
                        )}
                        {product.is_featured && (
                          <span className="text-[10px] font-bold text-[#5D6B4D]">★ Featured</span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-xs pt-1">
                    <div className="space-y-0.5">
                      <span className="text-[10px] text-[#6B7280] uppercase">Price &amp; Stock</span>
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-[#1A1A1A] text-sm">
                          {formatINR(Number(product.price))}
                        </span>
                        <span className="text-[#6B7280]">·</span>
                        <span className="text-xs text-[#6B7280]">{product.stock} units</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-1">
                      <Link href={`/admin/products/${product.id}`}>
                        <Button
                          size="sm"
                          variant="outline"
                          className="h-8 px-2.5 text-xs border-[#E5E2DC] bg-white text-[#1A1A1A]"
                        >
                          <Edit className="size-3.5 mr-1 text-[#6B7280]" />
                          Edit
                        </Button>
                      </Link>
                      <DeleteProductButton
                        productId={product.id}
                        productName={product.title}
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
