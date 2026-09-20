"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  ShoppingBag,
  Trash2,
  ArrowRight,
  ArrowLeft,
  Truck,
  ShieldCheck,
  Package,
} from "lucide-react";
import { useCart } from "../cart-store";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export function CartView() {
  const { items, totalItems, subtotal, removeItem, updateQuantity, clearCart, isHydrated } =
    useCart();
  const [checkoutNotice, setCheckoutNotice] = useState(false);

  // Delivery calculation: Free for orders >= $500, otherwise $49
  const FREE_SHIPPING_THRESHOLD = 500;
  const isFreeShipping = subtotal >= FREE_SHIPPING_THRESHOLD;
  const shippingCost = isFreeShipping || subtotal === 0 ? 0 : 49;
  const estimatedTax = Math.round(subtotal * 0.08 * 100) / 100; // 8% tax
  const orderTotal = Math.round((subtotal + shippingCost + estimatedTax) * 100) / 100;

  const handleCheckoutClick = () => {
    setCheckoutNotice(true);
    setTimeout(() => setCheckoutNotice(false), 5000);
  };

  // SSR Hydration Skeleton
  if (!isHydrated) {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 py-8 animate-pulse">
        <div className="lg:col-span-2 space-y-4">
          <div className="h-24 rounded-xl bg-muted/60" />
          <div className="h-24 rounded-xl bg-muted/60" />
          <div className="h-24 rounded-xl bg-muted/60" />
        </div>
        <div className="h-64 rounded-xl bg-muted/60" />
      </div>
    );
  }

  // Empty Cart State
  if (items.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-border py-20 px-4 text-center max-w-lg mx-auto space-y-6">
        <div className="mx-auto size-16 rounded-full bg-muted flex items-center justify-center text-muted-foreground shadow-xs">
          <ShoppingBag className="size-8" />
        </div>
        <div className="space-y-2">
          <h2 className="text-2xl font-bold tracking-tight text-foreground">
            Your Cart is Empty
          </h2>
          <p className="text-sm text-muted-foreground max-w-sm mx-auto leading-relaxed">
            You haven&apos;t added any architectural furniture pieces to your cart yet. Discover our curated collections to get started.
          </p>
        </div>
        <Link href="/products" className="inline-block pt-2">
          <Button size="lg" className="font-semibold gap-2 shadow-md">
            <ShoppingBag className="size-4" />
            Explore Furniture Catalog
            <ArrowRight className="size-4" />
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header with Item Count & Breadcrumb */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border/60 pb-5">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-foreground">
            Shopping Cart
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Review your selected furniture items before proceeding to white-glove fulfillment.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-xs font-mono font-medium text-muted-foreground">
            {totalItems} {totalItems === 1 ? "unit" : "units"} staged
          </span>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={clearCart}
            className="text-xs text-muted-foreground hover:text-destructive transition-colors h-8"
          >
            <Trash2 className="size-3.5 mr-1.5" />
            Clear Cart
          </Button>
        </div>
      </div>

      {/* Main Grid: Items List & Order Summary */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 xl:gap-12">
        {/* Left 2 Columns: Items Table */}
        <div className="lg:col-span-2 space-y-4">
          <div className="rounded-2xl border border-border/70 bg-card overflow-hidden divide-y divide-border/60 shadow-xs">
            {items.map((item) => {
              const lineTotal = (item.price * item.quantity).toFixed(2);
              const isMaxStock = item.quantity >= item.stock;

              return (
                <div
                  key={item.productId}
                  className="p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center gap-4 hover:bg-muted/20 transition-colors group"
                >
                  {/* Thumbnail Image */}
                  <Link
                    href={`/products/${item.slug}`}
                    className="relative size-20 sm:size-24 rounded-xl overflow-hidden border border-border bg-muted/40 shrink-0"
                  >
                    {item.image ? (
                      <Image
                        src={item.image}
                        alt={item.title}
                        fill
                        sizes="96px"
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center text-muted-foreground">
                        <Package className="size-6" />
                      </div>
                    )}
                  </Link>

                  {/* Product Details & Category */}
                  <div className="flex-1 min-w-0 space-y-1">
                    <div className="flex items-center gap-2">
                      {item.categoryName && (
                        <Badge variant="outline" className="text-[10px] font-normal py-0">
                          {item.categoryName}
                        </Badge>
                      )}
                    </div>
                    <Link
                      href={`/products/${item.slug}`}
                      className="font-semibold text-foreground hover:text-primary transition-colors line-clamp-1 text-base"
                    >
                      {item.title}
                    </Link>
                    <div className="text-xs font-mono text-muted-foreground">
                      Unit: ${item.price.toFixed(2)}
                    </div>
                  </div>

                  {/* Quantity Stepper */}
                  <div className="flex flex-col items-center gap-1 shrink-0">
                    <div className="flex items-center rounded-lg border border-border bg-background">
                      <button
                        type="button"
                        onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                        className="px-2.5 py-1 text-xs text-muted-foreground hover:text-foreground transition-colors"
                        title="Decrease quantity"
                      >
                        -
                      </button>
                      <span className="px-2.5 py-1 text-xs font-semibold text-foreground min-w-7 text-center">
                        {item.quantity}
                      </span>
                      <button
                        type="button"
                        onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                        disabled={isMaxStock}
                        className="px-2.5 py-1 text-xs text-muted-foreground hover:text-foreground disabled:opacity-30 transition-colors"
                        title="Increase quantity"
                      >
                        +
                      </button>
                    </div>
                    {isMaxStock && (
                      <span className="text-[10px] text-amber-500 font-medium">
                        Max stock reached
                      </span>
                    )}
                  </div>

                  {/* Line Total Price & Delete Action */}
                  <div className="flex sm:flex-col items-center sm:items-end justify-between w-full sm:w-auto gap-2 shrink-0">
                    <span className="text-base font-bold text-foreground font-mono">
                      ${lineTotal}
                    </span>
                    <button
                      type="button"
                      onClick={() => removeItem(item.productId)}
                      className="text-muted-foreground hover:text-destructive transition-colors p-1"
                      title={`Remove ${item.title}`}
                    >
                      <Trash2 className="size-4" />
                      <span className="sr-only">Remove item</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Navigation link back to catalog */}
          <div className="pt-2">
            <Link
              href="/products"
              className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors font-medium"
            >
              <ArrowLeft className="size-3.5" />
              Continue Shopping
            </Link>
          </div>
        </div>

        {/* Right 1 Column: Order Summary Card */}
        <div className="space-y-6">
          <div className="rounded-2xl border border-border/70 bg-card p-6 space-y-6 shadow-xs">
            <h3 className="text-lg font-bold tracking-tight text-foreground border-b border-border/60 pb-3">
              Order Summary
            </h3>

            {/* Free Shipping Progress Indicator */}
            <div className="space-y-2 rounded-xl bg-muted/40 p-3 text-xs border border-border/50">
              <div className="flex items-center justify-between font-medium">
                <span className="flex items-center gap-1.5 text-foreground">
                  <Truck className="size-4 text-primary" />
                  White-Glove Delivery
                </span>
                {isFreeShipping ? (
                  <Badge variant="success" className="text-[10px]">
                    Qualified
                  </Badge>
                ) : (
                  <span className="text-muted-foreground">
                    ${(FREE_SHIPPING_THRESHOLD - subtotal).toFixed(2)} away
                  </span>
                )}
              </div>
              <div className="h-1.5 w-full rounded-full bg-border overflow-hidden">
                <div
                  className="h-full bg-primary transition-all duration-500 rounded-full"
                  style={{
                    width: `${Math.min(100, (subtotal / FREE_SHIPPING_THRESHOLD) * 100)}%`,
                  }}
                />
              </div>
            </div>

            {/* Financial Breakdown */}
            <div className="space-y-3 text-sm">
              <div className="flex justify-between text-muted-foreground">
                <span>Subtotal</span>
                <span className="font-mono text-foreground font-medium">
                  ${subtotal.toFixed(2)}
                </span>
              </div>

              <div className="flex justify-between text-muted-foreground">
                <span>White-Glove Assembly</span>
                <span className="font-mono text-foreground font-medium">
                  {isFreeShipping ? (
                    <span className="text-emerald-500 font-semibold">FREE</span>
                  ) : (
                    `$${shippingCost.toFixed(2)}`
                  )}
                </span>
              </div>

              <div className="flex justify-between text-muted-foreground">
                <span>Estimated Tax (8%)</span>
                <span className="font-mono text-foreground font-medium">
                  ${estimatedTax.toFixed(2)}
                </span>
              </div>

              <div className="border-t border-border/60 pt-3 flex justify-between text-base font-bold text-foreground">
                <span>Total Due</span>
                <span className="font-mono text-xl text-primary">
                  ${orderTotal.toFixed(2)}
                </span>
              </div>
            </div>

            {/* Checkout Action Button */}
            <div className="space-y-3 pt-2">
              <Button
                type="button"
                size="lg"
                onClick={handleCheckoutClick}
                className="w-full font-bold text-base shadow-md gap-2"
              >
                Proceed to Checkout
                <ArrowRight className="size-4" />
              </Button>

              {/* Milestone Notice */}
              {checkoutNotice && (
                <div className="rounded-xl border border-primary/40 bg-primary/10 p-3 text-xs text-primary animate-in fade-in duration-300">
                  <strong>Ready for Order Processing!</strong> The payment element and atomic database checkout will be configured in the next phase.
                </div>
              )}
            </div>

            {/* Trust Badges */}
            <div className="border-t border-border/60 pt-4 flex items-center justify-center gap-4 text-xs text-muted-foreground">
              <span className="flex items-center gap-1">
                <ShieldCheck className="size-4 text-primary" />
                SSL Encrypted
              </span>
              <span>•</span>
              <span>30-Day Guarantee</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
