import { createClient } from "@/lib/supabase/server";
import { StorefrontNavClient } from "./storefront-nav-client";

export async function StorefrontNav() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  let isAdmin = false;
  if (user) {
    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .single();
    isAdmin = profile?.role === "admin";
  }

  return <StorefrontNavClient user={Boolean(user)} isAdmin={isAdmin} />;
}

