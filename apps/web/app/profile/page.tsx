import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { ProfileView } from "@/features/profile/components/profile-view";

export const metadata: Metadata = {
  title: "My Profile",
  description: "Manage your UrbanNest account, view orders, and edit your profile details.",
  robots: {
    index: false,
    follow: false,
  },
};

export const dynamic = "force-dynamic";

export default async function ProfilePage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login?redirectTo=/profile");
  }

  // Fetch full user record from profiles table
  const { data: profile } = await supabase
    .from("profiles")
    .select("full_name, email, role, avatar_url, created_at, updated_at")
    .eq("id", user.id)
    .single();

  // Fetch user orders summary
  const { data: userOrders } = await supabase
    .from("orders")
    .select("id, status")
    .eq("user_id", user.id);

  const totalOrders = userOrders ? userOrders.length : 0;
  const completedOrders = userOrders
    ? userOrders.filter(
        (o) => o.status === "delivered" || o.status === "completed"
      ).length
    : 0;

  const normalizedProfile = {
    fullName: profile?.full_name || user.user_metadata?.full_name || "Valued Patron",
    email: profile?.email || user.email || "No email registered",
    role: profile?.role || "customer",
    avatarUrl: profile?.avatar_url || user.user_metadata?.avatar_url || null,
    createdAt: profile?.created_at || user.created_at,
  };

  return (
    <ProfileView
      user={{
        id: user.id,
        email: user.email,
        createdAt: user.created_at,
      }}
      profile={normalizedProfile}
      ordersSummary={{
        totalOrders,
        completedOrders,
      }}
    />
  );
}
