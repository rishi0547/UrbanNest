"use client";

import Link from "next/link";
import Image from "next/image";
import {
  ArrowLeft,
  Calendar,
  MapPin,
  Phone,
  User,
  Package,
  Truck,
  ShieldCheck,
  AlertCircle,
} from "lucide-react";
import { useOrderDetail } from "../queries";
import { OrderStatusBadge } from "./order-status-badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { formatINR } from "@/utils/currency";
import { SafeProductImage } from "@/components/ProductImageFallback";

interface OrderDetailsViewProps {
  orderId: string;
}

export function OrderDetailsView({ orderId }: OrderDetailsViewProps) {
  const { data: order, isLoading, isError } = useOrderDetail(orderId);

  if (isLoading) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="h-8 w-48 bg-muted rounded-md" />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 h-96 rounded-2xl bg-muted/60" />
          <div className="h-80 rounded-2xl bg-muted/60" />
        </div>
      </div>
    );
  }

  if (isError || !order) {
    return (
      <Card className="border-destructive/30 bg-destructive/5 py-12 text-center max-w-md mx-auto">
        <CardContent className="space-y-4">
          <AlertCircle className="size-12 mx-auto text-destructive" />
          <div className="space-y-1">
            <h2 className="text-xl font-bold text-foreground">Order Not Found</h2>
            <p className="text-xs text-muted-foreground">
              We couldn&apos;t retrieve the details for this order. It may have been archived or belongs to a different account.
            </p>
          </div>
          <Link href="/orders">
            <Button variant="outline" className="mt-2">
              <ArrowLeft className="size-4 mr-2" />
              Back to My Orders
            </Button>
          </Link>
        </CardContent>
      </Card>
    );
  }

  const formattedDate = new Date(order.created_at).toLocaleDateString("en-IN", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const subtotal = Number(order.subtotal ?? 0);
  const shipping = Number(order.shipping ?? 0);
  const tax = Number(order.tax ?? 0);
  const total = Number(order.total ?? order.total_amount ?? 0);

  const shippingAddr = order.shipping_address;

  return (
    <div className="space-y-8">
      {/* Top Navigation & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <Link
          href="/orders"
          className="inline-flex items-center gap-2 text-xs font-semibold text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="size-4" />
          <span>Back to All Orders</span>
        </Link>

        <div className="flex items-center gap-3">
          <Link href="/products">
            <Button variant="outline" size="sm" className="text-xs">
              Continue Shopping
            </Button>
          </Link>
        </div>
      </div>

      {/* Main Order Header */}
      <div className="rounded-2xl border border-border/80 bg-card/60 backdrop-blur-xs p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-1.5">
          <div className="flex flex-wrap items-center gap-3">
            <h1 className="font-mono text-xl sm:text-2xl font-bold tracking-tight text-foreground break-all">
              {order.order_number || order.id}
            </h1>
            <OrderStatusBadge status={order.status} />
          </div>
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Calendar className="size-3.5" />
            <span>Placed on {formattedDate}</span>
          </div>
        </div>

        <div className="text-left md:text-right">
          <div className="text-xs text-muted-foreground">Total Invoiced</div>
          <div className="font-mono text-2xl font-bold text-primary">
            {formatINR(total)}
          </div>
        </div>
      </div>

      {/* 2-Column Content Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left 2 Columns: Ordered Products */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="border-border/70 bg-card">
            <CardHeader className="pb-4">
              <CardTitle className="text-lg">
                Ordered Products ({order.order_items?.length || 0})
              </CardTitle>
              <CardDescription>
                Architectural furnishings and pieces included in this shipment.
              </CardDescription>
            </CardHeader>
            <CardContent className="p-6 pt-0">
              <div className="divide-y divide-border/60">
                {order.order_items?.map((item) => {
                  const thumbnail = item.product?.images?.[0];
                  const itemTitle = item.product_name || item.product?.title || "UrbanNest Item";
                  const itemPrice = Number(item.product_price ?? item.price ?? 0);
                  const lineTotal = Number(item.line_total ?? itemPrice * item.quantity);

                  return (
                    <div
                      key={item.id}
                      className="py-4 flex items-center justify-between gap-4 first:pt-0 last:pb-0"
                    >
                      <div className="flex items-center gap-4 min-w-0">
                        <div className="relative size-16 sm:size-20 rounded-xl overflow-hidden border border-border bg-muted/40 shrink-0">
                          <SafeProductImage
                            src={thumbnail}
                            alt={itemTitle}
                            fill
                            sizes="80px"
                            className="object-cover"
                          />
                        </div>

                        <div className="space-y-1 min-w-0">
                          {item.product?.slug ? (
                            <Link
                              href={`/products/${item.product.slug}`}
                              className="font-medium text-sm text-foreground hover:text-primary transition-colors block truncate"
                            >
                              {itemTitle}
                            </Link>
                          ) : (
                            <span className="font-medium text-sm text-foreground block truncate">
                              {itemTitle}
                            </span>
                          )}
                          <div className="text-xs text-muted-foreground font-mono">
                            {formatINR(itemPrice)} &times; {item.quantity} unit{item.quantity > 1 ? "s" : ""}
                          </div>
                        </div>
                      </div>

                      <div className="text-right shrink-0">
                        <div className="font-mono text-sm font-bold text-foreground">
                          {formatINR(lineTotal)}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          {/* White-Glove Guarantee Badge */}
          <div className="rounded-xl border border-primary/20 bg-primary/5 p-4 flex items-center gap-3 text-xs text-muted-foreground">
            <ShieldCheck className="size-5 text-primary shrink-0" />
            <div>
              <strong className="text-foreground font-semibold">White-Glove Guarantee:</strong> Each item is hand-inspected, padded in custom crates, and assembled on-site in your desired room.
            </div>
          </div>
        </div>

        {/* Right 1 Column: Shipping Details & Order Summary */}
        <div className="space-y-6">
          {/* Shipping Details */}
          <Card className="border-border/70 bg-card">
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <MapPin className="size-4 text-primary" />
                <span>Shipping Details</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-xs">
              <div className="flex items-start gap-2.5">
                <User className="size-4 text-muted-foreground shrink-0 mt-0.5" />
                <div>
                  <div className="font-semibold text-foreground">
                    {shippingAddr?.full_name || "Valued Client"}
                  </div>
                  <div className="text-muted-foreground">{shippingAddr?.phone}</div>
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <MapPin className="size-4 text-muted-foreground shrink-0 mt-0.5" />
                <div className="text-muted-foreground space-y-0.5">
                  <div className="text-foreground font-medium">
                    {shippingAddr?.address_line1 || shippingAddr?.address}
                  </div>
                  {shippingAddr?.address_line2 && (
                    <div>{shippingAddr.address_line2}</div>
                  )}
                  <div>
                    {shippingAddr?.city}, {shippingAddr?.state}{" "}
                    {shippingAddr?.postal_code || shippingAddr?.pincode}
                  </div>
                </div>
              </div>

              <Separator className="my-2" />

              <div className="flex items-center gap-2 text-muted-foreground">
                <Truck className="size-4 text-primary shrink-0" />
                <span>Standard White-Glove Curated Delivery</span>
              </div>
            </CardContent>
          </Card>

          {/* Order Financial Summary */}
          <Card className="border-border/70 bg-card">
            <CardHeader className="pb-3 border-b border-border/60">
              <CardTitle className="text-base">Order Summary</CardTitle>
            </CardHeader>
            <CardContent className="p-4 space-y-3 text-xs">
              <div className="flex justify-between text-muted-foreground">
                <span>Subtotal</span>
                <span className="font-mono text-foreground font-medium">
                  {formatINR(subtotal)}
                </span>
              </div>

              <div className="flex justify-between text-muted-foreground">
                <span>Shipping</span>
                <span className="font-mono text-foreground font-medium">
                  {shipping === 0 ? (
                    <span className="text-emerald-500 font-semibold">FREE</span>
                  ) : (
                    formatINR(shipping)
                  )}
                </span>
              </div>

              <div className="flex justify-between text-muted-foreground">
                <span>Estimated Tax (8%)</span>
                <span className="font-mono text-foreground font-medium">
                  {formatINR(tax)}
                </span>
              </div>

              <Separator />

              <div className="flex justify-between text-sm font-bold text-foreground">
                <span>Total</span>
                <span className="font-mono text-base text-primary">
                  {formatINR(total)}
                </span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
