import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, ChevronRight } from "lucide-react";
import { requireAdmin } from "@/features/auth/roles";
import { createClient } from "@/lib/supabase/server";
import { ProductForm } from "@/features/products/components/product-form";

export const metadata: Metadata = {
  title: "Add New Product | UrbanNest Admin",
  description: "Create and publish a new handcrafted furniture piece to your catalog.",
  robots: {
    index: false,
    follow: false,
  },
};

export const dynamic = "force-dynamic";

export default async function NewProductPage() {
  await requireAdmin("/admin/products/new");
  const supabase = await createClient();

  const { data: categories } = await supabase
    .from("categories")
    .select("id, name")
    .order("name", { ascending: true });

  return (
    <div className="py-8 sm:py-10">
      <div className="mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Navigation Breadcrumb & Header */}
        <div className="space-y-1.5 border-b border-[#E5E2DC] pb-6">
          <div className="flex items-center gap-2 text-xs text-[#6B7280]">
            <Link href="/admin" className="hover:text-[#1A1A1A] transition-colors">
              Admin Console
            </Link>
            <ChevronRight className="size-3 text-[#A3A3A3]" />
            <Link href="/admin/products" className="hover:text-[#1A1A1A] transition-colors">
              Catalog
            </Link>
            <ChevronRight className="size-3 text-[#A3A3A3]" />
            <span className="text-[#1A1A1A] font-medium">Add Product</span>
          </div>
          
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pt-1">
            <div>
              <h1 className="font-heading text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-[#1A1A1A]">
                Add New Product
              </h1>
              <p className="text-xs sm:text-sm text-[#6B7280] mt-1">
                Configure architectural specifications, high-res photography, inventory and merchandising.
              </p>
            </div>
            
            <Link
              href="/admin/products"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#6B7280] hover:text-[#1A1A1A] transition-colors"
            >
              <ArrowLeft className="size-3.5" />
              <span>Back to Catalog</span>
            </Link>
          </div>
        </div>

        {/* 2-Column Product Publishing Workspace */}
        <ProductForm categories={categories || []} />

      </div>
    </div>
  );
}
