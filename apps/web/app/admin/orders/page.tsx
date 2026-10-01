import type { Metadata } from "next";
import Link from "next/link";
import { ChevronRight, ArrowLeft } from "lucide-react";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { requireAdmin } from "@/features/auth/roles";
import { getQueryClient } from "@/lib/query-client";
import { orderQueryKeys } from "@/features/orders/query-keys";
import { getAdminOrders } from "@/features/orders/api";
import { createClient } from "@/lib/supabase/server";
import { AdminOrdersTable } from "@/features/orders/components/admin-orders-table";

export const metadata: Metadata = {
  title: "Order Fulfillment Pipeline | UrbanNest Admin",
  description: "Executive control panel for customer purchase orders, shipping lifecycles, and delivery statuses.",
  robots: {
    index: false,
    follow: false,
  },
};

export const dynamic = "force-dynamic";

export default async function AdminOrdersPage() {
  await requireAdmin("/admin/orders");
  const supabase = await createClient();
  const queryClient = getQueryClient();

  // Prefetch all orders for immediate hydration
  await queryClient.prefetchQuery({
    queryKey: orderQueryKeys.admin(),
    queryFn: () => getAdminOrders(supabase),
  });

  return (
    <div className="py-8 sm:py-10">
      <div className="mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Navigation Breadcrumb & Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-[#E5E2DC] pb-6">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2 text-xs text-[#6B7280]">
              <Link href="/admin" className="hover:text-[#1A1A1A] transition-colors">
                Admin Console
              </Link>
              <ChevronRight className="size-3 text-[#A3A3A3]" />
              <span className="text-[#1A1A1A] font-medium">Orders</span>
            </div>
            
            <div className="flex items-center gap-3">
              <h1 className="font-heading text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-[#1A1A1A]">
                Order Fulfillment
              </h1>
              <span className="rounded-full bg-[#5D6B4D]/10 text-[#5D6B4D] border border-[#5D6B4D]/20 px-2.5 py-0.5 text-xs font-bold uppercase tracking-wider font-mono">
                Logistics Pipeline
              </span>
            </div>
            <p className="text-xs sm:text-sm text-[#6B7280]">
              Monitor incoming customer purchase orders, track logistics state machines, and fulfill white-glove dispatches.
            </p>
          </div>

          <Link
            href="/admin"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#6B7280] hover:text-[#1A1A1A] transition-colors"
          >
            <ArrowLeft className="size-3.5" />
            <span>Back to Overview</span>
          </Link>
        </div>

        {/* Orders Table Container with Hydrated React Query Cache */}
        <HydrationBoundary state={dehydrate(queryClient)}>
          <AdminOrdersTable />
        </HydrationBoundary>

      </div>
    </div>
  );
}
