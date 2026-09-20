import type { Metadata } from "next";
import Link from "next/link";
import { requireAdmin } from "@/features/auth/roles";
import { createClient } from "@/lib/supabase/server";
import { LogoutButton } from "@/features/auth/components/logout-button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Admin Dashboard | UrbanNest",
  description: "Executive control panel for product catalog, categories, and orders",
};

export default async function AdminDashboardPage() {
  const { user, profile } = await requireAdmin();
  const supabase = await createClient();

  const [
    { count: productCount },
    { count: categoryCount },
    { count: pendingOrdersCount },
  ] = await Promise.all([
    supabase.from("products").select("*", { count: "exact", head: true }),
    supabase.from("categories").select("*", { count: "exact", head: true }),
    supabase
      .from("orders")
      .select("*", { count: "exact", head: true })
      .eq("status", "pending"),
  ]);

  const adminName = profile?.full_name || "System Administrator";
  const adminEmail = profile?.email || user.email;

  return (
    <main className="container mx-auto max-w-6xl px-4 py-10 space-y-8">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-border/60 pb-6">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-3xl font-extrabold tracking-tight text-foreground">
              Admin Operations Center
            </h1>
            <span className="rounded-md border border-destructive/40 bg-destructive/10 px-2 py-0.5 text-xs font-bold uppercase tracking-wider text-destructive">
              Restricted Area
            </span>
          </div>
          <p className="mt-1 text-sm text-muted-foreground">
            Authenticated as <strong className="text-foreground">{adminName}</strong> ({adminEmail})
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link href="/profile">
            <Button variant="ghost" size="sm">
              My Profile
            </Button>
          </Link>
          <LogoutButton variant="outline" />
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="border-border bg-card/40 backdrop-blur-xs">
          <CardHeader className="pb-2">
            <CardDescription className="text-xs uppercase font-medium tracking-wider">
              Catalog Items
            </CardDescription>
            <CardTitle className="text-2xl font-bold">{productCount ?? 0} Total</CardTitle>
          </CardHeader>
          <CardContent className="text-xs text-muted-foreground">
            Inventory in database
          </CardContent>
        </Card>

        <Card className="border-border bg-card/40 backdrop-blur-xs">
          <CardHeader className="pb-2">
            <CardDescription className="text-xs uppercase font-medium tracking-wider">
              Taxonomies
            </CardDescription>
            <CardTitle className="text-2xl font-bold">{categoryCount ?? 0} Categories</CardTitle>
          </CardHeader>
          <CardContent className="text-xs text-muted-foreground">
            Living, Bed, Dining, Office
          </CardContent>
        </Card>

        <Card className="border-border bg-card/40 backdrop-blur-xs">
          <CardHeader className="pb-2">
            <CardDescription className="text-xs uppercase font-medium tracking-wider">
              Orders Queue
            </CardDescription>
            <CardTitle className="text-2xl font-bold">{pendingOrdersCount ?? 0} Pending</CardTitle>
          </CardHeader>
          <CardContent className="text-xs text-emerald-500 font-medium">
            {(pendingOrdersCount ?? 0) === 0 ? "All shipments processed" : "Action required in pipeline"}
          </CardContent>
        </Card>

        <Card className="border-border bg-card/40 backdrop-blur-xs">
          <CardHeader className="pb-2">
            <CardDescription className="text-xs uppercase font-medium tracking-wider">
              Authorization Tier
            </CardDescription>
            <CardTitle className="text-2xl font-bold text-primary">Admin</CardTitle>
          </CardHeader>
          <CardContent className="text-xs text-muted-foreground">
            Full read/write privileges
          </CardContent>
        </Card>
      </div>

      {/* Quick Action Navigation Panels */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2">
        <Card className="border-border hover:border-primary/50 transition-colors">
          <CardHeader>
            <CardTitle className="text-lg">Product Management</CardTitle>
            <CardDescription>
              Create, update, modify pricing, upload images, and control inventory counts.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="text-xs text-muted-foreground">
              Module: <code className="font-mono">features/products</code>
            </div>
            <Link href="/admin/products" className="block">
              <Button className="w-full font-semibold">
                Open Product Manager
              </Button>
            </Link>
          </CardContent>
        </Card>

        <Card className="border-border hover:border-primary/50 transition-colors">
          <CardHeader>
            <CardTitle className="text-lg">Category Taxonomy</CardTitle>
            <CardDescription>
              Add new furniture collections, update slugs, and configure collection hero banners.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="text-xs text-muted-foreground">
              Module: <code className="font-mono">features/admin/categories</code>
            </div>
            <Button className="w-full" variant="outline" disabled>
              Open Category Manager (Next Step)
            </Button>
          </CardContent>
        </Card>

        <Card className="border-border hover:border-primary/50 transition-colors">
          <CardHeader>
            <CardTitle className="text-lg">Order Fulfillment</CardTitle>
            <CardDescription>
              Review customer orders, transition order statuses, and inspect shipping addresses.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="text-xs text-muted-foreground">
              Module: <code className="font-mono">features/orders</code>
            </div>
            <Link href="/admin/orders" className="block">
              <Button className="w-full font-semibold" variant="outline">
                Open Order Pipeline
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
