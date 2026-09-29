"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  ShieldCheck,
  Truck,
  ArrowRight,
  Package,
  Loader2,
  AlertCircle,
  CreditCard,
  X,
  AlertTriangle,
} from "lucide-react";
import { useCart } from "@/features/cart";
import { shippingAddressSchema, type ShippingAddressInput } from "../schemas";
import { createOrderAction } from "../actions";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatINR } from "@/utils/currency";
import { SafeProductImage } from "@/components/ProductImageFallback";
import { createClient } from "@/lib/supabase/client";

interface CheckoutFormProps {
  userEmail: string;
  defaultName?: string;
}

export function CheckoutForm({ userEmail, defaultName = "" }: CheckoutFormProps) {
  const router = useRouter();
  const { items, subtotal, clearCart, removeItem, isHydrated } = useCart();
  const [serverError, setServerError] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const FREE_SHIPPING_THRESHOLD = 9999;
  const isFreeShipping = subtotal >= FREE_SHIPPING_THRESHOLD;
  const shippingCost = isFreeShipping || subtotal === 0 ? 0 : 999;
  const tax = Math.round(subtotal * 0.08);
  const totalAmount = Math.round(subtotal + shippingCost + tax);

  // Validate cart items against database on mount and automatically remove invalid entries
  useEffect(() => {
    if (!isHydrated || items.length === 0) return;

    let isMounted = true;

    async function validateCartProducts() {
      const supabase = createClient();
      const UUID_REGEX = /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/;

      const invalidFormatItems = items.filter(
        (item) => !item.productId || !UUID_REGEX.test(item.productId)
      );

      const validUuids = items
        .filter((item) => item.productId && UUID_REGEX.test(item.productId))
        .map((item) => item.productId);

      const missingItemIds: string[] = invalidFormatItems.map((i) => i.productId || i.id);

      if (validUuids.length > 0) {
        const { data: dbProducts } = await supabase
          .from("products")
          .select("id, title, price, stock, is_published")
          .in("id", validUuids);

        const foundMap = new Map((dbProducts || []).map((p) => [p.id, p]));

        for (const item of items) {
          const matchedProduct = foundMap.get(item.productId);

          if (!matchedProduct || !matchedProduct.is_published) {
            missingItemIds.push(item.productId);
          }
        }
      }

      if (!isMounted) return;

      if (missingItemIds.length > 0) {
        const uniqueMissing = Array.from(new Set(missingItemIds));
        uniqueMissing.forEach((id) => removeItem(id));
        setToastMessage("Some unavailable products were removed from your cart.");
      }
    }

    validateCartProducts();

    return () => {
      isMounted = false;
    };
  }, [isHydrated, items, removeItem]);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ShippingAddressInput>({
    resolver: zodResolver(shippingAddressSchema),
    defaultValues: {
      full_name: defaultName,
      phone: "",
      address_line1: "",
      address_line2: "",
      city: "",
      state: "",
      postal_code: "",
    },
  });

  const onSubmit = async (shippingData: ShippingAddressInput) => {
    setServerError(null);

    if (items.length === 0) {
      setServerError("Your cart is empty. Please add products before checking out.");
      return;
    }

    // Pre-flight validation to catch any non-UUID or corrupted item before sending
    const UUID_REGEX = /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/;
    const invalidItems = items.filter(
      (item) => !item.productId || !UUID_REGEX.test(item.productId)
    );

    if (invalidItems.length > 0) {
      invalidItems.forEach((i) => removeItem(i.productId || i.id));
      setToastMessage("Some unavailable products were removed from your cart.");
      setServerError("Some invalid items were removed from your cart. Please review your order.");
      return;
    }

    try {
      const orderPayload = {
        shipping: shippingData,
        items: items.map((item) => ({
          productId: item.productId,
          quantity: item.quantity,
        })),
      };

      const result = await createOrderAction(orderPayload);

      if (!result.success) {
        setServerError(result.error || "Failed to place order. Please try again.");
        return;
      }

      // Clear the local Zustand shopping cart
      clearCart();

      // Redirect to luxury order success page with order details
      const params = new URLSearchParams();
      if (result.orderId) params.set("orderId", result.orderId);
      if (result.orderNumber) params.set("orderNumber", result.orderNumber);
      router.push(`/order-success?${params.toString()}`);
    } catch {
      setServerError("An unexpected network error occurred while placing your order.");
    }
  };

  if (!isHydrated) {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 py-8 animate-pulse">
        <div className="lg:col-span-2 space-y-4">
          <div className="h-64 rounded-xl bg-muted/60" />
        </div>
        <div className="h-80 rounded-xl bg-muted/60" />
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <Card className="max-w-md mx-auto py-12 text-center border-dashed">
        <CardContent className="space-y-4">
          <Package className="size-12 mx-auto text-muted-foreground" />
          <h2 className="text-xl font-bold">Your cart is empty</h2>
          <p className="text-xs text-muted-foreground">
            You must have at least one furniture piece in your cart to proceed with checkout.
          </p>
          <Link href="/products">
            <Button className="mt-2">Explore Catalog</Button>
          </Link>
        </CardContent>
      </Card>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
      {toastMessage && (
        <div className="rounded-xl border border-amber-300 bg-amber-50 p-4 text-xs font-medium text-amber-900 flex items-center justify-between gap-3 animate-in fade-in-50 duration-200">
          <div className="flex items-center gap-2.5">
            <AlertTriangle className="size-4 shrink-0 text-amber-600" />
            <span>{toastMessage}</span>
          </div>
          <button
            type="button"
            onClick={() => setToastMessage(null)}
            className="text-amber-700 hover:text-amber-950 p-1 cursor-pointer"
            aria-label="Dismiss message"
          >
            <X className="size-3.5" />
          </button>
        </div>
      )}

      {serverError && (
        <div className="rounded-xl border border-destructive/40 bg-destructive/10 p-4 text-xs font-medium text-destructive flex items-center gap-2.5">
          <AlertCircle className="size-4 shrink-0" />
          <span>{serverError}</span>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 xl:gap-12">
        {/* Left 2 Columns: Shipping Address & White-Glove Instructions */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="border-border/70 bg-card/60 backdrop-blur-xs">
            <CardHeader className="pb-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <CardTitle className="text-xl">1. Shipping Details</CardTitle>
                <Badge variant="outline" className="text-xs font-normal truncate max-w-full">
                  Signed in as {userEmail}
                </Badge>
              </div>
              <CardDescription>
                Where should our white-glove logistics team deliver and assemble your furniture?
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Full Name & Phone Number */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label htmlFor="full_name">Full Name</Label>
                  <Input
                    id="full_name"
                    placeholder="Eleanor Vance"
                    disabled={isSubmitting}
                    {...register("full_name")}
                  />
                  {errors.full_name && (
                    <p className="text-xs text-destructive">{errors.full_name.message}</p>
                  )}
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input
                    id="phone"
                    placeholder="+1 (555) 234-5678"
                    disabled={isSubmitting}
                    {...register("phone")}
                  />
                  {errors.phone && (
                    <p className="text-xs text-destructive">{errors.phone.message}</p>
                  )}
                </div>
              </div>

              {/* Address Line 1 */}
              <div className="space-y-1.5">
                <Label htmlFor="address_line1">Address Line 1</Label>
                <Input
                  id="address_line1"
                  placeholder="742 Evergreen Terrace"
                  disabled={isSubmitting}
                  {...register("address_line1")}
                />
                {errors.address_line1 && (
                  <p className="text-xs text-destructive">{errors.address_line1.message}</p>
                )}
              </div>

              {/* Address Line 2 */}
              <div className="space-y-1.5">
                <Label htmlFor="address_line2">
                  Address Line 2 <span className="text-muted-foreground font-normal text-xs">(Optional)</span>
                </Label>
                <Input
                  id="address_line2"
                  placeholder="Suite 400, Floor 2, or Gate Code"
                  disabled={isSubmitting}
                  {...register("address_line2")}
                />
                {errors.address_line2 && (
                  <p className="text-xs text-destructive">{errors.address_line2.message}</p>
                )}
              </div>

              {/* City, State, Postal Code */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="space-y-1.5">
                  <Label htmlFor="city">City</Label>
                  <Input
                    id="city"
                    placeholder="San Francisco"
                    disabled={isSubmitting}
                    {...register("city")}
                  />
                  {errors.city && (
                    <p className="text-xs text-destructive">{errors.city.message}</p>
                  )}
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="state">State</Label>
                  <Input
                    id="state"
                    placeholder="California"
                    disabled={isSubmitting}
                    {...register("state")}
                  />
                  {errors.state && (
                    <p className="text-xs text-destructive">{errors.state.message}</p>
                  )}
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="postal_code">Postal Code</Label>
                  <Input
                    id="postal_code"
                    placeholder="94107"
                    disabled={isSubmitting}
                    {...register("postal_code")}
                  />
                  {errors.postal_code && (
                    <p className="text-xs text-destructive">{errors.postal_code.message}</p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Simulated Payment Method Card */}
          <Card className="border-border/70 bg-card/60 backdrop-blur-xs">
            <CardHeader className="pb-3">
              <CardTitle className="text-xl">2. Payment &amp; Billing</CardTitle>
              <CardDescription>
                Capstone demo simulation mode: Orders are verified and persisted directly in PostgreSQL.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="rounded-xl border border-primary/30 bg-primary/5 p-4 flex items-center gap-3">
                <CreditCard className="size-6 text-primary shrink-0" />
                <div className="text-xs space-y-0.5">
                  <strong className="block text-foreground font-semibold">
                    Direct White-Glove In-Home Invoicing
                  </strong>
                  <span className="text-muted-foreground">
                    No upfront card required for demo. An atomic order record with inventory reconciliation will be generated upon submission.
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right 1 Column: Cart Review & Order Summary */}
        <div className="space-y-6">
          <Card className="border-border/70 bg-card shadow-xs">
            <CardHeader className="pb-4 border-b border-border/60">
              <CardTitle className="text-lg">Order Items ({items.length})</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 pt-4">
              {/* Item thumbnails list */}
              <div className="space-y-3 max-h-60 overflow-y-auto pr-1">
                {items.map((item) => (
                  <div key={item.productId} className="flex items-center gap-3 text-xs">
                    <div className="relative size-12 rounded-lg overflow-hidden border border-border bg-muted/40 shrink-0">
                      <SafeProductImage
                        src={item.image}
                        alt={item.title}
                        fill
                        sizes="48px"
                        className="object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-semibold text-foreground truncate">{item.title}</div>
                      <div className="text-muted-foreground font-mono">
                        Qty: {item.quantity} &times; {formatINR(item.price)}
                      </div>
                    </div>
                    <div className="font-mono font-medium text-foreground shrink-0">
                      {formatINR(item.price * item.quantity)}
                    </div>
                  </div>
                ))}
              </div>

              {/* Financial Totals */}
              <div className="border-t border-border/60 pt-4 space-y-2.5 text-xs">
                <div className="flex justify-between text-muted-foreground">
                  <span>Subtotal</span>
                  <span className="font-mono text-foreground font-medium">
                    {formatINR(subtotal)}
                  </span>
                </div>

                <div className="flex justify-between text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Truck className="size-3 text-primary" />
                    White-Glove Delivery
                  </span>
                  <span className="font-mono text-foreground font-medium">
                    {isFreeShipping ? (
                      <span className="text-emerald-500 font-semibold">FREE</span>
                    ) : (
                      formatINR(shippingCost)
                    )}
                  </span>
                </div>

                <div className="flex justify-between text-muted-foreground">
                  <span>Estimated Tax (8%)</span>
                  <span className="font-mono text-foreground font-medium">
                    {formatINR(tax)}
                  </span>
                </div>

                <div className="border-t border-border/60 pt-3 flex justify-between text-sm font-bold text-foreground">
                  <span>Total Due</span>
                  <span className="font-mono text-lg text-primary">
                    {formatINR(totalAmount)}
                  </span>
                </div>
              </div>

              {/* Submit Order Action Button */}
              <Button
                type="submit"
                size="lg"
                disabled={isSubmitting}
                className="w-full font-bold text-sm shadow-md gap-2 mt-4"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="size-4 animate-spin" />
                    Securing Order &amp; Stock...
                  </>
                ) : (
                  <>
                    Place Order • {formatINR(totalAmount)}
                    <ArrowRight className="size-4" />
                  </>
                )}
              </Button>

              <div className="text-[11px] text-muted-foreground text-center flex items-center justify-center gap-1.5 pt-2">
                <ShieldCheck className="size-3.5 text-primary" />
                Atomic stock reduction &amp; order tracking
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </form>
  );
}
