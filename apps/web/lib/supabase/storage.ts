import { createClient } from "./client";

export const PRODUCT_IMAGES_BUCKET = "product-images";

export interface UploadResult {
  url?: string;
  error?: string;
}

/**
 * Uploads an image file to the Supabase Storage 'product-images' bucket
 * and returns the public CDN URL.
 */
export async function uploadProductImage(file: File): Promise<UploadResult> {
  try {
    const supabase = createClient();

    // Verify file is an image
    if (!file.type.startsWith("image/")) {
      return { error: "File must be an image (JPEG, PNG, WebP)" };
    }

    // Limit size to 5MB
    if (file.size > 5 * 1024 * 1024) {
      return { error: "Image file size must be under 5MB" };
    }

    const fileExt = file.name.split(".").pop() || "jpg";
    const sanitizedBase = file.name
      .replace(/\.[^/.]+$/, "")
      .toLowerCase()
      .replace(/[^a-z0-9]/g, "-");
    const filePath = `catalog/${Date.now()}-${sanitizedBase}.${fileExt}`;

    const { error: uploadError } = await supabase.storage
      .from(PRODUCT_IMAGES_BUCKET)
      .upload(filePath, file, {
        cacheControl: "3600",
        upsert: false,
      });

    if (uploadError) {
      return { error: uploadError.message };
    }

    const {
      data: { publicUrl },
    } = supabase.storage.from(PRODUCT_IMAGES_BUCKET).getPublicUrl(filePath);

    return { url: publicUrl };
  } catch (err) {
    return {
      error: err instanceof Error ? err.message : "Failed to upload image",
    };
  }
}
