import { z } from "zod";

/**
 * PostgreSQL UUID regex (matches 32-hex-digit 8-4-4-4-12 format including seeded 11111111-...)
 */
export const UUID_REGEX =
  /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/;

/**
 * Canonical UrbanNest category definitions matching the Supabase categories table
 */
export const CANONICAL_CATEGORIES = [
  {
    id: "11111111-1111-1111-1111-111111111111",
    name: "Living Room",
    slug: "living-room",
  },
  {
    id: "22222222-2222-2222-2222-222222222222",
    name: "Bedroom",
    slug: "bedroom",
  },
  {
    id: "33333333-3333-3333-3333-333333333333",
    name: "Dining Room",
    slug: "dining-room",
  },
  {
    id: "44444444-4444-4444-4444-444444444444",
    name: "Home Office",
    slug: "home-office",
  },
  {
    id: "55555555-5555-5555-5555-555555555555",
    name: "Storage",
    slug: "storage",
  },
] as const;

export type CanonicalCategorySlug = (typeof CANONICAL_CATEGORIES)[number]["slug"];
export type CanonicalCategoryId = (typeof CANONICAL_CATEGORIES)[number]["id"];

/**
 * Bidirectional/fallback lookup from slug or name to canonical category UUID
 */
export const CATEGORY_LOOKUP_TO_ID: Record<string, string> = {
  "living-room": "11111111-1111-1111-1111-111111111111",
  "bedroom": "22222222-2222-2222-2222-222222222222",
  "dining-room": "33333333-3333-3333-3333-333333333333",
  "home-office": "44444444-4444-4444-4444-444444444444",
  "storage": "55555555-5555-5555-5555-555555555555",
  "Living Room": "11111111-1111-1111-1111-111111111111",
  "Bedroom": "22222222-2222-2222-2222-222222222222",
  "Dining Room": "33333333-3333-3333-3333-333333333333",
  "Home Office": "44444444-4444-4444-4444-444444444444",
  "Storage": "55555555-5555-5555-5555-555555555555",
};

export const productSchema = z.object({
  name: z.string().trim().min(2, "Product name must be at least 2 characters"),
  slug: z
    .string()
    .trim()
    .min(2, "Slug must be at least 2 characters")
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, {
      message: "Slug must be lowercase alphanumeric with hyphens (e.g. walnut-chair)",
    }),
  description: z
    .string()
    .trim()
    .min(10, "Description must be at least 10 characters"),
  price: z
    .number({ message: "Price must be a valid number" })
    .min(1, "Price must be greater than ₹0"),
  stock: z
    .number({ message: "Stock must be a valid integer" })
    .int("Stock must be an integer")
    .min(0, "Stock cannot be negative"),
  category_id: z
    .string({ message: "Please select a valid category" })
    .trim()
    .min(1, "Please select a valid category")
    .refine(
      (val) => UUID_REGEX.test(val) || Boolean(CATEGORY_LOOKUP_TO_ID[val]),
      {
        message: "Please select a valid category",
      }
    ),
  featured: z.boolean(),
  active: z.boolean(),
  images: z
    .array(z.string().url("Must be a valid image URL"))
    .min(1, "At least one product image URL is required"),
});

export type ProductInput = z.infer<typeof productSchema>;

/**
 * Utility to generate an SEO-friendly slug from a product name.
 */
export function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
}
