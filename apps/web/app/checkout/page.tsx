import type { Metadata } from "next";
import { requireAuth } from "@/features/auth/roles";
import { StorefrontNav } from "@/components/storefront-nav";
import { CheckoutForm } from "@/features/orders/components/checkout-form";

export const metadata: Metadata = {
  title: "Checkout | UrbanNest Design Studio",
  description: "Complete your white-glove furniture delivery order with secure atomic verification.",
};

export const dynamic = "force-dynamic";

export default async function CheckoutPage() {
  const { user, profile } = await requireAuth();

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <StorefrontNav />

      <main className="container mx-auto max-w-7xl flex-1 px-4 sm:px-6 py-10 space-y-8">
        <div className="space-y-1 border-b border-border/60 pb-5">
          <div className="inline-flex items-center rounded-full border border-primary/20 bg-primary/10 px-3 py-0.5 text-xs font-semibold text-primary">
            White-Glove Delivery
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl text-foreground">
            Complete Your Order
          </h1>
          <p className="text-sm text-muted-foreground">
            Enter your destination coordinates and review your staged architectural furnishings.
          </p>
        </div>

        <CheckoutForm
          userEmail={user.email || ""}
          defaultName={profile?.full_name || ""}
        />
      </main>
    </div>
  );
}
