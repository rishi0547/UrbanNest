"use server";
 
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { isValidImageUrl, extractUrlIfHtml } from "./utils";

export type ProfileActionResult = {
  success: boolean;
  error?: string;
};

export async function updateProfileAction(data: {
  fullName: string;
  avatarUrl?: string;
}): Promise<ProfileActionResult> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { success: false, error: "Unauthorized. Please log in." };
  }

  const trimmedName = data.fullName?.trim();
  if (!trimmedName || trimmedName.length < 2) {
    return {
      success: false,
      error: "Please enter a valid full name (at least 2 characters).",
    };
  }

  const rawAvatar = extractUrlIfHtml(data.avatarUrl?.trim() || "");
  let avatarUrl: string | null = rawAvatar || null;

  if (avatarUrl && !isValidImageUrl(avatarUrl)) {
    return {
      success: false,
      error: "Please enter a valid image URL starting with http://, https://, or /",
    };
  }

  // Check if profile row exists
  const { data: existingProfile } = await supabase
    .from("profiles")
    .select("id")
    .eq("id", user.id)
    .single();

  if (!existingProfile) {
    const { error: insertError } = await supabase.from("profiles").insert({
      id: user.id,
      email: user.email!,
      full_name: trimmedName,
      avatar_url: avatarUrl,
      role: "customer",
      updated_at: new Date().toISOString(),
    });

    if (insertError) {
      return { success: false, error: insertError.message };
    }
  } else {
    const { error: updateError } = await supabase
      .from("profiles")
      .update({
        full_name: trimmedName,
        avatar_url: avatarUrl,
        updated_at: new Date().toISOString(),
      })
      .eq("id", user.id);

    if (updateError) {
      return { success: false, error: updateError.message };
    }
  }

  // Also sync user metadata in Supabase Auth
  await supabase.auth.updateUser({
    data: {
      full_name: trimmedName,
      avatar_url: avatarUrl,
    },
  });

  revalidatePath("/profile");
  revalidatePath("/", "layout");
  return { success: true };
}
