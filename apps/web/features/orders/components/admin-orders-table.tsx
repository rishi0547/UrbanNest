"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import {
  Search,
  Loader2,
  Package,
  ArrowRight,
  ExternalLink,
  Clock,
  CheckCircle2,
  Truck,
  RotateCw,
  X,
  User,
  ShoppingBag,
} from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";
import { useAdminOrders } from "../queries";
import { orderQueryKeys } from "../query-keys";
import { updateOrderStatusAction } from "../actions";
import { OrderStatusBadge } from "./order-status-badge";
import type { OrderStatus } from "../types";
import { formatINR } from "@/utils/currency";

export function AdminOrdersTable() {
  const queryClient = useQueryClient();
  const { data: orders, isLoading, isError } = useAdminOrders();
  const [selectedStatus, setSelectedStatus] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [updatingOrderId, setUpdatingOrderId] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const handleStatusChange = (orderId: string, newStatus: OrderStatus) => {
    setUpdatingOrderId(orderId);
    startTransition(async () => {
      const result = await updateOrderStatusAction(orderId, newStatus);
      if (result.success) {
        await queryClient.invalidateQueries({ queryKey: orderQueryKeys.all });
      }
      setUpdatingOrderId(null);
    });
  };

  const allOrders = orders || [];

  // Real counts for status breakdown
  const pendingCount = allOrders.filter((o) => o.status === "pending").length;
  const processingCount = allOrders.filter((o) => o.status === "processing").length;
  const shippedCount = allOrders.filter((o) => o.status === "shipped").length;
  const deliveredCount = allOrders.filter((o) => o.status === "delivered").length;
  const cancelledCount = allOrders.filter((o) => o.status === "cancelled").length;

  const filteredOrders = allOrders.filter((order) => {
    const matchesStatus =
      selectedStatus === "all" || order.status === selectedStatus;

    const query = searchQuery.toLowerCase().trim();
    const matchesSearch =
      !query ||
      order.order_number?.toLowerCase().includes(query) ||
      order.id.toLowerCase().includes(query) ||
      order.profile?.email?.toLowerCase().includes(query) ||
      order.shipping_address?.full_name?.toLowerCase().includes(query) ||
      order.shipping_address?.city?.toLowerCase().includes(query);

    return matchesStatus && Boolean(matchesSearch);
  });

  const statuses: { label: string; value: string; count: number }[] = [
    { label: "All Orders", value: "all", count: allOrders.length },
    { label: "Pending", value: "pending", count: pendingCount },
    { label: "Processing", value: "processing", count: processingCount },
    { label: "Shipped", value: "shipped", count: shippedCount },
    { label: "Delivered", value: "delivered", count: deliveredCount },
    { label: "Cancelled", value: "cancelled", count: cancelledCount },
  ];

  return (
    <div className="space-y-6">
      {/* Top Operations Summary Metrics */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
        {/* Total */}
        <div
          onClick={() => setSelectedStatus("all")}
          className={`rounded-xl border p-4 cursor-pointer transition-all ${
            selectedStatus === "all"
              ? "border-[#5D6B4D] bg-white shadow-2xs ring-1 ring-[#5D6B4D]"
              : "border-[#E5E2DC] bg-white hover:border-[#5D6B4D]/40"
          }`}
        >
          <div className="text-[11px] font-bold uppercase tracking-wider text-[#6B7280]">
            Total Inflow
          </div>
          <div className="font-heading text-2xl font-bold text-[#1A1A1A] mt-1">
            {allOrders.length}
          </div>
          <div className="text-[10px] text-[#6B7280] mt-0.5">All customer orders</div>
        </div>

        {/* Pending */}
        <div
          onClick={() => setSelectedStatus("pending")}
          className={`rounded-xl border p-4 cursor-pointer transition-all ${
            selectedStatus === "pending"
              ? "border-amber-400 bg-amber-50/80 shadow-2xs ring-1 ring-amber-400"
              : "border-[#E5E2DC] bg-white hover:border-amber-300"
          }`}
        >
          <div className="text-[11px] font-bold uppercase tracking-wider text-amber-800">
            Pending
          </div>
          <div className="font-heading text-2xl font-bold text-amber-900 mt-1">
            {pendingCount}
          </div>
          <div className="text-[10px] text-amber-700/80 mt-0.5">Awaiting review</div>
        </div>

        {/* Processing */}
        <div
          onClick={() => setSelectedStatus("processing")}
          className={`rounded-xl border p-4 cursor-pointer transition-all ${
            selectedStatus === "processing"
              ? "border-blue-400 bg-blue-50/80 shadow-2xs ring-1 ring-blue-400"
              : "border-[#E5E2DC] bg-white hover:border-blue-300"
          }`}
        >
          <div className="text-[11px] font-bold uppercase tracking-wider text-blue-800">
            Processing
          </div>
          <div className="font-heading text-2xl font-bold text-blue-900 mt-1">
            {processingCount}
          </div>
          <div className="text-[10px] text-blue-700/80 mt-0.5">Crating &amp; prep</div>
        </div>

        {/* Shipped */}
        <div
          onClick={() => setSelectedStatus("shipped")}
          className={`rounded-xl border p-4 cursor-pointer transition-all ${
            selectedStatus === "shipped"
              ? "border-purple-400 bg-purple-50/80 shadow-2xs ring-1 ring-purple-400"
              : "border-[#E5E2DC] bg-white hover:border-purple-300"
          }`}
        >
          <div className="text-[11px] font-bold uppercase tracking-wider text-purple-800">
            Shipped
          </div>
          <div className="font-heading text-2xl font-bold text-purple-900 mt-1">
            {shippedCount}
          </div>
          <div className="text-[10px] text-purple-700/80 mt-0.5">In transit dispatch</div>
        </div>

        {/* Delivered */}
        <div
          onClick={() => setSelectedStatus("delivered")}
          className={`rounded-xl border p-4 cursor-pointer transition-all col-span-2 sm:col-span-1 ${
            selectedStatus === "delivered"
              ? "border-emerald-400 bg-emerald-50/80 shadow-2xs ring-1 ring-emerald-400"
              : "border-[#E5E2DC] bg-white hover:border-emerald-300"
          }`}
        >
          <div className="text-[11px] font-bold uppercase tracking-wider text-emerald-800">
            Delivered
          </div>
          <div className="font-heading text-2xl font-bold text-emerald-900 mt-1">
            {deliveredCount}
          </div>
          <div className="text-[10px] text-emerald-700/80 mt-0.5">Completed handoff</div>
        </div>
      </div>

      {/* Search & Filter Toolbar */}
      <div className="rounded-xl border border-[#E5E2DC] bg-white p-4 sm:p-5 shadow-2xs space-y-3.5">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          {/* Search Input */}
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-[#A3A3A3]" />
            <input
              type="text"
              placeholder="Search orders by order #, email, recipient name, or city..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full h-10 pl-10 pr-4 rounded-lg border border-[#E5E2DC] bg-[#F8F6F2]/40 text-xs sm:text-sm text-[#1A1A1A] placeholder:text-[#A3A3A3] focus:outline-none focus:border-[#5D6B4D] focus:bg-white transition-colors"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#A3A3A3] hover:text-[#1A1A1A]"
              >
                <X className="size-4" />
              </button>
            )}
          </div>
        </div>

        {/* Status Filter Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none pt-1 border-t border-[#E5E2DC]/60">
          {statuses.map((tab) => {
            const isCurrent = selectedStatus === tab.value;
            return (
              <button
                key={tab.value}
                type="button"
                onClick={() => setSelectedStatus(tab.value)}
                className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                  isCurrent
                    ? "bg-[#5D6B4D] text-white shadow-2xs"
                    : "bg-[#F0EDE8]/70 text-[#6B7280] hover:text-[#1A1A1A] hover:bg-[#F0EDE8]"
                }`}
              >
                <span>{tab.label}</span>
                <span
                  className={`rounded-full px-1.5 py-0.2 text-[10px] font-mono ${
                    isCurrent ? "bg-white/20 text-white" : "bg-[#E5E2DC] text-[#1A1A1A]"
                  }`}
                >
                  {tab.count}
                </span>
              </button>
            );
          })}

          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery("")}
              className="inline-flex items-center gap-1 text-xs font-semibold text-[#5D6B4D] hover:text-[#4E5A40] ml-auto py-1 px-2"
            >
              <X className="size-3" />
              <span>Clear Search</span>
            </button>
          )}
        </div>
      </div>

      {/* Orders Table & Cards */}
      {isLoading ? (
        <div className="space-y-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-16 rounded-xl bg-white border border-[#E5E2DC] animate-pulse" />
          ))}
        </div>
      ) : filteredOrders.length === 0 ? (
        <div className="rounded-xl border border-dashed border-[#E5E2DC] bg-white py-16 px-4 text-center max-w-md mx-auto space-y-3">
          <div className="mx-auto size-12 rounded-full bg-[#F0EDE8] flex items-center justify-center text-[#6B7280]">
            <Package className="size-6" />
          </div>
          <h3 className="font-heading text-lg font-bold text-[#1A1A1A]">
            No matching purchase orders
          </h3>
          <p className="text-xs text-[#6B7280]">
            No customer orders match the current status filter or search parameters.
          </p>
          {(selectedStatus !== "all" || searchQuery) && (
            <button
              type="button"
              onClick={() => {
                setSelectedStatus("all");
                setSearchQuery("");
              }}
              className="inline-flex items-center gap-1.5 rounded-lg border border-[#E5E2DC] bg-white px-3 py-1.5 text-xs font-semibold text-[#1A1A1A] hover:bg-[#F0EDE8]"
            >
              Reset Filters
            </button>
          )}
        </div>
      ) : (
        <div className="rounded-xl border border-[#E5E2DC] bg-white shadow-2xs overflow-hidden">
          {/* Desktop Operations Table */}
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#F8F6F2]/80 text-[11px] font-semibold text-[#6B7280] uppercase tracking-wider border-b border-[#E5E2DC]">
                <tr>
                  <th className="py-3.5 px-4">Order ID</th>
                  <th className="py-3.5 px-4">Customer</th>
                  <th className="py-3.5 px-4">Date</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4">Amount</th>
                  <th className="py-3.5 px-4">Update Status</th>
                  <th className="py-3.5 px-4 text-right">Details</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E5E2DC]/60 font-medium">
                {filteredOrders.map((order) => {
                  const formattedDate = new Date(order.created_at).toLocaleDateString("en-IN", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  });

                  const isUpdatingThis = updatingOrderId === order.id && isPending;
                  const customerEmail = order.profile?.email || "Customer";
                  const customerName =
                    order.shipping_address?.full_name ||
                    order.profile?.full_name ||
                    "Valued Client";
                  const orderAmount = Number(order.total ?? order.total_amount ?? 0);
                  const displayId = order.order_number || `#${order.id.slice(0, 8).toUpperCase()}`;

                  return (
                    <tr
                      key={order.id}
                      className="hover:bg-[#F8F6F2]/60 transition-colors group"
                    >
                      {/* Order ID */}
                      <td className="py-3.5 px-4">
                        <Link
                          href={`/admin/orders/${order.id}`}
                          className="font-mono font-bold text-sm text-[#1A1A1A] hover:text-[#5D6B4D] transition-colors block"
                        >
                          {displayId}
                        </Link>
                        <span className="font-mono text-[10px] text-[#A3A3A3] block truncate max-w-[120px]">
                          {order.id}
                        </span>
                      </td>

                      {/* Customer */}
                      <td className="py-3.5 px-4">
                        <div className="font-semibold text-[#1A1A1A]">{customerName}</div>
                        <div className="text-[11px] text-[#6B7280] truncate max-w-xs">
                          {customerEmail}
                        </div>
                        {order.shipping_address?.city && (
                          <div className="text-[10px] text-[#A3A3A3]">
                            {order.shipping_address.city}, {order.shipping_address.state}
                          </div>
                        )}
                      </td>

                      {/* Date */}
                      <td className="py-3.5 px-4 text-[#6B7280] whitespace-nowrap">
                        {formattedDate}
                      </td>

                      {/* Status Badge */}
                      <td className="py-3.5 px-4">
                        <OrderStatusBadge status={order.status} />
                      </td>

                      {/* Amount */}
                      <td className="py-3.5 px-4 font-mono font-bold text-sm text-[#1A1A1A] whitespace-nowrap">
                        {formatINR(orderAmount)}
                      </td>

                      {/* Update Status Selector */}
                      <td className="py-3.5 px-4">
                        <div className="inline-flex items-center gap-2">
                          {isUpdatingThis ? (
                            <Loader2 className="size-4 animate-spin text-[#5D6B4D]" />
                          ) : null}
                          <select
                            value={order.status}
                            disabled={isUpdatingThis}
                            onChange={(e) =>
                              handleStatusChange(order.id, e.target.value as OrderStatus)
                            }
                            className="h-8 rounded-lg border border-[#E5E2DC] bg-white px-2.5 text-xs font-medium text-[#1A1A1A] outline-none focus:border-[#5D6B4D] cursor-pointer disabled:opacity-50 shadow-2xs"
                          >
                            <option value="pending">Pending</option>
                            <option value="processing">Processing</option>
                            <option value="shipped">Shipped</option>
                            <option value="delivered">Delivered</option>
                            <option value="cancelled">Cancelled</option>
                          </select>
                        </div>
                      </td>

                      {/* Details / Inspect Link */}
                      <td className="py-3.5 px-4 text-right">
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

          {/* Mobile Operations Cards */}
          <div className="md:hidden divide-y divide-[#E5E2DC]/60 p-4 space-y-4">
            {filteredOrders.map((order) => {
              const formattedDate = new Date(order.created_at).toLocaleDateString("en-IN", {
                month: "short",
                day: "numeric",
                year: "numeric",
              });
              const isUpdatingThis = updatingOrderId === order.id && isPending;
              const customerEmail = order.profile?.email || "Customer";
              const customerName =
                order.shipping_address?.full_name ||
                order.profile?.full_name ||
                "Valued Client";
              const orderAmount = Number(order.total ?? order.total_amount ?? 0);
              const displayId = order.order_number || `#${order.id.slice(0, 8).toUpperCase()}`;

              return (
                <div key={order.id} className="pt-4 first:pt-0 space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <Link
                        href={`/admin/orders/${order.id}`}
                        className="font-mono font-bold text-sm text-[#1A1A1A] hover:text-[#5D6B4D]"
                      >
                        {displayId}
                      </Link>
                      <div className="text-[10px] text-[#6B7280]">{formattedDate}</div>
                    </div>
                    <OrderStatusBadge status={order.status} />
                  </div>

                  <div className="flex items-center justify-between text-xs">
                    <div>
                      <div className="font-semibold text-[#1A1A1A]">{customerName}</div>
                      <div className="text-[11px] text-[#6B7280]">{customerEmail}</div>
                    </div>
                    <div className="font-mono font-bold text-sm text-[#1A1A1A]">
                      {formatINR(orderAmount)}
                    </div>
                  </div>

                  {/* Actions Bar for Mobile */}
                  <div className="flex items-center justify-between pt-2 border-t border-[#E5E2DC]/40">
                    <div className="flex items-center gap-1.5">
                      <span className="text-[10px] uppercase font-bold text-[#6B7280]">Status:</span>
                      <select
                        value={order.status}
                        disabled={isUpdatingThis}
                        onChange={(e) =>
                          handleStatusChange(order.id, e.target.value as OrderStatus)
                        }
                        className="h-7 rounded-md border border-[#E5E2DC] bg-white px-2 text-xs font-medium text-[#1A1A1A] outline-none"
                      >
                        <option value="pending">Pending</option>
                        <option value="processing">Processing</option>
                        <option value="shipped">Shipped</option>
                        <option value="delivered">Delivered</option>
                        <option value="cancelled">Cancelled</option>
                      </select>
                      {isUpdatingThis && <Loader2 className="size-3 animate-spin text-[#5D6B4D]" />}
                    </div>

                    <Link
                      href={`/admin/orders/${order.id}`}
                      className="inline-flex items-center gap-1 text-xs font-semibold text-[#5D6B4D]"
                    >
                      <span>Inspect</span>
                      <ArrowRight className="size-3" />
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
