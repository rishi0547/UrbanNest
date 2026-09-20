"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { Search, Loader2, Package, ArrowUpRight } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";
import { useAdminOrders } from "../queries";
import { orderQueryKeys } from "../query-keys";
import { updateOrderStatusAction } from "../actions";
import { OrderStatusBadge } from "./order-status-badge";
import type { OrderStatus } from "../types";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

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
        // Invalidate orders queries so the table reflects the new state
        await queryClient.invalidateQueries({ queryKey: orderQueryKeys.all });
      }
      setUpdatingOrderId(null);
    });
  };

  const allOrders = orders || [];

  const filteredOrders = allOrders.filter((order) => {
    const matchesStatus =
      selectedStatus === "all" || order.status === selectedStatus;

    const query = searchQuery.toLowerCase().trim();
    const matchesSearch =
      !query ||
      order.order_number.toLowerCase().includes(query) ||
      order.profile?.email.toLowerCase().includes(query) ||
      order.shipping_address.full_name.toLowerCase().includes(query) ||
      order.shipping_address.city.toLowerCase().includes(query);

    return matchesStatus && matchesSearch;
  });

  const statuses: { label: string; value: string }[] = [
    { label: "All Orders", value: "all" },
    { label: "Pending", value: "pending" },
    { label: "Processing", value: "processing" },
    { label: "Shipped", value: "shipped" },
    { label: "Delivered", value: "delivered" },
    { label: "Cancelled", value: "cancelled" },
  ];

  return (
    <div className="space-y-6">
      {/* Controls Bar: Search & Status Tabs */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 rounded-2xl border border-border/70 bg-card/40 p-4 backdrop-blur-xs shadow-xs">
        {/* Search */}
        <div className="relative w-full sm:max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
          <Input
            placeholder="Search by order #, customer email, or city..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 bg-background text-xs"
          />
        </div>

        {/* Status Filter Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0 scrollbar-none">
          {statuses.map((tab) => (
            <button
              key={tab.value}
              type="button"
              onClick={() => setSelectedStatus(tab.value)}
              className={`rounded-full px-3 py-1 text-xs font-medium transition-all whitespace-nowrap ${
                selectedStatus === tab.value
                  ? "bg-primary text-primary-foreground shadow-xs"
                  : "bg-muted text-muted-foreground hover:bg-muted/80 hover:text-foreground"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Orders Table Card */}
      {isLoading ? (
        <div className="space-y-3 animate-pulse">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="h-16 rounded-xl bg-muted/60" />
          ))}
        </div>
      ) : filteredOrders.length === 0 ? (
        <Card className="border-dashed border-border py-16 text-center max-w-sm mx-auto">
          <CardContent className="space-y-3">
            <Package className="size-10 mx-auto text-muted-foreground" />
            <h3 className="font-semibold text-base">No matching orders</h3>
            <p className="text-xs text-muted-foreground">
              No customer orders match the selected filters.
            </p>
          </CardContent>
        </Card>
      ) : (
        <Card className="border-border overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-muted/50 font-semibold text-muted-foreground uppercase tracking-wider border-b border-border">
                <tr>
                  <th className="py-3.5 px-4">Order ID &amp; Date</th>
                  <th className="py-3.5 px-4">Customer</th>
                  <th className="py-3.5 px-4">Destination</th>
                  <th className="py-3.5 px-4">Items</th>
                  <th className="py-3.5 px-4">Total</th>
                  <th className="py-3.5 px-4">Current Status</th>
                  <th className="py-3.5 px-4 text-right">Update Lifecycle</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60">
                {filteredOrders.map((order) => {
                  const formattedDate = new Date(order.created_at).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  });

                  const isUpdatingThis = updatingOrderId === order.id && isPending;
                  const customerEmail = order.profile?.email || "Guest Shopper";
                  const customerName = order.shipping_address.full_name;

                  return (
                    <tr
                      key={order.id}
                      className="hover:bg-muted/30 transition-colors"
                    >
                      {/* Order Number & Placement Date */}
                      <td className="py-3.5 px-4">
                        <div className="font-mono font-bold text-foreground">
                          {order.order_number}
                        </div>
                        <div className="text-[11px] text-muted-foreground mt-0.5">
                          {formattedDate}
                        </div>
                      </td>

                      {/* Customer Info */}
                      <td className="py-3.5 px-4">
                        <div className="font-medium text-foreground">{customerName}</div>
                        <div className="text-[11px] text-muted-foreground truncate max-w-xs">
                          {customerEmail}
                        </div>
                      </td>

                      {/* Shipping Destination */}
                      <td className="py-3.5 px-4">
                        <div className="text-foreground">
                          {order.shipping_address.city}, {order.shipping_address.state}
                        </div>
                        <div className="text-[11px] text-muted-foreground font-mono">
                          {order.shipping_address.pincode}
                        </div>
                      </td>

                      {/* Line Items Count & Preview */}
                      <td className="py-3.5 px-4">
                        <Badge variant="outline" className="font-mono text-[10px]">
                          {order.order_items?.length || 0} items
                        </Badge>
                      </td>

                      {/* Financial Total */}
                      <td className="py-3.5 px-4 font-mono font-bold text-foreground text-sm">
                        ${Number(order.total_amount).toFixed(2)}
                      </td>

                      {/* Current Status Badge */}
                      <td className="py-3.5 px-4">
                        <OrderStatusBadge status={order.status} />
                      </td>

                      {/* Action: Status Transition Dropdown */}
                      <td className="py-3.5 px-4 text-right">
                        <div className="inline-flex items-center justify-end gap-2">
                          {isUpdatingThis && (
                            <Loader2 className="size-3.5 animate-spin text-primary" />
                          )}
                          <select
                            value={order.status}
                            disabled={isUpdatingThis}
                            onChange={(e) =>
                              handleStatusChange(order.id, e.target.value as OrderStatus)
                            }
                            className="h-7 rounded-lg border border-border bg-background px-2 text-xs font-medium text-foreground outline-none focus:border-primary cursor-pointer disabled:opacity-50"
                          >
                            <option value="pending">Pending</option>
                            <option value="processing">Processing</option>
                            <option value="shipped">Shipped</option>
                            <option value="delivered">Delivered</option>
                            <option value="cancelled">Cancelled</option>
                          </select>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </Card>
      )}
    </div>
  );
}
