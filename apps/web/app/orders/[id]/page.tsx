import type { Metadata } from "next";
import { Suspense } from "react";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { requireAuth } from "@/features/auth/roles";
import { getQueryClient } from "@/lib/query-client";
import { orderQueryKeys } from "@/features/orders/query-keys";
import { getOrderById } from "@/features/orders/api";
import { createClient } from "@/lib/supabase/server";
import { StorefrontNav } from "@/components/storefront-nav";
import { OrderDetailsView } from "@/features/orders/components/order-details-view";

export const metadata: Metadata = {
  title: "Order Details",
  description: "View comprehensive delivery breakdown, purchased pieces, and receipt totals.",
  robots: {
    index: false,
    follow: false,
  },
};

export const dynamic = "force-dynamic";

interface OrderDetailPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function OrderDetailPage({ params }: OrderDetailPageProps) {
  await requireAuth();
  const { id } = await params;
  const supabase = await createClient();
  const queryClient = getQueryClient();

  // Prefetch order details on the server for instant SSR hydration
  await queryClient.prefetchQuery({
    queryKey: orderQueryKeys.detail(id),
    queryFn: () => getOrderById(id, supabase),
  });

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <StorefrontNav />

      <main className="container mx-auto max-w-5xl flex-1 px-4 sm:px-6 py-10 space-y-8">
        <HydrationBoundary state={dehydrate(queryClient)}>
          <Suspense
            fallback={
              <div className="space-y-6 animate-pulse">
                <div className="h-8 w-48 bg-muted rounded-md" />
                <div className="h-96 rounded-2xl bg-muted/60" />
              </div>
            }
          >
            <OrderDetailsView orderId={id} />
          </Suspense>
        </HydrationBoundary>
      </main>
    </div>
  );
}
