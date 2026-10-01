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
  CheckCircle2,
  AlertTriangle,
  Layers,
  ArrowUpRight,
} from "lucide-react";
import { requireAdmin } from "@/features/auth/roles";
import { createClient } from "@/lib/supabase/server";
import { getAdminOrders } from "@/features/orders/api";
import { OrderStatusBadge } from "@/features/orders/components/order-status-badge";
import { LogoutButton } from "@/features/auth/components/logout-button";
import { Button } from "@/components/ui/button";
import { formatINR } from "@/utils/currency";

export const metadata: Metadata = {
  title: "Executive Overview | UrbanNest Admin",
  description: "Executive operations, inventory, and order fulfillment control system.",
};

export const dynamic = "force-dynamic";

export default async function AdminDashboardPage() {
  const { user, profile } = await requireAdmin("/admin");
  const supabase = await createClient();

  // Fetch verified catalog counts and orders using real Supabase queries
  const [
    { count: productCount },
    { count: activeCount },
    { count: lowStockCount },
    allOrders,
  ] = await Promise.all([
    supabase.from("products").select("*", { count: "exact", head: true }),
    supabase.from("products").select("id", { count: "exact", head: true }).eq("is_published", true),
    supabase.from("products").select("id", { count: "exact", head: true }).lte("stock", 5),
    getAdminOrders(supabase),
  ]);

  const totalProducts = productCount ?? 0;
  const activeProducts = activeCount ?? 0;
  const lowStockProducts = lowStockCount ?? 0;

  const totalOrders = allOrders.length;
  const pendingOrders = allOrders.filter((o) => o.status === "pending").length;
  const processingOrders = allOrders.filter((o) => o.status === "processing").length;
  const shippedOrders = allOrders.filter((o) => o.status === "shipped").length;
  const deliveredOrders = allOrders.filter((o) => o.status === "delivered").length;
  const cancelledOrders = allOrders.filter((o) => o.status === "cancelled").length;

  const grossRevenue = allOrders
    .filter((o) => o.status !== "cancelled")
    .reduce((sum, o) => sum + (o.total || o.total_amount || 0), 0);

  const recentOrders = allOrders.slice(0, 6);
  const formattedRevenue = formatINR(grossRevenue);

  const adminName = profile?.full_name || "Operations Lead";
  const adminEmail = profile?.email || user.email;

  // Pipeline proportions for visual operations overview
  const activeOrderCount = totalOrders - cancelledOrders;
  const pendingPercent = activeOrderCount > 0 ? Math.round((pendingOrders / activeOrderCount) * 100) : 0;
  const processingPercent = activeOrderCount > 0 ? Math.round((processingOrders / activeOrderCount) * 100) : 0;
  const shippedPercent = activeOrderCount > 0 ? Math.round((shippedOrders / activeOrderCount) * 100) : 0;
  const deliveredPercent = activeOrderCount > 0 ? Math.round((deliveredOrders / activeOrderCount) * 100) : 0;

  return (
    <div className="py-8 sm:py-10">
      <div className="mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Page Header */}
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-4 border-b border-[#E5E2DC] pb-6">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2 text-xs text-[#6B7280]">
              <span className="font-semibold text-[#5D6B4D]">UrbanNest</span>
              <ChevronRight className="size-3 text-[#A3A3A3]" />
              <span className="text-[#1A1A1A] font-medium">Executive Overview</span>
            </div>
            <h1 className="font-heading text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-[#1A1A1A]">
              Executive Overview
            </h1>
            <p className="text-xs sm:text-sm text-[#6B7280]">
              Monitor your UrbanNest catalog, customer orders, inventory and revenue.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <Link href="/">
              <Button
                variant="outline"
                size="sm"
                className="rounded-lg border-[#E5E2DC] bg-white text-[#1A1A1A] hover:bg-[#F0EDE8]/60 text-xs font-semibold flex items-center gap-1.5 shadow-2xs h-9"
              >
                <Store className="size-3.5 text-[#5D6B4D]" />
                <span>View Store</span>
              </Button>
            </Link>
            <Link href="/profile">
              <Button
                variant="outline"
                size="sm"
                className="rounded-lg border-[#E5E2DC] bg-white text-[#1A1A1A] hover:bg-[#F0EDE8]/60 text-xs font-semibold shadow-2xs h-9"
              >
                <span>My Account</span>
              </Button>
            </Link>
            <LogoutButton
              variant="outline"
              className="rounded-lg border-[#E5E2DC] bg-white text-xs font-semibold h-9 shadow-2xs hover:bg-rose-50 hover:text-rose-700"
            />
          </div>
        </div>

        {/* Real KPI Metrics Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {/* KPI 1: Total Products */}
          <div className="rounded-xl border border-[#E5E2DC] bg-white p-5 shadow-2xs hover:border-[#5D6B4D]/40 transition-all flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#6B7280]">
                Total Products
              </span>
              <div className="flex size-8 items-center justify-center rounded-lg bg-[#5D6B4D]/10 text-[#5D6B4D]">
                <Package className="size-4" />
              </div>
            </div>
            <div className="mt-4">
              <div className="font-heading text-2xl sm:text-3xl font-bold tracking-tight text-[#1A1A1A]">
                {totalProducts}
              </div>
              <p className="text-[11px] text-[#6B7280] mt-1 font-medium">Live catalog items</p>
            </div>
          </div>

          {/* KPI 2: Active Catalog */}
          <div className="rounded-xl border border-[#E5E2DC] bg-white p-5 shadow-2xs hover:border-[#5D6B4D]/40 transition-all flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#6B7280]">
                Active Catalog
              </span>
              <div className="flex size-8 items-center justify-center rounded-lg bg-emerald-50 text-emerald-700">
                <CheckCircle2 className="size-4" />
              </div>
            </div>
            <div className="mt-4">
              <div className="font-heading text-2xl sm:text-3xl font-bold tracking-tight text-[#1A1A1A]">
                {activeProducts}
              </div>
              <p className="text-[11px] text-emerald-700 mt-1 font-medium">Published &amp; browsable</p>
            </div>
          </div>

          {/* KPI 3: Total Orders */}
          <div className="rounded-xl border border-[#E5E2DC] bg-white p-5 shadow-2xs hover:border-[#5D6B4D]/40 transition-all flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#6B7280]">
                Total Orders
              </span>
              <div className="flex size-8 items-center justify-center rounded-lg bg-blue-50 text-blue-700">
                <ShoppingBag className="size-4" />
              </div>
            </div>
            <div className="mt-4">
              <div className="font-heading text-2xl sm:text-3xl font-bold tracking-tight text-[#1A1A1A]">
                {totalOrders}
              </div>
              <p className="text-[11px] text-[#6B7280] mt-1 font-medium">Lifetime transactions</p>
            </div>
          </div>

          {/* KPI 4: Pending Orders */}
          <div className="rounded-xl border border-[#E5E2DC] bg-white p-5 shadow-2xs hover:border-[#5D6B4D]/40 transition-all flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#6B7280]">
                Pending Orders
              </span>
              <div className="flex size-8 items-center justify-center rounded-lg bg-amber-50 text-amber-700">
                <Clock className="size-4" />
              </div>
            </div>
            <div className="mt-4">
              <div className="font-heading text-2xl sm:text-3xl font-bold tracking-tight text-amber-700">
                {pendingOrders}
              </div>
              <p className="text-[11px] text-[#6B7280] mt-1 font-medium">
                {pendingOrders === 0 ? "All orders cleared" : "Awaiting fulfillment"}
              </p>
            </div>
          </div>

          {/* KPI 5: Gross Revenue */}
          <div className="rounded-xl border border-[#E5E2DC] bg-white p-5 shadow-2xs hover:border-[#5D6B4D]/40 transition-all flex flex-col justify-between sm:col-span-2 lg:col-span-1">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#6B7280]">
                Gross Revenue
              </span>
              <div className="flex size-8 items-center justify-center rounded-lg bg-emerald-50 text-emerald-700">
                <IndianRupee className="size-4" />
              </div>
            </div>
            <div className="mt-4">
              <div className="font-heading text-xl sm:text-2xl font-bold tracking-tight text-[#1A1A1A] truncate">
                {formattedRevenue}
              </div>
              <p className="text-[11px] text-emerald-700 mt-1 font-medium">From processed sales</p>
            </div>
          </div>
        </div>

        {/* Order Status Pipeline / Operations Overview */}
        <div className="rounded-xl border border-[#E5E2DC] bg-white p-6 shadow-2xs space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 border-b border-[#E5E2DC] pb-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-bold uppercase tracking-widest text-[#5D6B4D]">
                  Operations Pipeline
                </span>
                <span className="size-1.5 rounded-full bg-[#5D6B4D]" />
                <span className="text-xs text-[#6B7280]">{totalOrders} Total Orders</span>
              </div>
              <h2 className="font-heading text-lg font-bold text-[#1A1A1A] mt-0.5">
                Order Pipeline &amp; Fulfillment State
              </h2>
            </div>
            <Link
              href="/admin/orders"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#5D6B4D] hover:text-[#4E5A40] transition-colors"
            >
              <span>Manage Pipeline</span>
              <ArrowRight className="size-3.5" />
            </Link>
          </div>

          {/* Proportional Distribution Bar */}
          {activeOrderCount > 0 && (
            <div className="space-y-2">
              <div className="flex h-2 w-full overflow-hidden rounded-full bg-[#F0EDE8]">
                {pendingPercent > 0 && (
                  <div
                    style={{ width: `${pendingPercent}%` }}
                    className="bg-amber-400 transition-all duration-500"
                    title={`Pending: ${pendingOrders} (${pendingPercent}%)`}
                  />
                )}
                {processingPercent > 0 && (
                  <div
                    style={{ width: `${processingPercent}%` }}
                    className="bg-blue-400 transition-all duration-500"
                    title={`Processing: ${processingOrders} (${processingPercent}%)`}
                  />
                )}
                {shippedPercent > 0 && (
                  <div
                    style={{ width: `${shippedPercent}%` }}
                    className="bg-purple-400 transition-all duration-500"
                    title={`Shipped: ${shippedOrders} (${shippedPercent}%)`}
                  />
                )}
                {deliveredPercent > 0 && (
                  <div
                    style={{ width: `${deliveredPercent}%` }}
                    className="bg-emerald-500 transition-all duration-500"
                    title={`Delivered: ${deliveredOrders} (${deliveredPercent}%)`}
                  />
                )}
              </div>
            </div>
          )}

          {/* Restrained Status Breakdown Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
            {/* Pending */}
            <div className="rounded-lg border border-amber-200/80 bg-amber-50/50 p-3.5 transition-all">
              <div className="flex items-center justify-between text-xs font-medium text-amber-800">
                <span>Pending</span>
                <span className="size-2 rounded-full bg-amber-500" />
              </div>
              <div className="font-heading text-2xl font-bold text-amber-900 mt-2">
                {pendingOrders}
              </div>
              <div className="text-[10px] text-amber-700/80 mt-0.5">
                {pendingPercent}% of active
              </div>
            </div>

            {/* Processing */}
            <div className="rounded-lg border border-blue-200/80 bg-blue-50/50 p-3.5 transition-all">
              <div className="flex items-center justify-between text-xs font-medium text-blue-800">
                <span>Processing</span>
                <span className="size-2 rounded-full bg-blue-500" />
              </div>
              <div className="font-heading text-2xl font-bold text-blue-900 mt-2">
                {processingOrders}
              </div>
              <div className="text-[10px] text-blue-700/80 mt-0.5">
                {processingPercent}% of active
              </div>
            </div>

            {/* Shipped */}
            <div className="rounded-lg border border-purple-200/80 bg-purple-50/50 p-3.5 transition-all">
              <div className="flex items-center justify-between text-xs font-medium text-purple-800">
                <span>Shipped</span>
                <span className="size-2 rounded-full bg-purple-500" />
              </div>
              <div className="font-heading text-2xl font-bold text-purple-900 mt-2">
                {shippedOrders}
              </div>
              <div className="text-[10px] text-purple-700/80 mt-0.5">
                {shippedPercent}% of active
              </div>
            </div>

            {/* Delivered */}
            <div className="rounded-lg border border-emerald-200/80 bg-emerald-50/50 p-3.5 transition-all">
              <div className="flex items-center justify-between text-xs font-medium text-emerald-800">
                <span>Delivered</span>
                <span className="size-2 rounded-full bg-emerald-500" />
              </div>
              <div className="font-heading text-2xl font-bold text-emerald-900 mt-2">
                {deliveredOrders}
              </div>
              <div className="text-[10px] text-emerald-700/80 mt-0.5">
                {deliveredPercent}% of active
              </div>
            </div>

            {/* Cancelled */}
            <div className="rounded-lg border border-rose-200/80 bg-rose-50/50 p-3.5 transition-all col-span-2 sm:col-span-1">
              <div className="flex items-center justify-between text-xs font-medium text-rose-800">
                <span>Cancelled</span>
                <span className="size-2 rounded-full bg-rose-400" />
              </div>
              <div className="font-heading text-2xl font-bold text-rose-900 mt-2">
                {cancelledOrders}
              </div>
              <div className="text-[10px] text-rose-700/80 mt-0.5">
                Voided transactions
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions Shortcuts */}
        <div className="rounded-xl border border-[#E5E2DC] bg-white p-6 shadow-2xs space-y-4">
          <div>
            <span className="text-[11px] font-bold uppercase tracking-widest text-[#5D6B4D]">
              Workflow Shortcuts
            </span>
            <h2 className="font-heading text-lg font-bold text-[#1A1A1A] mt-0.5">
              Quick Operations
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-1">
            {/* Shortcut 1: Add Product */}
            <Link
              href="/admin/products/new"
              className="group flex items-center justify-between p-4 rounded-xl border border-[#E5E2DC] bg-[#F8F6F2]/60 hover:bg-[#5D6B4D] hover:border-[#5D6B4D] transition-all duration-200 shadow-2xs"
            >
              <div className="flex items-center gap-3.5">
                <div className="flex size-10 items-center justify-center rounded-lg bg-white border border-[#E5E2DC] group-hover:bg-white/20 group-hover:border-white/30 text-[#5D6B4D] group-hover:text-white transition-colors">
                  <PlusCircle className="size-5" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-[#1A1A1A] group-hover:text-white transition-colors">
                    Add Product
                  </h3>
                  <p className="text-xs text-[#6B7280] group-hover:text-white/80 transition-colors">
                    Publish a new catalog piece
                  </p>
                </div>
              </div>
              <ArrowRight className="size-4 text-[#A3A3A3] group-hover:text-white group-hover:translate-x-1 transition-all" />
            </Link>

            {/* Shortcut 2: Manage Products */}
            <Link
              href="/admin/products"
              className="group flex items-center justify-between p-4 rounded-xl border border-[#E5E2DC] bg-[#F8F6F2]/60 hover:bg-[#5D6B4D] hover:border-[#5D6B4D] transition-all duration-200 shadow-2xs"
            >
              <div className="flex items-center gap-3.5">
                <div className="flex size-10 items-center justify-center rounded-lg bg-white border border-[#E5E2DC] group-hover:bg-white/20 group-hover:border-white/30 text-[#5D6B4D] group-hover:text-white transition-colors">
                  <Boxes className="size-5" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-[#1A1A1A] group-hover:text-white transition-colors">
                    Manage Products
                  </h3>
                  <p className="text-xs text-[#6B7280] group-hover:text-white/80 transition-colors">
                    Edit pricing, imagery and stock
                  </p>
                </div>
              </div>
              <ArrowRight className="size-4 text-[#A3A3A3] group-hover:text-white group-hover:translate-x-1 transition-all" />
            </Link>

            {/* Shortcut 3: Manage Orders */}
            <Link
              href="/admin/orders"
              className="group flex items-center justify-between p-4 rounded-xl border border-[#E5E2DC] bg-[#F8F6F2]/60 hover:bg-[#5D6B4D] hover:border-[#5D6B4D] transition-all duration-200 shadow-2xs"
            >
              <div className="flex items-center gap-3.5">
                <div className="flex size-10 items-center justify-center rounded-lg bg-white border border-[#E5E2DC] group-hover:bg-white/20 group-hover:border-white/30 text-[#5D6B4D] group-hover:text-white transition-colors">
                  <Truck className="size-5" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-[#1A1A1A] group-hover:text-white transition-colors">
                    Manage Orders
                  </h3>
                  <p className="text-xs text-[#6B7280] group-hover:text-white/80 transition-colors">
                    Fulfill shipments and delivery
                  </p>
                </div>
              </div>
              <ArrowRight className="size-4 text-[#A3A3A3] group-hover:text-white group-hover:translate-x-1 transition-all" />
            </Link>
          </div>
        </div>

        {/* Recent Orders Section */}
        <div className="rounded-xl border border-[#E5E2DC] bg-white p-6 shadow-2xs space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 border-b border-[#E5E2DC] pb-4">
            <div>
              <span className="text-[11px] font-bold uppercase tracking-widest text-[#5D6B4D]">
                Operations Dispatch
              </span>
              <h2 className="font-heading text-lg font-bold text-[#1A1A1A] mt-0.5">
                Recent Orders
              </h2>
              <p className="text-xs text-[#6B7280]">
                The most recent purchase orders requiring fulfillment oversight
              </p>
            </div>
            <Link
              href="/admin/orders"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#5D6B4D] hover:text-[#4E5A40] transition-colors"
            >
              <span>View All Orders ({totalOrders})</span>
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
            <>
              {/* Desktop Table View */}
              <div className="hidden md:block overflow-x-auto">
                <table className="w-full text-left text-xs">
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
                  <tbody className="divide-y divide-[#E5E2DC]/60 font-medium">
                    {recentOrders.map((order) => {
                      const recipientName =
                        order.shipping_address?.full_name ||
                        order.profile?.full_name ||
                        order.profile?.email ||
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
                      const orderTotal = formatINR(Number(order.total || order.total_amount || 0));
                      const displayId = order.order_number || `#${order.id.slice(0, 8).toUpperCase()}`;

                      return (
                        <tr
                          key={order.id}
                          className="hover:bg-[#F8F6F2]/60 transition-colors group"
                        >
                          <td className="py-3.5 px-3 font-mono font-semibold text-[#1A1A1A]">
                            {displayId}
                          </td>
                          <td className="py-3.5 px-3 text-[#1A1A1A]">
                            <div>{recipientName}</div>
                            {order.shipping_address?.city && (
                              <div className="text-[10px] text-[#6B7280]">
                                {order.shipping_address.city}, {order.shipping_address.state}
                              </div>
                            )}
                          </td>
                          <td className="py-3.5 px-3 text-[#6B7280]">
                            {orderDate}
                          </td>
                          <td className="py-3.5 px-3">
                            <OrderStatusBadge status={order.status} />
                          </td>
                          <td className="py-3.5 px-3 text-right font-mono font-bold text-[#1A1A1A]">
                            {orderTotal}
                          </td>
                          <td className="py-3.5 px-3 text-right">
                            <Link
                              href={`/admin/orders/${order.id}`}
                              className="inline-flex items-center gap-1 text-xs font-semibold text-[#5D6B4D] hover:text-[#4E5A40] transition-colors"
                            >
                              <span>Inspect</span>
                              <ArrowRight className="size-3 group-hover:translate-x-0.5 transition-transform" />
                            </Link>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {/* Mobile Cards View */}
              <div className="md:hidden divide-y divide-[#E5E2DC]/60">
                {recentOrders.map((order) => {
                  const recipientName =
                    order.shipping_address?.full_name ||
                    order.profile?.full_name ||
                    order.profile?.email ||
                    "Client";
                  const orderDate = new Date(order.created_at).toLocaleDateString(
                    "en-IN",
                    {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    }
                  );
                  const orderTotal = formatINR(Number(order.total || order.total_amount || 0));
                  const displayId = order.order_number || `#${order.id.slice(0, 8).toUpperCase()}`;

                  return (
                    <div key={order.id} className="py-3.5 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="font-mono text-xs font-bold text-[#1A1A1A]">
                          {displayId}
                        </span>
                        <OrderStatusBadge status={order.status} />
                      </div>
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-[#1A1A1A] font-medium">{recipientName}</span>
                        <span className="font-mono font-bold text-[#1A1A1A]">{orderTotal}</span>
                      </div>
                      <div className="flex items-center justify-between text-[11px] text-[#6B7280] pt-1">
                        <span>{orderDate}</span>
                        <Link
                          href={`/admin/orders/${order.id}`}
                          className="inline-flex items-center gap-1 font-semibold text-[#5D6B4D]"
                        >
                          <span>Inspect</span>
                          <ArrowRight className="size-3" />
                        </Link>
                      </div>
                    </div>
                  );
                })}
              </div>
            </>
          )}
        </div>

      </div>
    </div>
  );
}
