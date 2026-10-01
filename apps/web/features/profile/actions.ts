"use server";
 
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

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

  let avatarUrl = data.avatarUrl?.trim() || null;
  if (avatarUrl) {
    if (avatarUrl.includes("<") && avatarUrl.includes(">")) {
      const match = avatarUrl.match(/(?:src|href)=["']([^"']+)["']/i);
      avatarUrl = match && match[1] ? match[1].trim() : null;
    }
    if (avatarUrl) {
      if (
        !avatarUrl.startsWith("http://") &&
        !avatarUrl.startsWith("https://") &&
        !avatarUrl.startsWith("/")
      ) {
        return {
          success: false,
          error: "Avatar URL must start with http://, https://, or /",
        };
      }
      try {
        if (avatarUrl.startsWith("http://") || avatarUrl.startsWith("https://")) {
          new URL(avatarUrl);
        }
      } catch {
        return {
          success: false,
          error: "Please enter a valid image URL.",
        };
      }
    }
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
