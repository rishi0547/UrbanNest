"use client";

import { useSearchParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import {
  Package,
  CheckCircle2,
  Calendar,
  MapPin,
  ArrowRight,
  ExternalLink,
} from "lucide-react";
import { useUserOrders } from "../queries";
import { OrderStatusBadge } from "./order-status-badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

export function UserOrdersView() {
  const searchParams = useSearchParams();
  const isJustPlaced = searchParams.get("placed") === "true";

  const { data: orders, isLoading, isError } = useUserOrders();

  if (isLoading) {
    return (
      <div className="space-y-6 animate-pulse">
        {Array.from({ length: 3 }).map((_, idx) => (
          <div key={idx} className="h-44 rounded-2xl bg-muted/60" />
        ))}
      </div>
    );
  }

  const orderList = orders || [];

  return (
    <div className="space-y-8">
      {/* Celebration Banner if just placed */}
      {isJustPlaced && (
        <div className="rounded-2xl border border-emerald-500/40 bg-emerald-500/10 p-5 text-emerald-700 dark:text-emerald-300 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 animate-in fade-in slide-in-from-top-3 duration-500">
          <div className="flex items-center gap-3">
            <CheckCircle2 className="size-6 text-emerald-500 shrink-0" />
            <div>
              <strong className="block text-sm font-bold">
                Order Received &amp; Verified!
              </strong>
              <span className="text-xs">
                Your order is confirmed and scheduled for white-glove packaging. A confirmation has been logged below.
              </span>
            </div>
          </div>
          <Link href="/products">
            <Button size="sm" variant="outline" className="border-emerald-500/40 text-xs font-semibold shrink-0">
              Continue Browsing
            </Button>
          </Link>
        </div>
      )}

      {/* Empty Orders State */}
      {orderList.length === 0 ? (
        <Card className="border-dashed border-border py-16 text-center max-w-md mx-auto">
          <CardContent className="space-y-4">
            <div className="mx-auto size-12 rounded-full bg-muted flex items-center justify-center text-muted-foreground">
              <Package className="size-6" />
            </div>
            <div className="space-y-1">
              <h3 className="text-lg font-bold text-foreground">No orders placed yet</h3>
              <p className="text-xs text-muted-foreground">
                Your purchase history is currently empty. Explore our catalog to find your first handcrafted design.
              </p>
            </div>
            <Link href="/products">
              <Button className="mt-2">
                Explore Product Catalog
                <ArrowRight className="size-4 ml-1.5" />
              </Button>
            </Link>
          </CardContent>
        </Card>
      ) : (
        /* Orders List */
        <div className="space-y-6">
          {orderList.map((order) => {
            const formattedDate = new Date(order.created_at).toLocaleDateString("en-US", {
              year: "numeric",
              month: "short",
              day: "numeric",
            });

            return (
              <Card
                key={order.id}
                className="border-border/70 bg-card overflow-hidden shadow-xs hover:border-primary/40 transition-colors"
              >
                {/* Order Header */}
                <CardHeader className="bg-muted/30 border-b border-border/60 py-4 px-5">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="flex flex-wrap items-center gap-3">
                      <span className="font-mono text-base font-bold text-foreground">
                        {order.order_number}
                      </span>
                      <OrderStatusBadge status={order.status} />
                    </div>

                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1.5">
                        <Calendar className="size-3.5" />
                        {formattedDate}
                      </span>
                      <span>•</span>
                      <span className="font-bold text-foreground font-mono text-sm">
                        ${Number(order.total_amount).toFixed(2)}
                      </span>
                    </div>
                  </div>
                </CardHeader>

                {/* Order Body */}
                <CardContent className="p-5 space-y-4">
                  {/* Delivery destination snippet */}
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <MapPin className="size-3.5 text-primary shrink-0" />
                    <span>
                      Delivering to: <strong className="text-foreground">{order.shipping_address.full_name}</strong>,{" "}
                      {order.shipping_address.address}, {order.shipping_address.city}, {order.shipping_address.state}{" "}
                      {order.shipping_address.pincode}
                    </span>
                  </div>

                  {/* Line Items */}
                  <div className="border-t border-border/50 pt-3 divide-y divide-border/40">
                    {order.order_items?.map((item) => {
                      const thumbnail = item.product?.images?.[0];

                      return (
                        <div
                          key={item.id}
                          className="py-2.5 flex items-center justify-between gap-4 first:pt-0 last:pb-0"
                        >
                          <div className="flex items-center gap-3 min-w-0">
                            <div className="relative size-12 rounded-lg overflow-hidden border border-border bg-muted/40 shrink-0">
                              {thumbnail ? (
                                <Image
                                  src={thumbnail}
                                  alt={item.product?.title || "Product"}
                                  fill
                                  sizes="48px"
                                  className="object-cover"
                                />
                              ) : (
                                <Package className="size-5 m-auto text-muted-foreground" />
                              )}
                            </div>
                            <div className="min-w-0">
                              {item.product?.slug ? (
                                <Link
                                  href={`/products/${item.product.slug}`}
                                  className="font-medium text-xs text-foreground hover:text-primary transition-colors truncate block"
                                >
                                  {item.product.title}
                                </Link>
                              ) : (
                                <span className="font-medium text-xs text-foreground truncate block">
                                  {item.product?.title || "Custom Piece"}
                                </span>
                              )}
                              <span className="text-[11px] text-muted-foreground font-mono">
                                Qty: {item.quantity} &times; ${Number(item.price).toFixed(2)}
                              </span>
                            </div>
                          </div>

                          <div className="font-mono text-xs font-semibold text-foreground shrink-0">
                            ${(Number(item.price) * item.quantity).toFixed(2)}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
