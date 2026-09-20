import type { Metadata } from "next"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { requireAdmin } from "@/features/auth/roles"
import { createClient } from "@/lib/supabase/server"
import { ProductForm } from "@/features/products/components/product-form"

export const metadata: Metadata = {
  title: "Add New Product | UrbanNest Admin",
  description: "Create a new handcrafted furniture product in your catalog",
}

export default async function NewProductPage() {
  await requireAdmin()
  const supabase = await createClient()

  const { data: categories } = await supabase
    .from("categories")
    .select("id, name")
    .order("name", { ascending: true })

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
        <h1 className="text-3xl font-extrabold tracking-tight text-foreground">
          Add New Product
        </h1>
        <p className="text-sm text-muted-foreground">
          Configure product details, upload high-resolution images, and set pricing and inventory.
        </p>
      </div>

      {/* Form Component */}
      <ProductForm categories={categories || []} />
    </main>
  )
}
