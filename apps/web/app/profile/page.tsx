import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { StorefrontNav } from "@/components/storefront-nav";
import { SiteFooter } from "@/components/home/site-footer";
import { getUserOrders } from "@/features/orders/api";
import {
  ProfileView,
  type UserOrderRecord,
} from "@/features/profile/components/profile-view";

export const metadata: Metadata = {
  title: "My Account | UrbanNest",
  description: "Manage your handcrafted furniture orders, personal profile, and account preferences.",
  robots: {
    index: false,
    follow: false,
  },
};

export const dynamic = "force-dynamic";

interface ProfilePageProps {
  searchParams: Promise<{ redirectTo?: string }>;
}

export default async function ProfilePage(props: ProfilePageProps) {
  const searchParams = await props.searchParams;
  const redirectTo = searchParams?.redirectTo || null;

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    const target = redirectTo
      ? `/login?redirectTo=${encodeURIComponent(redirectTo)}`
      : "/login?redirectTo=/profile";
    redirect(target);
  }

  // Fetch full user record from profiles table
  const { data: profile } = await supabase
    .from("profiles")
    .select("full_name, email, role, avatar_url, created_at, updated_at")
    .eq("id", user.id)
    .single();

  // Fetch verified customer orders using normalized order service
  const userOrders = await getUserOrders(supabase, user.id);

  const totalOrders = userOrders.length;
  const completedOrders = userOrders.filter(
    (o) => o.status === "delivered"
  ).length;
  const inProgressOrders = userOrders.filter((o) =>
    ["pending", "processing", "shipped"].includes(o.status)
  ).length;

  const recentOrders = userOrders.slice(0, 4) as unknown as UserOrderRecord[];

  const normalizedProfile = {
    fullName: profile?.full_name || user.user_metadata?.full_name || "Valued Patron",
    email: profile?.email || user.email || "No email registered",
    role: profile?.role || "customer",
    avatarUrl: profile?.avatar_url || user.user_metadata?.avatar_url || null,
    createdAt: profile?.created_at || user.created_at,
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#F8F6F2]">
      <StorefrontNav />

      <main className="flex-1">
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
            inProgressOrders,
          }}
          recentOrders={recentOrders}
          redirectTo={redirectTo}
        />
      </main>

      <SiteFooter />
    </div>
  );
}
