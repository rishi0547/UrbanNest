import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowLeft,
  ChevronRight,
  Calendar,
  User,
  Phone,
  MapPin,
  Mail,
  ShieldCheck,
  CheckCircle2,
  Clock,
  Truck,
  PackageCheck,
  AlertOctagon,
  ExternalLink,
} from "lucide-react";
import { requireAdmin } from "@/features/auth/roles";
import { createClient } from "@/lib/supabase/server";
import { getOrderById } from "@/features/orders/api";
import { OrderStatusBadge } from "@/features/orders/components/order-status-badge";
import { AdminOrderStatusChanger } from "@/features/orders/components/admin-order-status-changer";
import { SafeProductImage } from "@/components/ProductImageFallback";
import { formatINR } from "@/utils/currency";

interface AdminOrderInspectPageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({
  params,
}: AdminOrderInspectPageProps): Promise<Metadata> {
  const { id } = await params;
  const supabase = await createClient();
  const order = await getOrderById(id, supabase);

  const displayId = order?.order_number || (id ? `#${id.slice(0, 8).toUpperCase()}` : "Order");

  return {
    title: `Inspect ${displayId} | UrbanNest Admin`,
    description: `Detailed operational inspection for customer order ${displayId}.`,
    robots: {
      index: false,
      follow: false,
    },
  };
}

export const dynamic = "force-dynamic";

