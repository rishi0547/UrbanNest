"use client";

import { useQuery } from "@tanstack/react-query";
import { productQueryKeys } from "./query-keys";
import {
  getProducts,
  getProductBySlug,
  getFeaturedProducts,
  getRelatedProducts,
  getCategories,
} from "./api";
import type { CatalogFilterOptions } from "./types";

/**
 * Hook to retrieve products with active filters, backed by TanStack Query caching.
 */
export function useProducts(filters: CatalogFilterOptions = {}) {
  return useQuery({
    queryKey: productQueryKeys.list(filters),
    queryFn: () => getProducts(filters),
  });
}

/**
 * Hook to retrieve a single product by slug with automatic caching.
 */
export function useProductBySlug(slug: string) {
  return useQuery({
    queryKey: productQueryKeys.detail(slug),
    queryFn: () => getProductBySlug(slug),
    enabled: Boolean(slug),
  });
}

/**
 * Hook to retrieve featured products.
 */
export function useFeaturedProducts(limit: number = 4) {
  return useQuery({
    queryKey: productQueryKeys.featured(limit),
    queryFn: () => getFeaturedProducts(limit),
  });
}

/**
 * Hook to retrieve related products for recommendations.
 */
export function useRelatedProducts(
  currentSlug: string,
  categoryId?: string | null,
  limit: number = 4
) {
  return useQuery({
    queryKey: productQueryKeys.related(currentSlug, limit),
    queryFn: () => getRelatedProducts(currentSlug, categoryId, limit),
    enabled: Boolean(currentSlug),
  });
}

/**
 * Hook to retrieve product categories.
 */
export function useCategories() {
  return useQuery({
    queryKey: productQueryKeys.categories(),
    queryFn: () => getCategories(),
    staleTime: 5 * 60 * 1000, // Categories change infrequently, cache for 5 minutes
  });
}
