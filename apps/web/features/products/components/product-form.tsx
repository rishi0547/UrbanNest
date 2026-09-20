"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { productSchema, generateSlug, type ProductInput } from "../schemas";
import { createProductAction, updateProductAction } from "../actions";
import { uploadProductImage } from "@/lib/supabase/storage";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export interface CategoryOption {
  id: string;
  name: string;
}

interface ProductFormProps {
  categories: CategoryOption[];
  initialData?: Partial<ProductInput>;
  productId?: string;
}

export function ProductForm({
  categories,
  initialData,
  productId,
}: ProductFormProps) {
  const router = useRouter();
  const isEditing = Boolean(productId);
  const [serverError, setServerError] = React.useState<string | null>(null);
  const [imageUrlInput, setImageUrlInput] = React.useState("");
  const [isUploading, setIsUploading] = React.useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<ProductInput>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      name: initialData?.name ?? "",
      slug: initialData?.slug ?? "",
      description: initialData?.description ?? "",
      price: initialData?.price ?? 0,
      stock: initialData?.stock ?? 1,
      category_id: initialData?.category_id ?? (categories[0]?.id || ""),
      featured: initialData?.featured ?? false,
      active: initialData?.active ?? true,
      images: initialData?.images ?? [],
    },
  });

  const images = watch("images");
  const nameValue = watch("name");

  // Auto-generate slug if field is currently blank
  const handleAutoSlug = () => {
    if (nameValue) {
      setValue("slug", generateSlug(nameValue), { shouldValidate: true });
    }
  };

  const handleAddImageUrl = () => {
    const trimmed = imageUrlInput.trim();
    if (!trimmed) return;
    try {
      new URL(trimmed);
      setValue("images", [...images, trimmed], { shouldValidate: true });
      setImageUrlInput("");
    } catch {
      setServerError("Please enter a valid URL (starting with http:// or https://)");
    }
  };

  const handleRemoveImage = (indexToRemove: number) => {
    setValue(
      "images",
      images.filter((_, idx) => idx !== indexToRemove),
      { shouldValidate: true }
    );
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    const file = files[0]!;

    setIsUploading(true);
    setServerError(null);
    try {
      const result = await uploadProductImage(file);
      if (result.error) {
        setServerError(result.error);
        return;
      }
      if (result.url) {
        setValue("images", [...images, result.url], { shouldValidate: true });
      }
    } finally {
      setIsUploading(false);
      e.target.value = "";
    }
  };

  const onSubmit = async (values: ProductInput) => {
    setServerError(null);
    try {
      const result = isEditing && productId
        ? await updateProductAction(productId, values)
        : await createProductAction(values);

      if (!result.success) {
        setServerError(result.error ?? "Failed to save product. Please review inputs.");
        return;
      }

      router.push("/admin/products");
      router.refresh();
    } catch {
      setServerError("An unexpected error occurred while saving.");
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {serverError && (
        <div className="rounded-lg border border-destructive/30 bg-destructive/10 p-4 text-sm text-destructive">
          {serverError}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Columns: Core Info */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="border-border bg-card/60 backdrop-blur-xs">
            <CardHeader>
              <CardTitle>Product Overview</CardTitle>
              <CardDescription>
                Title, URL slug, and detailed specifications
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-1.5">
                <Label htmlFor="name">Product Title</Label>
                <Input
                  id="name"
                  placeholder="e.g. Koben Walnut Lounge Chair"
                  disabled={isSubmitting}
                  {...register("name")}
                />
                {errors.name && (
                  <p className="text-xs text-destructive">{errors.name.message}</p>
                )}
              </div>

              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <Label htmlFor="slug">URL Slug</Label>
                  <button
                    type="button"
                    onClick={handleAutoSlug}
                    className="text-xs text-primary hover:underline"
                  >
                    Auto-generate from title
                  </button>
                </div>
                <Input
                  id="slug"
                  placeholder="e.g. koben-walnut-lounge-chair"
                  disabled={isSubmitting}
                  {...register("slug")}
                />
                {errors.slug && (
                  <p className="text-xs text-destructive">{errors.slug.message}</p>
                )}
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="description">Product Description</Label>
                <Textarea
                  id="description"
                  rows={5}
                  placeholder="Detailed description including materials, dimensions, and craft details..."
                  disabled={isSubmitting}
                  {...register("description")}
                />
                {errors.description && (
                  <p className="text-xs text-destructive">
                    {errors.description.message}
                  </p>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Media & Photography Gallery */}
          <Card className="border-border bg-card/60 backdrop-blur-xs">
            <CardHeader>
              <CardTitle>Product Photography</CardTitle>
              <CardDescription>
                Add image URLs or upload files to Supabase Storage
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-col sm:flex-row gap-2">
                <Input
                  placeholder="https://images.unsplash.com/..."
                  value={imageUrlInput}
                  onChange={(e) => setImageUrlInput(e.target.value)}
                  disabled={isSubmitting || isUploading}
                />
                <Button
                  type="button"
                  variant="secondary"
                  onClick={handleAddImageUrl}
                  disabled={isSubmitting || isUploading}
                >
                  Add URL
                </Button>
              </div>

              <div className="flex items-center gap-3 pt-2">
                <Label
                  htmlFor="file-upload"
                  className="cursor-pointer inline-flex items-center justify-center rounded-lg border border-border bg-background px-3 py-2 text-xs font-medium hover:bg-muted transition-colors"
                >
                  {isUploading ? "Uploading to Storage..." : "Upload from Computer"}
                </Label>
                <input
                  id="file-upload"
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  disabled={isSubmitting || isUploading}
                  className="hidden"
                />
                <span className="text-xs text-muted-foreground">
                  Saved to Supabase <code className="font-mono">product-images</code> bucket
                </span>
              </div>

              {errors.images && (
                <p className="text-xs text-destructive">{errors.images.message}</p>
              )}

              {/* Image Previews */}
              {images.length > 0 && (
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
                  {images.map((imgUrl, index) => (
                    <div
                      key={index}
                      className="group relative aspect-square rounded-lg border border-border overflow-hidden bg-muted/30"
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={imgUrl}
                        alt={`Preview ${index + 1}`}
                        className="h-full w-full object-cover"
                      />
                      <button
                        type="button"
                        onClick={() => handleRemoveImage(index)}
                        className="absolute top-1 right-1 rounded-full bg-destructive/90 text-white p-1 text-[10px] opacity-0 group-hover:opacity-100 transition-opacity"
                        title="Remove image"
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Right 1 Column: Commercial & Taxonomy */}
        <div className="space-y-6">
          <Card className="border-border bg-card/60 backdrop-blur-xs">
            <CardHeader>
              <CardTitle>Pricing & Inventory</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-1.5">
                <Label htmlFor="price">Price (USD)</Label>
                <Input
                  id="price"
                  type="number"
                  step="0.01"
                  placeholder="890.00"
                  disabled={isSubmitting}
                  {...register("price", { valueAsNumber: true })}
                />
                {errors.price && (
                  <p className="text-xs text-destructive">{errors.price.message}</p>
                )}
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="stock">Available Stock</Label>
                <Input
                  id="stock"
                  type="number"
                  step="1"
                  placeholder="10"
                  disabled={isSubmitting}
                  {...register("stock", { valueAsNumber: true })}
                />
                {errors.stock && (
                  <p className="text-xs text-destructive">{errors.stock.message}</p>
                )}
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="category_id">Category</Label>
                <select
                  id="category_id"
                  className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-xs transition-colors focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                  disabled={isSubmitting}
                  {...register("category_id")}
                >
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id} className="bg-popover text-popover-foreground">
                      {cat.name}
                    </option>
                  ))}
                </select>
                {errors.category_id && (
                  <p className="text-xs text-destructive">
                    {errors.category_id.message}
                  </p>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Visibility & Badges */}
          <Card className="border-border bg-card/60 backdrop-blur-xs">
            <CardHeader>
              <CardTitle>Display Flags</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <label className="flex items-center space-x-3 cursor-pointer">
                <input
                  type="checkbox"
                  className="h-4 w-4 rounded border-input text-primary focus:ring-ring"
                  disabled={isSubmitting}
                  {...register("active")}
                />
                <div>
                  <span className="text-sm font-medium text-foreground">Active Listing</span>
                  <p className="text-xs text-muted-foreground">
                    Item is published and browsable on storefront
                  </p>
                </div>
              </label>

              <label className="flex items-center space-x-3 cursor-pointer">
                <input
                  type="checkbox"
                  className="h-4 w-4 rounded border-input text-primary focus:ring-ring"
                  disabled={isSubmitting}
                  {...register("featured")}
                />
                <div>
                  <span className="text-sm font-medium text-foreground">Featured Showcase</span>
                  <p className="text-xs text-muted-foreground">
                    Highlight on homepage hero and curated collections
                  </p>
                </div>
              </label>
            </CardContent>
            <CardFooter className="flex flex-col gap-2 border-t border-border/50 pt-4">
              <Button
                type="submit"
                className="w-full"
                disabled={isSubmitting || isUploading}
              >
                {isSubmitting
                  ? "Saving Product..."
                  : isEditing
                  ? "Update Product"
                  : "Publish Product"}
              </Button>
              <Link href="/admin/products" className="w-full">
                <Button
                  type="button"
                  variant="ghost"
                  className="w-full"
                  disabled={isSubmitting}
                >
                  Cancel
                </Button>
              </Link>
            </CardFooter>
          </Card>
        </div>
      </div>
    </form>
  );
}