export default async function AdminOrderInspectPage({
  params,
}: AdminOrderInspectPageProps) {
  await requireAdmin("/admin/orders");
  const { id } = await params;
  const supabase = await createClient();
  const order = await getOrderById(id, supabase);

  if (!order) {
    notFound();
  }

  const displayId = order.order_number || `#${order.id.slice(0, 8).toUpperCase()}`;

  const formattedDate = new Date(order.created_at).toLocaleDateString("en-IN", {
    weekday: "short",
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  const updatedDate = order.updated_at
    ? new Date(order.updated_at).toLocaleDateString("en-IN", {
        weekday: "short",
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      })
    : null;

  const recipientName =
    order.shipping_address?.full_name ||
    order.profile?.full_name ||
    "Valued Client";
  const customerEmail = order.profile?.email || "Email Not Provided";
  const customerPhone = order.shipping_address?.phone || "Phone Not Provided";

  const subtotal = Number(order.subtotal ?? 0);
  const shipping = Number(order.shipping ?? 0);
  const tax = Number(order.tax ?? 0);
  const total = Number(order.total ?? order.total_amount ?? 0);

  // Status timeline steps
  const isCancelled = order.status === "cancelled";
  const steps = [
    { key: "placed", label: "Order Placed", isPassed: true, isCurrent: order.status === "pending" },
    {
      key: "confirmed",
      label: "Payment Confirmed",
      isPassed: !isCancelled,
      isCurrent: false,
    },
    {
      key: "processing",
      label: "Processing",
      isPassed: ["processing", "shipped", "delivered"].includes(order.status),
      isCurrent: order.status === "processing",
    },
    {
      key: "shipped",
      label: "Shipped",
      isPassed: ["shipped", "delivered"].includes(order.status),
      isCurrent: order.status === "shipped",
    },
    {
      key: "delivered",
      label: "Delivered",
      isPassed: order.status === "delivered",
      isCurrent: order.status === "delivered",
    },
  ];

  return (
    <div className="py-8 sm:py-10">
      <div className="mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Navigation Breadcrumb & Header */}
        <div className="space-y-1.5 border-b border-[#E5E2DC] pb-6">
          <div className="flex items-center gap-2 text-xs text-[#6B7280]">
            <Link href="/admin" className="hover:text-[#1A1A1A] transition-colors">
              Admin Console
            </Link>
            <ChevronRight className="size-3 text-[#A3A3A3]" />
            <Link href="/admin/orders" className="hover:text-[#1A1A1A] transition-colors">
              Orders
            </Link>
            <ChevronRight className="size-3 text-[#A3A3A3]" />
            <span className="text-[#1A1A1A] font-medium">{displayId}</span>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pt-1">
            <div className="space-y-1">
              <div className="flex flex-wrap items-center gap-3">
                <h1 className="font-heading text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-[#1A1A1A]">
                  Order {displayId}
                </h1>
                <OrderStatusBadge status={order.status} />
              </div>
              <div className="flex flex-wrap items-center gap-3 text-xs text-[#6B7280]">
                <span className="flex items-center gap-1.5">
                  <Calendar className="size-3.5 text-[#A3A3A3]" />
                  <span>Placed on {formattedDate}</span>
                </span>
                {updatedDate && updatedDate !== formattedDate && (
                  <span className="text-[11px] text-[#A3A3A3]">
                    · Last updated {updatedDate}
                  </span>
                )}
              </div>
            </div>

            <Link
              href="/admin/orders"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#6B7280] hover:text-[#1A1A1A] transition-colors"
            >
              <ArrowLeft className="size-3.5" />
              <span>Back to Order Pipeline</span>
            </Link>
          </div>
        </div>

        {/* Status Timeline */}
        <div className="rounded-xl border border-[#E5E2DC] bg-white p-6 shadow-2xs space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-widest text-[#5D6B4D]">
              Fulfillment Lifecycle
            </span>
            {isCancelled && (
              <span className="inline-flex items-center gap-1 text-xs font-bold text-rose-700 bg-rose-50 px-2 py-0.5 rounded-full border border-rose-200">
                <AlertOctagon className="size-3" />
                <span>Transaction Cancelled</span>
              </span>
            )}
          </div>

          {!isCancelled ? (
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 pt-2">
              {steps.map((step, idx) => (
                <div
                  key={step.key}
                  className={`rounded-lg p-3 border transition-all ${
                    step.isCurrent
                      ? "border-[#5D6B4D] bg-[#5D6B4D]/5 ring-1 ring-[#5D6B4D]"
                      : step.isPassed
                      ? "border-emerald-200 bg-emerald-50/50"
                      : "border-[#E5E2DC] bg-[#F8F6F2]/30 opacity-60"
                  }`}
                >
                  <div className="flex items-center justify-between text-[11px] font-semibold">
                    <span className="text-[#6B7280]">Step {idx + 1}</span>
                    {step.isPassed ? (
                      <CheckCircle2 className="size-3.5 text-emerald-600" />
                    ) : (
                      <Clock className="size-3.5 text-[#A3A3A3]" />
                    )}
                  </div>
                  <div
                    className={`font-semibold text-xs mt-1.5 ${
                      step.isCurrent
                        ? "text-[#5D6B4D] font-bold"
                        : step.isPassed
                        ? "text-[#1A1A1A]"
                        : "text-[#6B7280]"
                    }`}
                  >
                    {step.label}
                  </div>
                  <div className="text-[10px] text-[#A3A3A3] mt-0.5">
                    {step.isCurrent
                      ? "Current active stage"
                      : step.isPassed
                      ? "Completed"
                      : "Pending"}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="rounded-lg border border-rose-200 bg-rose-50 p-4 text-xs text-rose-800">
              This order has been cancelled and its inventory allocation restored. No further logistics actions are pending.
            </div>
          )}
        </div>

        {/* 2-Column Inspection Content */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* LEFT COLUMN: Line Items & Customer Details (8 cols) */}
          <div className="lg:col-span-8 space-y-6">
            
            {/* Ordered Products */}
            <div className="rounded-xl border border-[#E5E2DC] bg-white p-6 shadow-2xs space-y-5">
              <div className="border-b border-[#E5E2DC] pb-4 flex items-center justify-between">
                <div>
                  <span className="text-[11px] font-bold uppercase tracking-widest text-[#5D6B4D]">
                    Merchandise
                  </span>
                  <h2 className="font-heading text-lg font-bold text-[#1A1A1A] mt-0.5">
                    Ordered Furnishings ({order.order_items?.length || 0})
                  </h2>
                </div>
                <span className="text-xs text-[#6B7280]">
                  Line total: {formatINR(subtotal)}
                </span>
              </div>

              <div className="divide-y divide-[#E5E2DC]/60">
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
                        <div className="relative size-16 rounded-lg overflow-hidden border border-[#E5E2DC] bg-[#F0EDE8] shrink-0">
                          <SafeProductImage
                            src={thumbnail}
                            alt={itemTitle}
                            fill
                            sizes="64px"
                            className="object-cover"
                          />
                        </div>
                        <div className="space-y-1 min-w-0">
                          {item.product?.slug ? (
                            <Link
                              href={`/products/${item.product.slug}`}
                              target="_blank"
                              className="font-semibold text-sm text-[#1A1A1A] hover:text-[#5D6B4D] transition-colors truncate block"
                            >
                              {itemTitle}
                            </Link>
                          ) : (
                            <span className="font-semibold text-sm text-[#1A1A1A] truncate block">
                              {itemTitle}
                            </span>
                          )}
                          <div className="text-xs text-[#6B7280] font-mono">
                            {formatINR(itemPrice)} &times; {item.quantity} unit{item.quantity > 1 ? "s" : ""}
                          </div>
                        </div>
                      </div>

                      <div className="text-right shrink-0">
                        <div className="font-mono text-sm font-bold text-[#1A1A1A]">
                          {formatINR(lineTotal)}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Customer & Shipping Details */}
            <div className="rounded-xl border border-[#E5E2DC] bg-white p-6 shadow-2xs space-y-5">
              <div className="border-b border-[#E5E2DC] pb-4">
                <span className="text-[11px] font-bold uppercase tracking-widest text-[#5D6B4D]">
                  Fulfillment Target
                </span>
                <h2 className="font-heading text-lg font-bold text-[#1A1A1A] mt-0.5">
                  Customer &amp; Shipping Details
                </h2>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-xs">
                {/* Contact Card */}
                <div className="space-y-3 p-4 rounded-lg bg-[#F8F6F2]/50 border border-[#E5E2DC]">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-[#6B7280] block">
                    Contact Record
                  </span>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-[#1A1A1A] font-semibold text-sm">
                      <User className="size-4 text-[#5D6B4D]" />
                      <span>{recipientName}</span>
                    </div>
                    <div className="flex items-center gap-2 text-[#6B7280]">
                      <Mail className="size-3.5 text-[#A3A3A3]" />
                      <span>{customerEmail}</span>
                    </div>
                    {customerPhone && (
                      <div className="flex items-center gap-2 text-[#6B7280]">
                        <Phone className="size-3.5 text-[#A3A3A3]" />
                        <span>{customerPhone}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Delivery Address Card */}
                <div className="space-y-3 p-4 rounded-lg bg-[#F8F6F2]/50 border border-[#E5E2DC]">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-[#6B7280] block">
                    Delivery Address
                  </span>
                  <div className="space-y-1 text-[#1A1A1A]">
                    <div className="flex items-start gap-2">
                      <MapPin className="size-4 text-[#5D6B4D] mt-0.5 shrink-0" />
                      <div className="space-y-0.5">
                        <p className="font-medium">
                          {order.shipping_address?.address_line1 || order.shipping_address?.address || "Address Line 1"}
                        </p>
                        {order.shipping_address?.address_line2 && (
                          <p className="text-[#6B7280]">{order.shipping_address.address_line2}</p>
                        )}
                        <p className="text-[#6B7280]">
                          {order.shipping_address?.city}, {order.shipping_address?.state} {order.shipping_address?.postal_code || order.shipping_address?.pincode}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

          </div>

          {/* RIGHT COLUMN: State Control & Financial Summary (4 cols) */}
          <div className="lg:col-span-4 space-y-6">
            
            {/* Fulfillment State Changer */}
            <div className="rounded-xl border border-[#E5E2DC] bg-white p-6 shadow-2xs space-y-4">
              <div className="border-b border-[#E5E2DC] pb-3">
                <span className="text-[11px] font-bold uppercase tracking-widest text-[#5D6B4D]">
                  Logistics Control
                </span>
                <h3 className="font-heading text-base font-bold text-[#1A1A1A] mt-0.5">
                  Fulfillment Status
                </h3>
              </div>

              <AdminOrderStatusChanger
                orderId={order.id}
                currentStatus={order.status}
              />
            </div>

            {/* Financial Invoicing Breakdown */}
            <div className="rounded-xl border border-[#E5E2DC] bg-white p-6 shadow-2xs space-y-4">
              <div className="border-b border-[#E5E2DC] pb-3">
                <span className="text-[11px] font-bold uppercase tracking-widest text-[#5D6B4D]">
                  Accounting
                </span>
                <h3 className="font-heading text-base font-bold text-[#1A1A1A] mt-0.5">
                  Financial Breakdown
                </h3>
              </div>

              <div className="space-y-2.5 text-xs">
                <div className="flex justify-between text-[#6B7280]">
                  <span>Subtotal</span>
                  <span className="font-mono text-[#1A1A1A] font-medium">{formatINR(subtotal)}</span>
                </div>
                <div className="flex justify-between text-[#6B7280]">
                  <span>White-Glove Shipping</span>
                  <span className="font-mono text-[#1A1A1A] font-medium">
                    {shipping === 0 ? "Complimentary (₹0)" : formatINR(shipping)}
                  </span>
                </div>
                <div className="flex justify-between text-[#6B7280]">
                  <span>Estimated Tax (GST 8%)</span>
                  <span className="font-mono text-[#1A1A1A] font-medium">{formatINR(tax)}</span>
                </div>

                <div className="border-t border-[#E5E2DC] pt-3 flex justify-between items-baseline">
                  <span className="text-sm font-semibold text-[#1A1A1A]">Total Invoiced</span>
                  <span className="font-mono text-xl font-bold text-[#1A1A1A]">
                    {formatINR(total)}
                  </span>
                </div>
              </div>
            </div>

            {/* Operational ID Reference Card */}
            <div className="rounded-xl border border-[#E5E2DC] bg-[#F8F6F2]/50 p-4 text-[11px] text-[#6B7280] space-y-2">
              <span className="font-semibold uppercase tracking-wider text-[#1A1A1A] block">
                System Identifiers
              </span>
              <div className="space-y-1 font-mono break-all">
                <div>
                  <span className="text-[#A3A3A3]">UUID:</span> {order.id}
                </div>
                <div>
                  <span className="text-[#A3A3A3]">USER ID:</span> {order.user_id}
                </div>
              </div>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
}
