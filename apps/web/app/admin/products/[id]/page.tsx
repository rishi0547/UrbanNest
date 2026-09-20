import type { Metadata } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"
import { ArrowLeft } from "lucide-react"
import { requireAdmin } from "@/features/auth/roles"
import { createClient } from "@/lib/supabase/server"
import { ProductForm } from "@/features/products/components/product-form"
import type { ProductInput } from "@/features/products/schemas"

interface EditProductPageProps {
  params: Promise<{ id: string }>
}

export async function generateMetadata({ params }: EditProductPageProps): Promise<Metadata> {
  const { id } = await params
  const supabase = await createClient()
  const { data: product } = await supabase
    .from("products")
    .select("title")
    .eq("id", id)
    .single()

  return {
    title: product ? `Edit ${product.title} | UrbanNest Admin` : "Edit Product | UrbanNest Admin",
    description: "Modify product specifications, pricing, inventory, and imagery",
  }
}

export default async function EditProductPage({ params }: EditProductPageProps) {
  await requireAdmin()
  const { id } = await params
  const supabase = await createClient()

  const [productRes, categoriesRes] = await Promise.all([
    supabase.from("products").select("*").eq("id", id).single(),
    supabase.from("categories").select("id, name").order("name", { ascending: true }),
  ])

  if (productRes.error || !productRes.data) {
    notFound()
  }

  const product = productRes.data
  const categories = categoriesRes.data || []

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
  }

  return (
    <main className="container mx-auto max-w-4xl px-4 py-8 space-y-6">
      {/* Breadcrumb Navigation */}
      <div className="space-y-1 border-b border-border/60 pb-5">
        <Link
          href="/admin/products"
          className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors mb-1"
        >
          <ArrowLeft className="size-3.5" />
          Back to Product Catalog
        </Link>
        <div className="flex items-center gap-2">
          <h1 className="text-3xl font-extrabold tracking-tight text-foreground">
            Edit Product
          </h1>
          <span className="text-sm font-mono text-muted-foreground">({product.title})</span>
        </div>
        <p className="text-sm text-muted-foreground">
          Update product details, upload replacement assets, adjust prices, or toggle active status.
        </p>
      </div>

      {/* Form Component */}
      <ProductForm
        initialData={initialData}
        categories={categories}
        productId={product.id}
      />
    </main>
  )
}
