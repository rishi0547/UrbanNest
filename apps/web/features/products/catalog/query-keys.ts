import type { CatalogFilterOptions } from "./types";

/**
 * Standard TanStack Query Key Factory for Products & Categories.
 * Provides hierarchical, strongly-typed query keys for fine-grained caching & invalidation.
 */
export const productQueryKeys = {
  all: ["products"] as const,
  lists: () => [...productQueryKeys.all, "list"] as const,
  list: (filters: CatalogFilterOptions = {}) =>
    [...productQueryKeys.lists(), filters] as const,
  details: () => [...productQueryKeys.all, "detail"] as const,
  detail: (slug: string) => [...productQueryKeys.details(), slug] as const,
  featured: (limit?: number) =>
    [...productQueryKeys.all, "featured", limit ?? 4] as const,
  related: (slug: string, limit?: number) =>
    [...productQueryKeys.all, "related", slug, limit ?? 4] as const,
  categories: () => ["categories"] as const,
};
