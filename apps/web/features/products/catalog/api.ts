import { createClient } from "@/lib/supabase/client";
import type {
  CatalogProduct,
  ProductCategory,
  CatalogFilterOptions,
} from "./types";

/**
 * Resolves the Supabase client.
 * Defaults to the browser/client-safe Supabase client unless a server instance is passed.
 */
function getSupabase(client?: any) {
  return client || createClient();
}

/**
 * Fetch all published products with optional category, search, and sorting filters.
 */
export async function getProducts(
  options: CatalogFilterOptions = {},
  client?: any
): Promise<CatalogProduct[]> {
  const supabase = getSupabase(client);

  let categoryId: string | null = null;

  if (options.categorySlug && options.categorySlug !== "all") {
    const { data: catData } = await supabase
      .from("categories")
      .select("id")
      .eq("slug", options.categorySlug)
      .single();

    if (catData) {
      categoryId = catData.id;
    }
  }

  let query = supabase
    .from("products")
    .select(`
      id,
      title,
      slug,
      description,
      price,
      compare_at_price,
      stock,
      images,
      category_id,
      is_featured,
      is_published,
      created_at,
      category:categories (
        id,
        name,
        slug,
        description
      )
    `)
    .eq("is_published", true);

  if (categoryId) {
    query = query.eq("category_id", categoryId);
  }

  if (options.featuredOnly) {
    query = query.eq("is_featured", true);
  }

  if (options.searchQuery?.trim()) {
    query = query.ilike("title", `%${options.searchQuery.trim()}%`);
  }

  // Sorting
  if (options.sortBy === "price_asc") {
    query = query.order("price", { ascending: true });
  } else if (options.sortBy === "price_desc") {
    query = query.order("price", { ascending: false });
  } else {
    query = query.order("created_at", { ascending: false });
  }

  if (options.limit && options.limit > 0) {
    query = query.limit(options.limit);
  }

  const { data, error } = await query;

  if (error) {
    console.error("Error fetching products:", error);
    return [];
  }

  return (data || []) as unknown as CatalogProduct[];
}

/**
 * Fetch a single product by its SEO slug.
 */
export async function getProductBySlug(
  slug: string,
  client?: any
): Promise<CatalogProduct | null> {
  const supabase = getSupabase(client);

  const { data, error } = await supabase
    .from("products")
    .select(`
      id,
      title,
      slug,
      description,
      price,
      compare_at_price,
      stock,
      images,
      category_id,
      is_featured,
      is_published,
      created_at,
      category:categories (
        id,
        name,
        slug,
        description
      )
    `)
    .eq("slug", slug)
    .eq("is_published", true)
    .single();

  if (error || !data) {
    return null;
  }

  return data as unknown as CatalogProduct;
}

/**
 * Fetch featured curated products for homepage or highlight sections.
 */
export async function getFeaturedProducts(
  limit: number = 4,
  client?: any
): Promise<CatalogProduct[]> {
  return getProducts({ featuredOnly: true, limit }, client);
}

/**
 * Fetch categories for catalog navigation filters.
 */
export async function getCategories(client?: any): Promise<ProductCategory[]> {
  const supabase = getSupabase(client);

  const { data, error } = await supabase
    .from("categories")
    .select("id, name, slug, description")
    .order("name", { ascending: true });

  if (error) {
    console.error("Error fetching categories:", error);
    return [];
  }

  return (data || []) as ProductCategory[];
}
