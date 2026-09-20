import type { Metadata } from "next"
import Link from "next/link"
import Image from "next/image"
import { Plus, ArrowLeft, Package, ExternalLink, Edit } from "lucide-react"
import { requireAdmin } from "@/features/auth/roles"
import { createClient } from "@/lib/supabase/server"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { DeleteProductButton } from "@/features/products/components/delete-product-button"

export const metadata: Metadata = {
  title: "Product Catalog | UrbanNest Admin",
  description: "Manage catalog inventory, pricing, stock levels, and publication status",
}

interface ProductRecord {
  id: string
  title: string
  slug: string
  description: string | null
  price: number
  stock: number
  images: string[] | null
  is_featured: boolean
  is_published: boolean
  created_at: string
  category_id: string | null
  category: {
    id: string
    name: string
    slug: string
  } | null
}

export default async function AdminProductsPage() {
  await requireAdmin()
  const supabase = await createClient()

  const { data: rawProducts, error } = await supabase
    .from("products")
    .select(`
      id,
      title,
      slug,
      description,
      price,
      stock,
      images,
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
    .order("created_at", { ascending: false })

  const products = (rawProducts || []) as unknown as ProductRecord[]

  const totalCount = products.length
  const publishedCount = products.filter((p) => p.is_published).length
  const lowStockCount = products.filter((p) => p.stock <= 5).length

  return (
    <main className="container mx-auto max-w-6xl px-4 py-8 space-y-6">
      {/* Navigation Breadcrumb & Actions */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-border/60 pb-5">
        <div className="space-y-1">
          <Link
            href="/admin"
            className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors mb-1"
          >
            <ArrowLeft className="size-3.5" />
            Back to Dashboard
          </Link>
          <div className="flex items-center gap-3">
            <h1 className="text-3xl font-extrabold tracking-tight text-foreground">
              Product Catalog
            </h1>
            <Badge variant="secondary" className="font-mono text-xs">
              {totalCount} Total
            </Badge>
          </div>
          <p className="text-sm text-muted-foreground">
            Manage your furniture catalog, inventory, pricing, and visual merchandising.
          </p>
        </div>

        <Link href="/admin/products/new">
          <Button className="font-semibold shadow-xs">
            <Plus className="size-4 mr-1.5" />
            Add Product
          </Button>
        </Link>
      </div>

      {/* Metrics Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="border-border bg-card/50">
          <CardHeader className="py-3 px-4">
            <CardDescription className="text-xs uppercase font-medium">Total Products</CardDescription>
            <CardTitle className="text-2xl font-bold">{totalCount}</CardTitle>
          </CardHeader>
        </Card>
        <Card className="border-border bg-card/50">
          <CardHeader className="py-3 px-4">
            <CardDescription className="text-xs uppercase font-medium">Active Storefront</CardDescription>
            <CardTitle className="text-2xl font-bold text-emerald-500">{publishedCount}</CardTitle>
          </CardHeader>
        </Card>
        <Card className="border-border bg-card/50">
          <CardHeader className="py-3 px-4">
            <CardDescription className="text-xs uppercase font-medium">Low Stock (&le; 5)</CardDescription>
            <CardTitle className={`text-2xl font-bold ${lowStockCount > 0 ? "text-amber-500" : "text-muted-foreground"}`}>
              {lowStockCount}
            </CardTitle>
          </CardHeader>
        </Card>
      </div>

      {/* Error state if Supabase query failed */}
      {error && (
        <div className="rounded-lg border border-destructive/50 bg-destructive/10 p-4 text-sm text-destructive">
          Database error loading products: {error.message}
        </div>
      )}

      {/* Product List Table / Empty State */}
      {products.length === 0 ? (
        <Card className="border-dashed border-border py-16 text-center">
          <CardContent className="space-y-4 max-w-sm mx-auto">
            <div className="mx-auto size-12 rounded-full bg-muted flex items-center justify-center text-muted-foreground">
              <Package className="size-6" />
            </div>
            <div>
              <h3 className="font-semibold text-lg">No products found</h3>
              <p className="text-sm text-muted-foreground mt-1">
                Your catalog is currently empty. Add your first handcrafted furniture piece to get started.
              </p>
            </div>
            <Link href="/admin/products/new">
              <Button className="mt-2">
                <Plus className="size-4 mr-1.5" />
                Add Your First Product
              </Button>
            </Link>
          </CardContent>
        </Card>
      ) : (
        <Card className="border-border overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-muted/40 text-xs font-semibold text-muted-foreground uppercase tracking-wider border-b border-border">
                <tr>
                  <th className="py-3 px-4">Product</th>
                  <th className="py-3 px-4">Category</th>
                  <th className="py-3 px-4">Price</th>
                  <th className="py-3 px-4">Stock</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60">
                {products.map((product) => {
                  const thumbnail = product.images?.[0]
                  return (
                    <tr
                      key={product.id}
                      className="hover:bg-muted/30 transition-colors group"
                    >
                      {/* Product Thumbnail & Name */}
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          <div className="relative size-12 rounded-md overflow-hidden bg-muted border border-border shrink-0 flex items-center justify-center">
                            {thumbnail ? (
                              <Image
                                src={thumbnail}
                                alt={product.title}
                                fill
                                sizes="48px"
                                className="object-cover"
                              />
                            ) : (
                              <Package className="size-5 text-muted-foreground" />
                            )}
                          </div>
                          <div className="min-w-0">
                            <div className="font-semibold text-foreground truncate max-w-xs group-hover:text-primary transition-colors">
                              {product.title}
                            </div>
                            <div className="text-xs font-mono text-muted-foreground truncate max-w-xs">
                              /{product.slug}
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Category */}
                      <td className="py-3 px-4">
                        {product.category ? (
                          <Badge variant="outline" className="font-medium text-xs">
                            {product.category.name}
                          </Badge>
                        ) : (
                          <span className="text-xs text-muted-foreground italic">Unassigned</span>
                        )}
                      </td>

                      {/* Price */}
                      <td className="py-3 px-4 font-mono font-medium">
                        ${Number(product.price).toFixed(2)}
                      </td>

                      {/* Stock */}
                      <td className="py-3 px-4">
                        {product.stock === 0 ? (
                          <Badge variant="destructive" className="text-xs">Out of Stock</Badge>
                        ) : product.stock <= 5 ? (
                          <Badge variant="secondary" className="text-xs text-amber-500 border-amber-500/30">
                            {product.stock} Left
                          </Badge>
                        ) : (
                          <span className="text-xs font-medium text-foreground">{product.stock} units</span>
                        )}
                      </td>

                      {/* Status Badges */}
                      <td className="py-3 px-4">
                        <div className="flex flex-wrap items-center gap-1.5">
                          {product.is_published ? (
                            <Badge variant="success" className="text-xs">
                              Active
                            </Badge>
                          ) : (
                            <Badge variant="secondary" className="text-xs">
                              Draft
                            </Badge>
                          )}
                          {product.is_featured && (
                            <Badge variant="default" className="text-xs bg-primary/20 text-primary border-primary/40">
                              Featured
                            </Badge>
                          )}
                        </div>
                      </td>

                      {/* Actions */}
                      <td className="py-3 px-4 text-right">
                        <div className="inline-flex items-center justify-end gap-1">
                          <Link href={`/admin/products/${product.id}`}>
                            <Button
                              size="sm"
                              variant="ghost"
                              className="h-8 px-2.5 text-muted-foreground hover:text-foreground"
                              title="Edit product"
                            >
                              <Edit className="size-4" />
                              <span className="sr-only">Edit</span>
                            </Button>
                          </Link>
                          <DeleteProductButton
                            productId={product.id}
                            productName={product.title}
                          />
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </Card>
      )}
    </main>
  )
}
