"use client";

import { useState } from "react";
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
} from "lucide-react";
import { useCart } from "@/features/cart";
import { shippingAddressSchema, type ShippingAddressInput } from "../schemas";
import { createOrderAction } from "../actions";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface CheckoutFormProps {
  userEmail: string;
  defaultName?: string;
}

export function CheckoutForm({ userEmail, defaultName = "" }: CheckoutFormProps) {
  const router = useRouter();
  const { items, subtotal, clearCart, isHydrated } = useCart();
  const [serverError, setServerError] = useState<string | null>(null);

  const FREE_SHIPPING_THRESHOLD = 500;
  const isFreeShipping = subtotal >= FREE_SHIPPING_THRESHOLD;
  const shippingCost = isFreeShipping || subtotal === 0 ? 0 : 49;
  const tax = Math.round(subtotal * 0.08 * 100) / 100;
  const totalAmount = Math.round((subtotal + shippingCost + tax) * 100) / 100;

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ShippingAddressInput>({
    resolver: zodResolver(shippingAddressSchema),
    defaultValues: {
      full_name: defaultName,
      phone: "",
      address: "",
      city: "",
      state: "",
      pincode: "",
    },
  });

  const onSubmit = async (shippingData: ShippingAddressInput) => {
    setServerError(null);

    if (items.length === 0) {
      setServerError("Your cart is empty. Please add products before checking out.");
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

      // Redirect to customer orders page with celebration query flag
      router.push("/orders?placed=true");
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
              <div className="flex items-center justify-between">
                <CardTitle className="text-xl">1. Delivery Destination</CardTitle>
                <Badge variant="outline" className="text-xs font-normal">
                  Signed in as {userEmail}
                </Badge>
              </div>
              <CardDescription>
                Where should our white-glove logistics team deliver and assemble your furniture?
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Full Name & Phone */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label htmlFor="full_name">Recipient Full Name</Label>
                  <Input
                    id="full_name"
                    placeholder="Jane Doe"
                    disabled={isSubmitting}
                    {...register("full_name")}
                  />
                  {errors.full_name && (
                    <p className="text-xs text-destructive">{errors.full_name.message}</p>
                  )}
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="phone">Contact Phone</Label>
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

              {/* Street Address */}
              <div className="space-y-1.5">
                <Label htmlFor="address">Street Address &amp; Suite</Label>
                <Input
                  id="address"
                  placeholder="742 Evergreen Terrace, Apt 4B"
                  disabled={isSubmitting}
                  {...register("address")}
                />
                {errors.address && (
                  <p className="text-xs text-destructive">{errors.address.message}</p>
                )}
              </div>

              {/* City, State, Pincode */}
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
                  <Label htmlFor="state">State / Province</Label>
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
                  <Label htmlFor="pincode">Postal Code / ZIP</Label>
                  <Input
                    id="pincode"
                    placeholder="94107"
                    disabled={isSubmitting}
                    {...register("pincode")}
                  />
                  {errors.pincode && (
                    <p className="text-xs text-destructive">{errors.pincode.message}</p>
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
                      {item.image ? (
                        <Image
                          src={item.image}
                          alt={item.title}
                          fill
                          sizes="48px"
                          className="object-cover"
                        />
                      ) : (
                        <Package className="size-5 m-auto text-muted-foreground" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-semibold text-foreground truncate">{item.title}</div>
                      <div className="text-muted-foreground font-mono">
                        Qty: {item.quantity} &times; ${item.price.toFixed(2)}
                      </div>
                    </div>
                    <div className="font-mono font-medium text-foreground shrink-0">
                      ${(item.price * item.quantity).toFixed(2)}
                    </div>
                  </div>
                ))}
              </div>

              {/* Financial Totals */}
              <div className="border-t border-border/60 pt-4 space-y-2.5 text-xs">
                <div className="flex justify-between text-muted-foreground">
                  <span>Subtotal</span>
                  <span className="font-mono text-foreground font-medium">
                    ${subtotal.toFixed(2)}
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
                      `$${shippingCost.toFixed(2)}`
                    )}
                  </span>
                </div>

                <div className="flex justify-between text-muted-foreground">
                  <span>Estimated Tax (8%)</span>
                  <span className="font-mono text-foreground font-medium">
                    ${tax.toFixed(2)}
                  </span>
                </div>

                <div className="border-t border-border/60 pt-3 flex justify-between text-sm font-bold text-foreground">
                  <span>Total Due</span>
                  <span className="font-mono text-lg text-primary">
                    ${totalAmount.toFixed(2)}
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
                    Place Order • ${totalAmount.toFixed(2)}
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
