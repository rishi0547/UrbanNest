import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ChevronRight } from "lucide-react";
import { requireAdmin } from "@/features/auth/roles";
import { createClient } from "@/lib/supabase/server";
import { ProductForm } from "@/features/products/components/product-form";
import type { ProductInput } from "@/features/products/schemas";

interface EditProductPageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: EditProductPageProps): Promise<Metadata> {
  const { id } = await params;
  const supabase = await createClient();
  const { data: product } = await supabase
    .from("products")
    .select("title")
    .eq("id", id)
    .single();

  return {
    title: product ? `Edit ${product.title} | UrbanNest Admin` : "Edit Product | UrbanNest Admin",
    description: "Modify product specifications, pricing, inventory, and imagery.",
    robots: {
      index: false,
      follow: false,
    },
  };
}

export const dynamic = "force-dynamic";

export default async function EditProductPage({ params }: EditProductPageProps) {
  await requireAdmin("/admin/products");
  const { id } = await params;
  const supabase = await createClient();

  const [productRes, categoriesRes] = await Promise.all([
    supabase.from("products").select("*").eq("id", id).single(),
    supabase.from("categories").select("id, name").order("name", { ascending: true }),
  ]);

  if (productRes.error || !productRes.data) {
    notFound();
  }

  const product = productRes.data;
  const categories = categoriesRes.data || [];

  const initialData: ProductInput = {
    name: product.title,
    slug: product.slug,
    description: product.description ?? "",
    price: Number(product.price),
    stock: Number(product.stock),
    category_id: product.category_id ?? "",
    featured: Boolean(product.is_featured),
    active: Boolean(product.is_published),
    images: Array.isArray(product.images) && product.images.length > 0 ? product.images : [],
  };

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
            <span className="text-[#1A1A1A] font-medium">Edit Product</span>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pt-1">
            <div>
              <div className="flex items-center gap-2.5">
                <h1 className="font-heading text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-[#1A1A1A]">
                  Edit Product
                </h1>
                <span className="font-mono text-xs text-[#6B7280] bg-[#F0EDE8] px-2 py-0.5 rounded-md">
                  /{product.slug}
                </span>
              </div>
              <p className="text-xs sm:text-sm text-[#6B7280] mt-1">
                Update piece specifications, replace imagery assets, adjust pricing or toggle publication status.
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
        <ProductForm
          initialData={initialData}
          categories={categories}
          productId={product.id}
        />

      </div>
    </div>
  );
}
