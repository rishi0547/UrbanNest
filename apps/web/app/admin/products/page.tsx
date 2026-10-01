import type { Metadata } from "next";
import Link from "next/link";
import { Plus, ArrowLeft, Package, CheckCircle2, AlertTriangle, ChevronRight } from "lucide-react";
import { requireAdmin } from "@/features/auth/roles";
import { createClient } from "@/lib/supabase/server";
import { Button } from "@/components/ui/button";
import {
  AdminProductsCatalog,
  type ProductRecord,
  type CategoryRecord,
} from "@/features/products/components/admin-products-catalog";

export const metadata: Metadata = {
  title: "Product Catalog | UrbanNest Admin",
  description: "Manage furniture catalog inventory, pricing, stock levels, and publication status.",
  robots: {
    index: false,
    follow: false,
  },
};

export const dynamic = "force-dynamic";

export default async function AdminProductsPage() {
  await requireAdmin("/admin/products");
  const supabase = await createClient();

  // Fetch all products with category details and categories list
  const [productsRes, categoriesRes] = await Promise.all([
    supabase
      .from("products")
      .select(`
        id,
        title,
        slug,
        description,
        price,
        stock,
        images,
        image_url,
        is_featured,
        is_published,
        created_at,
        category_id,
        category:categories (
          id,
          name,
          slug
        )
      `)
      .order("created_at", { ascending: false }),
    supabase
      .from("categories")
      .select("id, name, slug")
      .order("name", { ascending: true }),
  ]);

  const products = (productsRes.data || []) as unknown as ProductRecord[];
  const categories = (categoriesRes.data || []) as CategoryRecord[];

  const totalCount = products.length;
  const publishedCount = products.filter((p) => p.is_published).length;
  const lowStockCount = products.filter((p) => p.stock <= 5).length;

  return (
    <div className="py-8 sm:py-10">
      <div className="mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Navigation Breadcrumb & Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-[#E5E2DC] pb-6">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2 text-xs text-[#6B7280]">
              <Link href="/admin" className="hover:text-[#1A1A1A] transition-colors">
                Admin Console
              </Link>
              <ChevronRight className="size-3 text-[#A3A3A3]" />
              <span className="text-[#1A1A1A] font-medium">Catalog</span>
            </div>
            <div className="flex items-center gap-3">
              <h1 className="font-heading text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-[#1A1A1A]">
                Product Catalog
              </h1>
              <span className="rounded-full bg-[#5D6B4D]/10 text-[#5D6B4D] border border-[#5D6B4D]/20 px-2.5 py-0.5 text-xs font-bold font-mono">
                {totalCount} Total
              </span>
            </div>
            <p className="text-xs sm:text-sm text-[#6B7280]">
              Manage your furniture catalog, inventory, pricing and merchandising.
            </p>
          </div>

          <Link href="/admin/products/new" className="w-full sm:w-auto">
            <Button className="w-full sm:w-auto rounded-lg bg-[#5D6B4D] hover:bg-[#4E5A40] text-white font-semibold text-xs px-4 h-10 shadow-xs flex items-center justify-center gap-1.5">
              <Plus className="size-4" />
              <span>Add Product</span>
            </Button>
          </Link>
        </div>

        {/* Compact Summary Metrics Bar */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {/* Total Products */}
          <div className="rounded-xl border border-[#E5E2DC] bg-white p-5 shadow-2xs flex items-center justify-between">
            <div className="space-y-1">
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#6B7280]">
                Total Products
              </span>
              <div className="font-heading text-2xl sm:text-3xl font-bold text-[#1A1A1A]">
                {totalCount}
              </div>
              <p className="text-[11px] text-[#6B7280]">Catalog database entries</p>
            </div>
            <div className="size-10 rounded-lg bg-[#5D6B4D]/10 text-[#5D6B4D] flex items-center justify-center shrink-0">
              <Package className="size-5" />
            </div>
          </div>

          {/* Active Storefront */}
          <div className="rounded-xl border border-[#E5E2DC] bg-white p-5 shadow-2xs flex items-center justify-between">
            <div className="space-y-1">
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#6B7280]">
                Active Storefront
              </span>
              <div className="font-heading text-2xl sm:text-3xl font-bold text-emerald-700">
                {publishedCount}
              </div>
              <p className="text-[11px] text-emerald-700 font-medium">Visible to customer buyers</p>
            </div>
            <div className="size-10 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0">
              <CheckCircle2 className="size-5" />
            </div>
          </div>

          {/* Low Stock */}
          <div className="rounded-xl border border-[#E5E2DC] bg-white p-5 shadow-2xs flex items-center justify-between">
            <div className="space-y-1">
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#6B7280]">
                Low Stock (&le; 5 units)
              </span>
              <div className={`font-heading text-2xl sm:text-3xl font-bold ${lowStockCount > 0 ? "text-amber-700" : "text-[#6B7280]"}`}>
                {lowStockCount}
              </div>
              <p className="text-[11px] text-[#6B7280]">
                {lowStockCount > 0 ? "Requires restock replenishment" : "Inventory levels healthy"}
              </p>
            </div>
            <div className={`size-10 rounded-lg flex items-center justify-center shrink-0 ${lowStockCount > 0 ? "bg-amber-50 text-amber-700" : "bg-gray-100 text-gray-400"}`}>
              <AlertTriangle className="size-5" />
            </div>
          </div>
        </div>

        {/* Database Error State if query failed */}
        {productsRes.error && (
          <div className="rounded-xl border border-rose-200 bg-rose-50 p-4 text-xs text-rose-700">
            Database error loading products: {productsRes.error.message}
          </div>
        )}

        {/* Interactive Catalog Component with Search, Multi-Filter, Sorting & Refined Table */}
        <AdminProductsCatalog
          initialProducts={products}
          categories={categories}
        />

      </div>
    </div>
  );
}
