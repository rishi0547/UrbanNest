import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { LogoutButton } from "@/features/auth/components/logout-button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export const metadata: Metadata = {
  title: "My Account | UrbanNest",
  description: "Manage your UrbanNest account, view orders, and profile details",
};

export default async function ProfilePage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login?redirectTo=/profile");
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("full_name, email, role, created_at")
    .eq("id", user.id)
    .single();

  const fullName = profile?.full_name || user.user_metadata?.full_name || "Valued Customer";
  const email = profile?.email || user.email;
  const role = profile?.role || "customer";
  const memberSince = user.created_at
    ? new Date(user.created_at).toLocaleDateString("en-US", {
        month: "long",
        year: "numeric",
      })
    : "Recently joined";

  return (
    <main className="container mx-auto max-w-2xl px-4 py-12">
      <Card className="border-border bg-card/60 backdrop-blur-sm shadow-xl">
        <CardHeader className="space-y-1">
          <div className="flex items-center justify-between">
            <CardTitle className="text-2xl font-bold tracking-tight">
              Customer Profile
            </CardTitle>
            <span className="inline-flex items-center rounded-full border border-primary/30 bg-primary/10 px-2.5 py-0.5 text-xs font-semibold uppercase tracking-wider text-primary">
              {role}
            </span>
          </div>
          <CardDescription>
            Account credentials and order preferences for UrbanNest
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="rounded-lg border border-border/50 bg-background/50 p-4">
              <p className="text-xs font-medium text-muted-foreground">Full Name</p>
              <p className="mt-1 text-sm font-semibold text-foreground">{fullName}</p>
            </div>

            <div className="rounded-lg border border-border/50 bg-background/50 p-4">
              <p className="text-xs font-medium text-muted-foreground">Email Address</p>
              <p className="mt-1 text-sm font-semibold text-foreground">{email}</p>
            </div>

            <div className="rounded-lg border border-border/50 bg-background/50 p-4">
              <p className="text-xs font-medium text-muted-foreground">Member Since</p>
              <p className="mt-1 text-sm font-semibold text-foreground">{memberSince}</p>
            </div>

            <div className="rounded-lg border border-border/50 bg-background/50 p-4">
              <p className="text-xs font-medium text-muted-foreground">Security State</p>
              <p className="mt-1 text-sm font-semibold text-emerald-500">
                Verified Session
              </p>
            </div>
          </div>

          <div className="rounded-lg border border-border/50 bg-muted/20 p-4 text-xs text-muted-foreground space-y-1">
            <p className="font-medium text-foreground">User ID:</p>
            <p className="font-mono text-[11px] break-all">{user.id}</p>
          </div>
        </CardContent>

        <CardFooter className="flex justify-between border-t border-border/50 pt-6">
          <p className="text-xs text-muted-foreground">
            Signed in securely via Supabase Auth
          </p>
          <LogoutButton variant="outline" />
        </CardFooter>
      </Card>
    </main>
  );
}
