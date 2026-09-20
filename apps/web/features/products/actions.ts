"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { requireAdmin } from "@/features/auth/roles";
import { productSchema, type ProductInput } from "./schemas";

export type ProductActionResult = {
  success: boolean;
  id?: string;
  error?: string;
};

/**
 * Creates a new catalog product. (Admin Only)
 */
export async function createProductAction(
  values: ProductInput
): Promise<ProductActionResult> {
  await requireAdmin();

  const parsed = productSchema.safeParse(values);
  if (!parsed.success) {
    return {
      success: false,
      error: parsed.error.issues[0]?.message ?? "Invalid product data",
    };
  }

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("products")
    .insert({
      title: parsed.data.name,
      slug: parsed.data.slug,
      description: parsed.data.description,
      price: parsed.data.price,
      stock: parsed.data.stock,
      category_id: parsed.data.category_id,
      is_featured: parsed.data.featured,
      is_published: parsed.data.active,
      images: parsed.data.images,
    })
    .select("id")
    .single();

  if (error) {
    if (error.code === "23505") {
      return { success: false, error: "A product with this slug already exists" };
    }
    return { success: false, error: error.message };
  }

  revalidatePath("/admin/products");
  revalidatePath("/");
  return { success: true, id: data.id };
}

/**
 * Updates an existing product. (Admin Only)
 */
export async function updateProductAction(
  id: string,
  values: ProductInput
): Promise<ProductActionResult> {
  await requireAdmin();

  const parsed = productSchema.safeParse(values);
  if (!parsed.success) {
    return {
      success: false,
      error: parsed.error.issues[0]?.message ?? "Invalid product data",
    };
  }

  const supabase = await createClient();
  const { error } = await supabase
    .from("products")
    .update({
      title: parsed.data.name,
      slug: parsed.data.slug,
      description: parsed.data.description,
      price: parsed.data.price,
      stock: parsed.data.stock,
      category_id: parsed.data.category_id,
      is_featured: parsed.data.featured,
      is_published: parsed.data.active,
      images: parsed.data.images,
      updated_at: new Date().toISOString(),
    })
    .eq("id", id);

  if (error) {
    if (error.code === "23505") {
      return { success: false, error: "A product with this slug already exists" };
    }
    return { success: false, error: error.message };
  }

  revalidatePath("/admin/products");
  revalidatePath(`/admin/products/${id}`);
  revalidatePath("/");
  return { success: true, id };
}

/**
 * Deletes a product from the catalog. (Admin Only)
 */
export async function deleteProductAction(id: string): Promise<ProductActionResult> {
  await requireAdmin();

  const supabase = await createClient();
  const { error } = await supabase.from("products").delete().eq("id", id);

  if (error) {
    return { success: false, error: error.message };
  }

  revalidatePath("/admin/products");
  revalidatePath("/");
  return { success: true, id };
}
