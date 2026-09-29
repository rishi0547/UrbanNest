import type { Metadata } from "next";
import Link from "next/link";
import { CheckCircle2, ArrowRight, ShoppingBag, Truck, ShieldCheck, Sparkles } from "lucide-react";
import { StorefrontNav } from "@/components/storefront-nav";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Order Confirmed",
  description: "Thank you for your order. Your luxury furniture acquisition has been registered.",
  robots: {
    index: false,
    follow: false,
  },
};

interface OrderSuccessPageProps {
  searchParams: Promise<{
    orderId?: string;
    orderNumber?: string;
  }>;
}

export default async function OrderSuccessPage({ searchParams }: OrderSuccessPageProps) {
  const { orderId, orderNumber } = await searchParams;
  const displayId = orderNumber || orderId || "UN-CONFIRMED";

  return (
    <div className="min-h-screen flex flex-col bg-background selection:bg-primary/20">
      <StorefrontNav />

      <main className="container mx-auto max-w-4xl flex-1 px-4 sm:px-6 py-12 md:py-20 flex flex-col items-center justify-center text-center">
        {/* Decorative Luxury Badge */}
        <div className="relative mb-8">
          <div className="absolute -inset-4 rounded-full bg-emerald-500/10 blur-xl animate-pulse" />
          <div className="relative size-20 rounded-full border border-emerald-500/30 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shadow-lg shadow-emerald-500/5">
            <CheckCircle2 className="size-10 stroke-[1.75]" />
          </div>
        </div>

        {/* Header Text */}
        <div className="space-y-3 max-w-2xl">
          <div className="inline-flex items-center gap-1.5 rounded-full border border-primary/20 bg-primary/5 px-3.5 py-1 text-xs font-medium text-primary tracking-wide">
            <Sparkles className="size-3" />
            <span>White-Glove Order Confirmed</span>
          </div>

          <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl font-normal tracking-tight text-foreground">
            Thank You for Your Order
          </h1>

          <p className="text-base sm:text-lg text-muted-foreground font-light leading-relaxed">
            Your acquisition has been safely received. Our master craftspeople and white-glove logistics team are carefully preparing your furniture for delivery.
          </p>
        </div>

        {/* Order Identifier Card */}
        <div className="mt-8 w-full max-w-md rounded-2xl border border-border/80 bg-card/70 backdrop-blur-sm p-6 shadow-sm">
          <div className="text-xs uppercase tracking-widest text-muted-foreground font-medium">
            Order Reference
          </div>
          <div className="mt-1 font-mono text-xl sm:text-2xl font-bold tracking-tight text-foreground select-all break-all">
            {displayId}
          </div>
          <p className="mt-3 text-xs text-muted-foreground leading-relaxed">
            An order confirmation with delivery tracking and assembly guides has been sent to your email.
          </p>

          <div className="mt-5 grid grid-cols-2 gap-3 pt-5 border-t border-border/60 text-left text-xs text-muted-foreground">
            <div className="flex items-center gap-2">
              <Truck className="size-4 text-primary shrink-0" />
              <span>Insured White-Glove Transit</span>
            </div>
            <div className="flex items-center gap-2">
              <ShieldCheck className="size-4 text-primary shrink-0" />
              <span>10-Year Warranty Protected</span>
            </div>
          </div>
        </div>

        {/* Primary Action Buttons */}
        <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4 w-full max-w-md">
          {orderId ? (
            <Link href={`/orders/${orderId}`} className="w-full sm:w-auto flex-1">
              <Button
                variant="default"
                size="lg"
                className="w-full font-medium tracking-wide shadow-md gap-2 h-12 text-sm"
              >
                <span>View Order Details</span>
                <ArrowRight className="size-4" />
              </Button>
            </Link>
          ) : (
            <Link href="/orders" className="w-full sm:w-auto flex-1">
              <Button
                variant="default"
                size="lg"
                className="w-full font-medium tracking-wide shadow-md gap-2 h-12 text-sm"
              >
                <span>View All Orders</span>
                <ArrowRight className="size-4" />
              </Button>
            </Link>
          )}

          <Link href="/products" className="w-full sm:w-auto flex-1">
            <Button
              variant="outline"
              size="lg"
              className="w-full font-medium tracking-wide gap-2 h-12 text-sm border-border/80"
            >
              <ShoppingBag className="size-4" />
              <span>Continue Shopping</span>
            </Button>
          </Link>
        </div>

        {/* Assistance Help text */}
        <p className="mt-12 text-xs text-muted-foreground">
          Need adjustments to your delivery address? Contact our concierge at{" "}
          <span className="text-foreground underline underline-offset-4">concierge@urbannest.design</span>
        </p>
      </main>
    </div>
  );
}
