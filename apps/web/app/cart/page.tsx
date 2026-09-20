import type { Metadata } from "next";
import { CartView } from "@/features/cart/components/cart-view";
import { StorefrontNav } from "@/components/storefront-nav";

export const metadata: Metadata = {
  title: "Shopping Cart | UrbanNest Design Studio",
  description:
    "Review your selected handcrafted modern furniture pieces, adjust quantities, and calculate white-glove delivery.",
};

export const dynamic = "force-dynamic";

export default function CartPage() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <StorefrontNav />

      <main className="container mx-auto max-w-7xl flex-1 px-4 sm:px-6 py-10">
        <CartView />
      </main>
    </div>
  );
}
