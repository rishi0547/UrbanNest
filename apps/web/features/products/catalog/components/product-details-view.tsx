"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  ArrowLeft,
  ShoppingBag,
  Truck,
  ShieldCheck,
  RotateCcw,
  Sparkles,
  Check,
  Package,
} from "lucide-react";
import { useProductBySlug } from "../queries";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useCart } from "@/features/cart";

interface ProductDetailsViewProps {
  slug: string;
}

export function ProductDetailsView({ slug }: ProductDetailsViewProps) {
  const { data: product, isLoading, isError } = useProductBySlug(slug);
  const { addItem } = useCart();

  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [cartNotice, setCartNotice] = useState(false);

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 animate-pulse py-8">
        <div className="aspect-square rounded-2xl bg-muted/60" />
        <div className="space-y-6">
          <div className="h-6 w-1/4 rounded bg-muted/70" />
          <div className="h-10 w-3/4 rounded bg-muted/90" />
          <div className="h-8 w-1/3 rounded bg-muted/80" />
          <div className="h-28 w-full rounded bg-muted/50" />
          <div className="h-12 w-full rounded bg-muted/70" />
        </div>
      </div>
    );
  }

  if (isError || !product) {
    return (
      <div className="rounded-2xl border border-border py-20 text-center space-y-4 max-w-md mx-auto">
        <Package className="size-12 mx-auto text-muted-foreground" />
        <h2 className="text-xl font-bold">Product not found</h2>
        <p className="text-sm text-muted-foreground">
          The requested furniture piece could not be located in our catalog.
        </p>
        <Link href="/products">
          <Button variant="outline">
            <ArrowLeft className="size-4 mr-2" />
            Back to Catalog
          </Button>
        </Link>
      </div>
    );
  }

  const images = product.images && product.images.length > 0 ? product.images : [];
  const currentImage = images[selectedImageIndex] || null;
  const isOutOfStock = product.stock <= 0;
  const isLowStock = product.stock > 0 && product.stock <= 5;

  const handleAddToCartClick = () => {
    addItem(
      {
        id: product.id,
        productId: product.id,
        title: product.title,
        slug: product.slug,
        price: Number(product.price),
        image: currentImage || "",
        stock: product.stock,
        categoryName: product.category?.name,
      },
      quantity
    );

    setCartNotice(true);
    setTimeout(() => setCartNotice(false), 5000);
  };

  return (
    <div className="space-y-8">
      {/* Breadcrumb Navigation */}
      <nav className="flex items-center gap-2 text-xs text-muted-foreground">
        <Link href="/" className="hover:text-foreground transition-colors">
          Home
        </Link>
        <span>/</span>
        <Link href="/products" className="hover:text-foreground transition-colors">
          Catalog
        </Link>
        {product.category && (
          <>
            <span>/</span>
            <span className="text-foreground font-medium">
              {product.category.name}
            </span>
          </>
        )}
      </nav>

      {/* Main Showcase Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 xl:gap-16">
        {/* Left Column: Image Gallery */}
        <div className="space-y-4">
          {/* Main Large Image */}
          <div className="relative aspect-square w-full overflow-hidden rounded-2xl border border-border/70 bg-muted/30 shadow-xs">
            {currentImage ? (
              <Image
                src={currentImage}
                alt={product.title}
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover transition-all duration-300"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center text-muted-foreground">
                <Package className="size-16" />
              </div>
            )}

            {/* Badges on Image */}
            <div className="absolute top-4 left-4 flex flex-wrap gap-2">
              {product.category && (
                <Badge variant="secondary" className="bg-background/80 backdrop-blur-md shadow-xs">
                  {product.category.name}
                </Badge>
              )}
              {product.is_featured && (
                <Badge className="bg-amber-500 hover:bg-amber-500 text-white font-semibold shadow-xs">
                  <Sparkles className="size-3 mr-1" />
                  Curated Pick
                </Badge>
              )}
            </div>
          </div>

          {/* Interactive Thumbnail Row */}
          {images.length > 1 && (
            <div className="flex items-center gap-3 overflow-x-auto pb-2 scrollbar-none">
              {images.map((imgUrl, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setSelectedImageIndex(idx)}
                  className={`relative size-20 shrink-0 overflow-hidden rounded-xl border-2 transition-all ${
                    selectedImageIndex === idx
                      ? "border-primary ring-2 ring-primary/30"
                      : "border-border/60 opacity-70 hover:opacity-100"
                  }`}
                >
                  <Image
                    src={imgUrl}
                    alt={`${product.title} view ${idx + 1}`}
                    fill
                    sizes="80px"
                    className="object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right Column: Commercial Details & Purchase Panel */}
        <div className="flex flex-col space-y-6">
          <div className="space-y-2">
            <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl text-foreground">
              {product.title}
            </h1>
            <div className="flex items-center gap-3 text-xs text-muted-foreground">
              <span className="font-mono">REF: {product.slug}</span>
              <span>•</span>
              <span className="flex items-center text-amber-500 font-medium">
                ★★★★★ <span className="ml-1 text-muted-foreground">(4.9 from 84 owners)</span>
              </span>
            </div>
          </div>

          {/* Price Header */}
          <div className="flex items-baseline gap-3 border-y border-border/60 py-4">
            <span className="text-3xl font-bold tracking-tight text-foreground">
              ${Number(product.price).toFixed(2)}
            </span>
            {product.compare_at_price &&
              Number(product.compare_at_price) > Number(product.price) && (
                <span className="text-lg text-muted-foreground line-through">
                  ${Number(product.compare_at_price).toFixed(2)}
                </span>
              )}
            {product.compare_at_price &&
              Number(product.compare_at_price) > Number(product.price) && (
                <Badge variant="success" className="text-xs font-semibold">
                  Save ${(Number(product.compare_at_price) - Number(product.price)).toFixed(0)}
                </Badge>
              )}
          </div>

          {/* Stock Status Notification */}
          <div>
            {isOutOfStock ? (
              <div className="rounded-lg border border-destructive/30 bg-destructive/10 p-3 text-xs font-semibold text-destructive">
                This item is currently sold out. Restocking anticipated soon.
              </div>
            ) : isLowStock ? (
              <div className="flex items-center gap-2 text-xs font-medium text-amber-500">
                <span className="size-2 rounded-full bg-amber-500 animate-ping" />
                Only {product.stock} units remaining in studio inventory.
              </div>
            ) : (
              <div className="flex items-center gap-2 text-xs font-medium text-emerald-600 dark:text-emerald-400">
                <span className="size-2 rounded-full bg-emerald-500" />
                In Stock &amp; Ready for White-Glove Shipping
              </div>
            )}
          </div>

          {/* Detailed Description */}
          <div className="space-y-2">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
              Design Overview
            </h3>
            <p className="text-sm leading-relaxed text-foreground whitespace-pre-line">
              {product.description}
            </p>
          </div>

          {/* Actions Panel */}
          <div className="space-y-4 pt-2">
            <div className="flex items-center gap-4">
              {/* Quantity Picker */}
              <div className="flex items-center rounded-lg border border-border bg-card">
                <button
                  type="button"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  disabled={isOutOfStock || quantity <= 1}
                  className="px-3 py-2 text-sm text-muted-foreground hover:text-foreground disabled:opacity-40 transition-colors"
                >
                  -
                </button>
                <span className="px-3 py-2 text-sm font-semibold text-foreground min-w-8 text-center">
                  {quantity}
                </span>
                <button
                  type="button"
                  onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                  disabled={isOutOfStock || quantity >= product.stock}
                  className="px-3 py-2 text-sm text-muted-foreground hover:text-foreground disabled:opacity-40 transition-colors"
                >
                  +
                </button>
              </div>

              {/* Add to Cart Placeholder Button */}
              <Button
                type="button"
                size="lg"
                onClick={handleAddToCartClick}
                disabled={isOutOfStock}
                className="flex-1 font-semibold text-base shadow-md gap-2"
              >
                <ShoppingBag className="size-5" />
                {isOutOfStock ? "Sold Out" : `Add to Cart • $${(Number(product.price) * quantity).toFixed(2)}`}
              </Button>
            </div>

            {/* Added to Cart Success Notice */}
            {cartNotice && (
              <div className="rounded-xl border border-primary/40 bg-primary/10 p-3.5 text-xs text-primary flex items-center justify-between gap-3 animate-in fade-in slide-in-from-top-2 duration-300">
                <div className="flex items-center gap-2 min-w-0">
                  <Check className="size-4 shrink-0 text-primary" />
                  <span className="truncate">
                    Added <strong>{quantity} &times; {product.title}</strong> to your cart!
                  </span>
                </div>
                <Link href="/cart">
                  <Button size="xs" variant="default" className="font-semibold text-xs h-7 px-3 shrink-0">
                    View Cart
                  </Button>
                </Link>
              </div>
            )}
          </div>

          {/* Value Propositions / Trust Badges */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 border-t border-border/60 pt-6">
            <div className="flex items-center gap-2.5 rounded-xl border border-border/50 bg-card/40 p-3">
              <Truck className="size-5 text-primary shrink-0" />
              <div className="text-[11px] leading-tight">
                <strong className="block text-foreground font-semibold">White-Glove</strong>
                <span className="text-muted-foreground">In-home assembly</span>
              </div>
            </div>

            <div className="flex items-center gap-2.5 rounded-xl border border-border/50 bg-card/40 p-3">
              <RotateCcw className="size-5 text-primary shrink-0" />
              <div className="text-[11px] leading-tight">
                <strong className="block text-foreground font-semibold">30-Day Trial</strong>
                <span className="text-muted-foreground">Effortless returns</span>
              </div>
            </div>

            <div className="flex items-center gap-2.5 rounded-xl border border-border/50 bg-card/40 p-3">
              <ShieldCheck className="size-5 text-primary shrink-0" />
              <div className="text-[11px] leading-tight">
                <strong className="block text-foreground font-semibold">5-Yr Warranty</strong>
                <span className="text-muted-foreground">Solid craftsmanship</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
