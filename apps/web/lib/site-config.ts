/**
 * Centralized site configuration for SEO, OpenGraph, Twitter Cards, Canonical URLs, and Sitemaps.
 * Reads production URL from environment variable or defaults to production domain.
 */
export const siteConfig = {
  name: "UrbanNest",
  legalName: "UrbanNest Luxury Living",
  title: "UrbanNest | Handcrafted Modern Furniture & Architectural Living",
  description:
    "Timeless furniture crafted for contemporary living. Handcrafted solid hardwoods, organic textiles, and architectural silhouettes for inspired home spaces.",
  url: process.env.NEXT_PUBLIC_SITE_URL || "https://urbannest-living.vercel.app",
  ogImage: "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=1200&q=85&fit=crop",
  creator: "UrbanNest Architectural Design",
  publisher: "UrbanNest Luxury Living",
  keywords: [
    "luxury furniture",
    "modern furniture",
    "architectural living",
    "solid wood furniture",
    "minimalist home decor",
    "curated interiors",
    "scandinavian furniture",
    "japanese minimalist furniture",
    "handcrafted dining tables",
    "designer sofas",
  ],
};

/**
 * Returns an absolute URL based on the configured site domain.
 */
export function absoluteUrl(path: string = "/"): string {
  const base = siteConfig.url.replace(/\/+$/, "");
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  return `${base}${normalizedPath}`;
}
