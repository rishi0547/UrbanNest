import type { Metadata } from "next";
import Link from "next/link";
import {
  Package,
  ShoppingBag,
  Clock,
  IndianRupee,
  PlusCircle,
  Boxes,
  Truck,
  ArrowRight,
  ExternalLink,
  ChevronRight,
  Store,
} from "lucide-react";
import { requireAdmin } from "@/features/auth/roles";
import { createClient } from "@/lib/supabase/server";
import { getAdminOrders } from "@/features/orders/api";
import { OrderStatusBadge } from "@/features/orders/components/order-status-badge";
import { LogoutButton } from "@/features/auth/components/logout-button";
import { Button } from "@/components/ui/button";
import { formatPrice } from "@/lib/currency";

export const metadata: Metadata = {
  title: "Admin Executive Dashboard | UrbanNest",
  description: "Executive control panel for UrbanNest catalog, logistics, and revenue.",
};

export const dynamic = "force-dynamic";

export default async function AdminDashboardPage() {
  const { user, profile } = await requireAdmin();
  const supabase = await createClient();

  // Fetch catalog count and normalized orders
  const [{ count: productCount }, allOrders] = await Promise.all([
    supabase.from("products").select("*", { count: "exact", head: true }),
    getAdminOrders(supabase),
  ]);

  const totalProducts = productCount ?? 0;
  const totalOrders = allOrders.length;
  const pendingOrders = allOrders.filter((o) => o.status === "pending").length;
  const revenue = allOrders
    .filter((o) => o.status !== "cancelled")
    .reduce((sum, o) => sum + (o.total || o.total_amount || 0), 0);

  const recentOrders = allOrders.slice(0, 5);

  const formattedRevenue = formatPrice(revenue);

  const adminName = profile?.full_name || "Operations Lead";
  const adminEmail = profile?.email || user.email;

  return (
    <div className="min-h-screen bg-[#F8F6F2] py-8 sm:py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Top Header Bar */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-[#E5E2DC] pb-6">
          <div className="space-y-1">
            <div className="flex items-center gap-2.5">
              <span className="rounded-full bg-[#5D6B4D] px-2.5 py-0.5 text-[11px] font-bold uppercase tracking-wider text-white">
                Admin Console
              </span>
              <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-xs text-[#6B7280]">
                <Link href="/" className="hover:text-[#1A1A1A] transition-colors">
                  Storefront
                </Link>
                <ChevronRight className="size-3 text-[#A3A3A3]" />
                <span className="font-semibold text-[#1A1A1A]">Dashboard</span>
              </nav>
            </div>
            <h1 className="font-heading text-2xl sm:text-3xl font-bold tracking-tight text-[#1A1A1A]">
              Executive Overview
            </h1>
            <p className="text-xs sm:text-sm text-[#6B7280]">
              Logged in as <strong className="text-[#1A1A1A] font-semibold">{adminName}</strong> ({adminEmail})
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <Link href="/">
              <Button
                variant="outline"
                size="sm"
                className="rounded-full border-[#E5E2DC] bg-white text-[#1A1A1A] hover:bg-[#F8F6F2] text-xs font-semibold flex items-center gap-1.5"
              >
                <Store className="size-3.5" />
                View Store
              </Button>
            </Link>
            <Link href="/profile">
              <Button
                variant="outline"
                size="sm"
                className="rounded-full border-[#E5E2DC] bg-white text-[#1A1A1A] hover:bg-[#F8F6F2] text-xs font-semibold"
              >
                My Account
              </Button>
            </Link>
            <LogoutButton variant="outline" className="rounded-full text-xs" />
          </div>
        </div>

        {/* Dashboard Metric Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {/* Card 1: Total Products */}
          <div className="rounded-2xl border border-[#E5E2DC] bg-white p-6 shadow-xs flex flex-col justify-between hover:border-[#5D6B4D]/40 transition-all">
            <div className="flex items-center justify-between">
              <span className="text-xs uppercase tracking-wider font-semibold text-[#6B7280]">
                Total Products
              </span>
              <div className="flex size-10 items-center justify-center rounded-xl bg-[#5D6B4D]/10 text-[#5D6B4D]">
                <Package className="size-5" />
              </div>
            </div>
            <div className="mt-4">
              <p className="font-heading text-3xl font-bold text-[#1A1A1A]">
                {totalProducts}
              </p>
              <p className="text-xs text-[#6B7280] mt-1">Live active catalog items</p>
            </div>
          </div>

          {/* Card 2: Total Orders */}
          <div className="rounded-2xl border border-[#E5E2DC] bg-white p-6 shadow-xs flex flex-col justify-between hover:border-[#5D6B4D]/40 transition-all">
            <div className="flex items-center justify-between">
              <span className="text-xs uppercase tracking-wider font-semibold text-[#6B7280]">
                Total Orders
              </span>
              <div className="flex size-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                <ShoppingBag className="size-5" />
              </div>
            </div>
            <div className="mt-4">
              <p className="font-heading text-3xl font-bold text-[#1A1A1A]">
                {totalOrders}
              </p>
              <p className="text-xs text-[#6B7280] mt-1">Lifetime customer transactions</p>
            </div>
          </div>

          {/* Card 3: Pending Orders */}
          <div className="rounded-2xl border border-[#E5E2DC] bg-white p-6 shadow-xs flex flex-col justify-between hover:border-[#5D6B4D]/40 transition-all">
            <div className="flex items-center justify-between">
              <span className="text-xs uppercase tracking-wider font-semibold text-[#6B7280]">
                Pending Orders
              </span>
              <div className="flex size-10 items-center justify-center rounded-xl bg-amber-50 text-amber-600">
                <Clock className="size-5" />
              </div>
            </div>
            <div className="mt-4">
              <p className="font-heading text-3xl font-bold text-amber-600">
                {pendingOrders}
              </p>
              <p className="text-xs text-[#6B7280] mt-1">
                {pendingOrders === 0
                  ? "All shipments cleared"
                  : "Awaiting fulfillment & dispatch"}
              </p>
            </div>
          </div>

          {/* Card 4: Revenue */}
          <div className="rounded-2xl border border-[#E5E2DC] bg-white p-6 shadow-xs flex flex-col justify-between hover:border-[#5D6B4D]/40 transition-all">
            <div className="flex items-center justify-between">
              <span className="text-xs uppercase tracking-wider font-semibold text-[#6B7280]">
                Gross Revenue
              </span>
              <div className="flex size-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
                <IndianRupee className="size-5" />
              </div>
            </div>
            <div className="mt-4">
              <p className="font-heading text-3xl font-bold text-[#1A1A1A]">
                {formattedRevenue}
              </p>
              <p className="text-xs text-emerald-600 font-medium mt-1">From processed sales</p>
            </div>
          </div>
        </div>

        {/* Quick Actions Bar */}
        <div className="rounded-2xl border border-[#E5E2DC] bg-white p-6 sm:p-8 shadow-xs space-y-4">
          <div>
            <h2 className="font-heading text-lg font-bold text-[#1A1A1A]">
              Quick Actions
            </h2>
            <p className="text-xs text-[#6B7280] mt-0.5">
              Direct access to critical administrative tasks and catalog operations
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-1">
            {/* Action 1: Add Product */}
            <Link
              href="/admin/products/new"
              className="group flex items-center justify-between p-4 rounded-xl border border-[#E5E2DC] bg-[#F8F6F2]/40 hover:bg-[#5D6B4D] hover:border-[#5D6B4D] transition-all"
            >
              <div className="flex items-center gap-3">
                <div className="flex size-10 items-center justify-center rounded-lg bg-white border border-[#E5E2DC] group-hover:bg-white/20 group-hover:border-white/30 text-[#5D6B4D] group-hover:text-white transition-colors">
                  <PlusCircle className="size-5" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-[#1A1A1A] group-hover:text-white transition-colors">
                    Add Product
                  </h3>
                  <p className="text-xs text-[#6B7280] group-hover:text-white/80 transition-colors">
                    Publish new catalog piece
                  </p>
                </div>
              </div>
              <ArrowRight className="size-4 text-[#A3A3A3] group-hover:text-white group-hover:translate-x-1 transition-all" />
            </Link>

            {/* Action 2: Manage Products */}
            <Link
              href="/admin/products"
              className="group flex items-center justify-between p-4 rounded-xl border border-[#E5E2DC] bg-[#F8F6F2]/40 hover:bg-[#5D6B4D] hover:border-[#5D6B4D] transition-all"
            >
              <div className="flex items-center gap-3">
                <div className="flex size-10 items-center justify-center rounded-lg bg-white border border-[#E5E2DC] group-hover:bg-white/20 group-hover:border-white/30 text-[#5D6B4D] group-hover:text-white transition-colors">
                  <Boxes className="size-5" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-[#1A1A1A] group-hover:text-white transition-colors">
                    Manage Products
                  </h3>
                  <p className="text-xs text-[#6B7280] group-hover:text-white/80 transition-colors">
                    Edit pricing, images & stock
                  </p>
                </div>
              </div>
              <ArrowRight className="size-4 text-[#A3A3A3] group-hover:text-white group-hover:translate-x-1 transition-all" />
            </Link>

            {/* Action 3: Manage Orders */}
            <Link
              href="/admin/orders"
              className="group flex items-center justify-between p-4 rounded-xl border border-[#E5E2DC] bg-[#F8F6F2]/40 hover:bg-[#5D6B4D] hover:border-[#5D6B4D] transition-all"
            >
              <div className="flex items-center gap-3">
                <div className="flex size-10 items-center justify-center rounded-lg bg-white border border-[#E5E2DC] group-hover:bg-white/20 group-hover:border-white/30 text-[#5D6B4D] group-hover:text-white transition-colors">
                  <Truck className="size-5" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-[#1A1A1A] group-hover:text-white transition-colors">
                    Manage Orders
                  </h3>
                  <p className="text-xs text-[#6B7280] group-hover:text-white/80 transition-colors">
                    Fulfill shipments & delivery
                  </p>
                </div>
              </div>
              <ArrowRight className="size-4 text-[#A3A3A3] group-hover:text-white group-hover:translate-x-1 transition-all" />
            </Link>
          </div>
        </div>

        {/* Recent Orders Table */}
        <div className="rounded-2xl border border-[#E5E2DC] bg-white p-6 sm:p-8 shadow-xs space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 border-b border-[#E5E2DC] pb-4">
            <div>
              <h2 className="font-heading text-lg font-bold text-[#1A1A1A]">
                Recent Orders
              </h2>
              <p className="text-xs text-[#6B7280] mt-0.5">
                The most recent purchase orders requiring fulfillment oversight
              </p>
            </div>
            <Link
              href="/admin/orders"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#5D6B4D] hover:text-[#4E5A40] transition-colors"
            >
              <span>View All Orders</span>
              <ArrowRight className="size-3.5" />
            </Link>
          </div>

          {recentOrders.length === 0 ? (
            <div className="py-12 text-center space-y-2">
              <ShoppingBag className="size-10 text-[#A3A3A3] mx-auto" />
              <p className="text-sm font-semibold text-[#1A1A1A]">
                No orders recorded yet
              </p>
              <p className="text-xs text-[#6B7280]">
                Customer checkout orders will appear here automatically.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[620px] text-left text-xs sm:text-sm">
                <thead>
                  <tr className="border-b border-[#E5E2DC] text-[11px] uppercase tracking-wider text-[#6B7280] font-semibold">
                    <th className="py-3 px-3">Order ID</th>
                    <th className="py-3 px-3">Customer / Recipient</th>
                    <th className="py-3 px-3">Date</th>
                    <th className="py-3 px-3">Status</th>
                    <th className="py-3 px-3 text-right">Total</th>
                    <th className="py-3 px-3 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E5E2DC]/60">
                  {recentOrders.map((order) => {
                    const recipientName =
                      order.shipping_address?.full_name ||
                      order.user_id?.slice(0, 8) + "..." ||
                      "Client";
                    const orderDate = new Date(order.created_at).toLocaleDateString(
                      "en-IN",
                      {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      }
                    );
                    const orderTotal = formatPrice(order.total || order.total_amount || 0);

                    return (
                      <tr
                        key={order.id}
                        className="hover:bg-[#F8F6F2]/60 transition-colors"
                      >
                        <td className="py-3 px-3 font-mono font-medium text-[#1A1A1A]">
                          #{order.id.slice(0, 8).toUpperCase()}
                        </td>
                        <td className="py-3 px-3 font-medium text-[#1A1A1A]">
                          {recipientName}
                        </td>
                        <td className="py-3 px-3 text-[#6B7280]">
                          {orderDate}
                        </td>
                        <td className="py-3 px-3">
                          <OrderStatusBadge status={order.status} />
                        </td>
                        <td className="py-3 px-3 text-right font-semibold text-[#1A1A1A]">
                          {orderTotal}
                        </td>
                        <td className="py-3 px-3 text-right">
                          <Link
                            href="/admin/orders"
                            className="inline-flex items-center gap-1 text-xs font-semibold text-[#5D6B4D] hover:text-[#4E5A40] transition-colors"
                          >
                            <span>Inspect</span>
                            <ExternalLink className="size-3" />
                          </Link>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
