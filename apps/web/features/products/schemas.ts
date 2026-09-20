import { z } from "zod";

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
    .min(0.01, "Price must be greater than $0.00"),
  stock: z
    .number({ message: "Stock must be a valid integer" })
    .int("Stock must be an integer")
    .min(0, "Stock cannot be negative"),
  category_id: z.string().uuid("Please select a valid category"),
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
