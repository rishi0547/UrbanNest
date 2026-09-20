export interface ProductCategory {
  id: string;
  name: string;
  slug: string;
  description?: string | null;
}

export interface CatalogProduct {
  id: string;
  title: string;
  slug: string;
  description: string;
  price: number;
  compare_at_price: number | null;
  stock: number;
  images: string[];
  category_id: string;
  is_featured: boolean;
  is_published: boolean;
  created_at: string;
  category?: ProductCategory | null;
}

export interface CatalogFilterOptions {
  categorySlug?: string;
  featuredOnly?: boolean;
  searchQuery?: string;
  sortBy?: "newest" | "price_asc" | "price_desc";
  limit?: number;
}
