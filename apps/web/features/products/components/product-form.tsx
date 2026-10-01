"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Upload,
  Link as LinkIcon,
  X,
  Sparkles,
  Check,
  AlertCircle,
  Loader2,
  Image as ImageIcon,
  DollarSign,
  Package,
  Layers,
  ArrowRight,
} from "lucide-react";
import {
  productSchema,
  generateSlug,
  CANONICAL_CATEGORIES,
  type ProductInput,
} from "../schemas";
import { createProductAction, updateProductAction } from "../actions";
import { uploadProductImage } from "@/lib/supabase/storage";
import { Button } from "@/components/ui/button";

export interface CategoryOption {
  id: string;
  name: string;
}

const CANONICAL_SORT_ORDER: Record<string, number> = {
  "11111111-1111-1111-1111-111111111111": 1, // Living Room
  "22222222-2222-2222-2222-222222222222": 2, // Bedroom
  "33333333-3333-3333-3333-333333333333": 3, // Dining Room
  "44444444-4444-4444-4444-444444444444": 4, // Home Office
  "55555555-5555-5555-5555-555555555555": 5, // Storage
};

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

  const availableCategories = React.useMemo(() => {
    const list =
      categories && categories.length > 0
        ? categories
        : CANONICAL_CATEGORIES.map((c) => ({ id: c.id, name: c.name }));

    return [...list].sort((a, b) => {
      const orderA = CANONICAL_SORT_ORDER[a.id] ?? 99;
      const orderB = CANONICAL_SORT_ORDER[b.id] ?? 99;
      return orderA - orderB;
    });
  }, [categories]);

  const defaultCategoryId =
    initialData?.category_id && initialData.category_id.trim() !== ""
      ? initialData.category_id
      : availableCategories[0]?.id || CANONICAL_CATEGORIES[0].id;

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    trigger,
    formState: { errors, isSubmitting },
  } = useForm<ProductInput>({
    resolver: zodResolver(productSchema),
    mode: "onChange",
    defaultValues: {
      name: initialData?.name ?? "",
      slug: initialData?.slug ?? "",
      description: initialData?.description ?? "",
      price: initialData?.price ?? 0,
      stock: initialData?.stock ?? 1,
      category_id: defaultCategoryId,
      featured: initialData?.featured ?? false,
      active: initialData?.active ?? true,
      images: initialData?.images ?? [],
    },
  });

  const images = watch("images");
  const nameValue = watch("name");

  // Auto-generate slug if triggered
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
      setServerError(null);
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
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
      {serverError && (
        <div className="rounded-xl border border-rose-200 bg-rose-50 p-4 text-xs font-medium text-rose-700 flex items-center gap-2.5 shadow-2xs">
          <AlertCircle className="size-4 shrink-0 text-rose-600" />
          <span>{serverError}</span>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* LEFT COLUMN: Specifications & Imagery (7 cols on lg, 8 on xl) */}
        <div className="lg:col-span-7 xl:col-span-8 space-y-6">
          
          {/* Section: Product Overview */}
          <div className="rounded-xl border border-[#E5E2DC] bg-white p-6 shadow-2xs space-y-5">
            <div className="border-b border-[#E5E2DC] pb-4">
              <span className="text-[11px] font-bold uppercase tracking-widest text-[#5D6B4D]">
                Catalog Entity
              </span>
              <h2 className="font-heading text-lg font-bold text-[#1A1A1A] mt-0.5">
                Product Overview
              </h2>
              <p className="text-xs text-[#6B7280]">
                Primary product title, web URL slug, and architectural specifications.
              </p>
            </div>

            <div className="space-y-4">
              {/* Product Title */}
              <div className="space-y-1.5">
                <label htmlFor="name" className="text-xs font-semibold text-[#1A1A1A]">
                  Product Title <span className="text-rose-600">*</span>
                </label>
                <input
                  id="name"
                  type="text"
                  placeholder="e.g. Koben Walnut Lounge Chair"
                  disabled={isSubmitting}
                  {...register("name")}
                  className="w-full h-10 px-3.5 rounded-lg border border-[#E5E2DC] bg-[#F8F6F2]/30 text-xs sm:text-sm text-[#1A1A1A] placeholder:text-[#A3A3A3] focus:outline-none focus:border-[#5D6B4D] focus:bg-white transition-colors"
                />
                {errors.name && (
                  <p className="text-[11px] text-rose-600">{errors.name.message}</p>
                )}
              </div>

              {/* URL Slug with auto generate */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label htmlFor="slug" className="text-xs font-semibold text-[#1A1A1A]">
                    URL Slug <span className="text-rose-600">*</span>
                  </label>
                  <button
                    type="button"
                    onClick={handleAutoSlug}
                    className="text-[11px] font-medium text-[#5D6B4D] hover:underline cursor-pointer"
                  >
                    Auto-generate from title
                  </button>
                </div>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-xs font-mono text-[#A3A3A3]">
                    /
                  </span>
                  <input
                    id="slug"
                    type="text"
                    placeholder="koben-walnut-lounge-chair"
                    disabled={isSubmitting}
                    {...register("slug")}
                    className="w-full h-10 pl-7 pr-3.5 font-mono rounded-lg border border-[#E5E2DC] bg-[#F8F6F2]/30 text-xs sm:text-sm text-[#1A1A1A] placeholder:text-[#A3A3A3] focus:outline-none focus:border-[#5D6B4D] focus:bg-white transition-colors"
                  />
                </div>
                {errors.slug && (
                  <p className="text-[11px] text-rose-600">{errors.slug.message}</p>
                )}
              </div>

              {/* Description */}
              <div className="space-y-1.5">
                <label htmlFor="description" className="text-xs font-semibold text-[#1A1A1A]">
                  Product Description
                </label>
                <textarea
                  id="description"
                  rows={6}
                  placeholder="Detailed architectural description including materials (e.g. American Walnut, Linen upholstery), dimensions, and craft lineage..."
                  disabled={isSubmitting}
                  {...register("description")}
                  className="w-full p-3.5 rounded-lg border border-[#E5E2DC] bg-[#F8F6F2]/30 text-xs sm:text-sm text-[#1A1A1A] placeholder:text-[#A3A3A3] focus:outline-none focus:border-[#5D6B4D] focus:bg-white transition-colors resize-y leading-relaxed"
                />
                {errors.description && (
                  <p className="text-[11px] text-rose-600">
                    {errors.description.message}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Section: Product Photography & Media Manager */}
          <div className="rounded-xl border border-[#E5E2DC] bg-white p-6 shadow-2xs space-y-5">
            <div className="border-b border-[#E5E2DC] pb-4">
              <span className="text-[11px] font-bold uppercase tracking-widest text-[#5D6B4D]">
                Visual Assets
              </span>
              <h2 className="font-heading text-lg font-bold text-[#1A1A1A] mt-0.5">
                Product Photography
              </h2>
              <p className="text-xs text-[#6B7280]">
                High-resolution imagery for storefront display. Upload directly or link hosted URLs.
              </p>
            </div>

            {/* Gallery Previews Grid */}
            {images.length > 0 && (
              <div className="space-y-2">
                <span className="text-xs font-semibold text-[#1A1A1A]">
                  Active Media Gallery ({images.length} {images.length === 1 ? "image" : "images"})
                </span>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {images.map((imgUrl, index) => (
                    <div
                      key={index}
                      className="group relative aspect-square rounded-lg border border-[#E5E2DC] overflow-hidden bg-[#F0EDE8]/60 shadow-2xs"
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={imgUrl}
                        alt={`Product shot ${index + 1}`}
                        className="h-full w-full object-cover transition-transform group-hover:scale-105 duration-300"
                      />
                      <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center p-2">
                        <button
                          type="button"
                          onClick={() => handleRemoveImage(index)}
                          className="rounded-full bg-rose-600 text-white p-1.5 shadow-xs hover:bg-rose-700 transition-colors"
                          title="Remove image"
                        >
                          <X className="size-3.5" />
                        </button>
                      </div>
                      {index === 0 && (
                        <span className="absolute bottom-1.5 left-1.5 rounded-md bg-[#1A1A1A]/80 backdrop-blur-xs text-white text-[9px] font-bold uppercase px-1.5 py-0.5">
                          Primary
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* URL Input Bar */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-[#1A1A1A]">
                Add Image from URL
              </label>
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <LinkIcon className="absolute left-3 top-1/2 -translate-y-1/2 size-3.5 text-[#A3A3A3]" />
                  <input
                    type="url"
                    placeholder="https://images.unsplash.com/..."
                    value={imageUrlInput}
                    onChange={(e) => setImageUrlInput(e.target.value)}
                    disabled={isSubmitting || isUploading}
                    className="w-full h-10 pl-9 pr-3 rounded-lg border border-[#E5E2DC] bg-[#F8F6F2]/30 text-xs text-[#1A1A1A] placeholder:text-[#A3A3A3] focus:outline-none focus:border-[#5D6B4D] focus:bg-white"
                  />
                </div>
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleAddImageUrl}
                  disabled={isSubmitting || isUploading || !imageUrlInput.trim()}
                  className="rounded-lg border-[#E5E2DC] bg-white text-xs font-semibold px-4 h-10 hover:bg-[#F0EDE8]/50"
                >
                  Add URL
                </Button>
              </div>
            </div>

            {/* Upload to Supabase Storage */}
            <div className="rounded-lg border border-dashed border-[#E5E2DC] bg-[#F8F6F2]/40 p-4 sm:p-5 text-center space-y-2">
              <div className="mx-auto size-9 rounded-full bg-white border border-[#E5E2DC] flex items-center justify-center text-[#5D6B4D]">
                {isUploading ? (
                  <Loader2 className="size-4 animate-spin" />
                ) : (
                  <Upload className="size-4" />
                )}
              </div>
              <div>
                <label
                  htmlFor="file-upload"
                  className="cursor-pointer inline-flex items-center text-xs font-semibold text-[#5D6B4D] hover:underline"
                >
                  {isUploading ? "Uploading to Supabase Storage..." : "Upload from Computer"}
                </label>
                <p className="text-[11px] text-[#6B7280]">
                  PNG, JPG, WEBP up to 5MB. Uploaded securely to Supabase Storage bucket.
                </p>
              </div>
              <input
                id="file-upload"
                type="file"
                accept="image/*"
                onChange={handleFileUpload}
                disabled={isSubmitting || isUploading}
                className="hidden"
              />
            </div>

            {errors.images && (
              <p className="text-[11px] text-rose-600">{errors.images.message}</p>
            )}
          </div>
        </div>

        {/* RIGHT COLUMN: Merchandising, Pricing & Publishing (5 cols on lg, 4 on xl) */}
        <div className="lg:col-span-5 xl:col-span-4 space-y-6">
          
          {/* Section: Pricing & Inventory */}
          <div className="rounded-xl border border-[#E5E2DC] bg-white p-6 shadow-2xs space-y-5">
            <div className="border-b border-[#E5E2DC] pb-4">
              <span className="text-[11px] font-bold uppercase tracking-widest text-[#5D6B4D]">
                Commercials
              </span>
              <h2 className="font-heading text-lg font-bold text-[#1A1A1A] mt-0.5">
                Pricing &amp; Inventory
              </h2>
            </div>

            <div className="space-y-4">
              {/* Price in INR */}
              <div className="space-y-1.5">
                <label htmlFor="price" className="text-xs font-semibold text-[#1A1A1A]">
                  Retail Price (₹ INR) <span className="text-rose-600">*</span>
                </label>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-xs font-semibold text-[#6B7280]">
                    ₹
                  </span>
                  <input
                    id="price"
                    type="number"
                    step="1"
                    min="0"
                    placeholder="14999"
                    disabled={isSubmitting}
                    {...register("price", { valueAsNumber: true })}
                    className="w-full h-10 pl-8 pr-3.5 font-mono rounded-lg border border-[#E5E2DC] bg-[#F8F6F2]/30 text-xs sm:text-sm text-[#1A1A1A] placeholder:text-[#A3A3A3] focus:outline-none focus:border-[#5D6B4D] focus:bg-white transition-colors"
                  />
                </div>
                {errors.price && (
                  <p className="text-[11px] text-rose-600">{errors.price.message}</p>
                )}
              </div>

              {/* Available Stock */}
              <div className="space-y-1.5">
                <label htmlFor="stock" className="text-xs font-semibold text-[#1A1A1A]">
                  Available Stock (Units) <span className="text-rose-600">*</span>
                </label>
                <input
                  id="stock"
                  type="number"
                  step="1"
                  min="0"
                  placeholder="10"
                  disabled={isSubmitting}
                  {...register("stock", { valueAsNumber: true })}
                  className="w-full h-10 px-3.5 font-mono rounded-lg border border-[#E5E2DC] bg-[#F8F6F2]/30 text-xs sm:text-sm text-[#1A1A1A] placeholder:text-[#A3A3A3] focus:outline-none focus:border-[#5D6B4D] focus:bg-white transition-colors"
                />
                {errors.stock && (
                  <p className="text-[11px] text-rose-600">{errors.stock.message}</p>
                )}
              </div>

              {/* Category */}
              <div className="space-y-1.5">
                <label htmlFor="category_id" className="text-xs font-semibold text-[#1A1A1A]">
                  Collection Taxonomy
                </label>
                <select
                  id="category_id"
                  disabled={isSubmitting}
                  {...register("category_id", {
                    onChange: () => {
                      trigger("category_id");
                    },
                  })}
                  className="w-full h-10 px-3 rounded-lg border border-[#E5E2DC] bg-white text-xs sm:text-sm text-[#1A1A1A] focus:outline-none focus:border-[#5D6B4D] cursor-pointer shadow-2xs"
                >
                  {availableCategories.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.name}
                    </option>
                  ))}
                </select>
                {errors.category_id && (
                  <p className="text-[11px] text-rose-600">
                    {errors.category_id.message}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Section: Merchandising & Display Flags */}
          <div className="rounded-xl border border-[#E5E2DC] bg-white p-6 shadow-2xs space-y-5">
            <div className="border-b border-[#E5E2DC] pb-4">
              <span className="text-[11px] font-bold uppercase tracking-widest text-[#5D6B4D]">
                Merchandising
              </span>
              <h2 className="font-heading text-lg font-bold text-[#1A1A1A] mt-0.5">
                Display Flags
              </h2>
            </div>

            <div className="space-y-4">
              {/* Active Listing Toggle Row */}
              <label className="flex items-start gap-3 p-3 rounded-lg border border-[#E5E2DC] bg-[#F8F6F2]/30 hover:bg-[#F8F6F2] cursor-pointer transition-colors">
                <input
                  type="checkbox"
                  className="size-4 mt-0.5 rounded border-[#E5E2DC] text-[#5D6B4D] focus:ring-[#5D6B4D]"
                  disabled={isSubmitting}
                  {...register("active")}
                />
                <div className="space-y-0.5">
                  <span className="text-xs font-semibold text-[#1A1A1A] block">
                    Active Listing
                  </span>
                  <p className="text-[11px] text-[#6B7280]">
                    Item is published and searchable across the customer storefront.
                  </p>
                </div>
              </label>

              {/* Featured Showcase Toggle Row */}
              <label className="flex items-start gap-3 p-3 rounded-lg border border-[#E5E2DC] bg-[#F8F6F2]/30 hover:bg-[#F8F6F2] cursor-pointer transition-colors">
                <input
                  type="checkbox"
                  className="size-4 mt-0.5 rounded border-[#E5E2DC] text-[#5D6B4D] focus:ring-[#5D6B4D]"
                  disabled={isSubmitting}
                  {...register("featured")}
                />
                <div className="space-y-0.5">
                  <span className="text-xs font-semibold text-[#1A1A1A] block">
                    Featured Showcase
                  </span>
                  <p className="text-[11px] text-[#6B7280]">
                    Elevate onto curated homepage showcases and collection spotlights.
                  </p>
                </div>
              </label>
            </div>

            {/* Publishing Controls */}
            <div className="border-t border-[#E5E2DC] pt-5 space-y-2.5">
              <Button
                type="submit"
                disabled={isSubmitting || isUploading}
                className="w-full h-11 rounded-lg bg-[#5D6B4D] hover:bg-[#4E5A40] text-white font-semibold text-xs tracking-wide shadow-xs flex items-center justify-center gap-2"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="size-4 animate-spin" />
                    <span>Saving to Database...</span>
                  </>
                ) : isEditing ? (
                  <>
                    <Check className="size-4" />
                    <span>Update Product</span>
                  </>
                ) : (
                  <>
                    <Check className="size-4" />
                    <span>Publish Product</span>
                  </>
                )}
              </Button>

              <Link href="/admin/products" className="block w-full">
                <Button
                  type="button"
                  variant="ghost"
                  disabled={isSubmitting}
                  className="w-full h-9 rounded-lg text-xs font-medium text-[#6B7280] hover:text-[#1A1A1A] hover:bg-[#F0EDE8]/50"
                >
                  Cancel
                </Button>
              </Link>
            </div>
          </div>

        </div>
      </div>
    </form>
  );
}
