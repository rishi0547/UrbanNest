"use client";

import Link from "next/link";
import { ShoppingBag } from "lucide-react";
import { useCart } from "../cart-store";

export function CartBadge() {
  const { totalItems, isHydrated } = useCart();
  const count = isHydrated ? totalItems : 0;

  return (
    <Link
      href="/cart"
      className="relative inline-flex items-center justify-center size-9 rounded-lg border border-border bg-card/60 text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
      title={`Shopping Cart (${count} items)`}
    >
      <ShoppingBag className="size-4" />
      <span
        className={`absolute -top-1.5 -right-1.5 flex min-w-4 h-4 px-1 items-center justify-center rounded-full text-[10px] font-bold transition-all ${
          count > 0
            ? "bg-primary text-primary-foreground scale-100"
            : "bg-muted text-muted-foreground scale-90"
        }`}
      >
        {count}
      </span>
      <span className="sr-only">View Cart ({count} items)</span>
    </Link>
  );
}
