import type { Metadata } from "next";
import { Suspense } from "react";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { requireAuth } from "@/features/auth/roles";
import { getQueryClient } from "@/lib/query-client";
import { orderQueryKeys } from "@/features/orders/query-keys";
import { getUserOrders } from "@/features/orders/api";
import { StorefrontNav } from "@/components/storefront-nav";
import { UserOrdersView } from "@/features/orders/components/user-orders-view";

export const metadata: Metadata = {
  title: "My Orders | UrbanNest Design Studio",
  description: "Review your handcrafted furniture order history, receipt breakdowns, and live fulfillment statuses.",
};

export const dynamic = "force-dynamic";

export default async function OrdersPage() {
  await requireAuth();
  const queryClient = getQueryClient();

  // Prefetch customer orders for instant initial paint
  await queryClient.prefetchQuery({
    queryKey: orderQueryKeys.user(),
    queryFn: () => getUserOrders(),
  });

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <StorefrontNav />

      <main className="container mx-auto max-w-5xl flex-1 px-4 sm:px-6 py-10 space-y-8">
        <div className="space-y-1 border-b border-border/60 pb-5">
          <div className="inline-flex items-center rounded-full border border-primary/20 bg-primary/10 px-3 py-0.5 text-xs font-semibold text-primary">
            Customer Dashboard
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl text-foreground">
            Order History
          </h1>
          <p className="text-sm text-muted-foreground">
            Track fulfillment stages, view historical purchase receipts, and review delivery destinations.
          </p>
        </div>

        <HydrationBoundary state={dehydrate(queryClient)}>
          <Suspense fallback={<div className="h-44 rounded-2xl bg-muted/60 animate-pulse" />}>
            <UserOrdersView />
          </Suspense>
        </HydrationBoundary>
      </main>
    </div>
  );
}
