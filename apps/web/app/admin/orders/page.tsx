import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, PackageCheck } from "lucide-react";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { requireAdmin } from "@/features/auth/roles";
import { getQueryClient } from "@/lib/query-client";
import { orderQueryKeys } from "@/features/orders/query-keys";
import { getAdminOrders } from "@/features/orders/api";
import { AdminOrdersTable } from "@/features/orders/components/admin-orders-table";

export const metadata: Metadata = {
  title: "Order Fulfillment Pipeline | UrbanNest Admin",
  description: "Executive control panel for customer purchase orders, shipping lifecycles, and delivery statuses.",
};

export const dynamic = "force-dynamic";

export default async function AdminOrdersPage() {
  await requireAdmin();
  const queryClient = getQueryClient();

  // Prefetch all orders for immediate admin review
  await queryClient.prefetchQuery({
    queryKey: orderQueryKeys.admin(),
    queryFn: () => getAdminOrders(),
  });

  return (
    <main className="container mx-auto max-w-6xl px-4 py-8 space-y-6">
      {/* Navigation Breadcrumb */}
      <div className="space-y-1 border-b border-border/60 pb-5">
        <Link
          href="/admin"
          className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors mb-1"
        >
          <ArrowLeft className="size-3.5" />
          Back to Dashboard
        </Link>
        <div className="flex items-center gap-2.5">
          <h1 className="text-3xl font-extrabold tracking-tight text-foreground">
            Order Fulfillment Pipeline
          </h1>
          <span className="rounded-md border border-primary/30 bg-primary/10 px-2 py-0.5 text-xs font-bold uppercase tracking-wider text-primary">
            Operations
          </span>
        </div>
        <p className="text-sm text-muted-foreground">
          Monitor incoming customer orders, manage white-glove logistics, and advance the fulfillment state machine.
        </p>
      </div>

      <HydrationBoundary state={dehydrate(queryClient)}>
        <AdminOrdersTable />
      </HydrationBoundary>
    </main>
  );
}
