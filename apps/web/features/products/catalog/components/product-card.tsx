import Link from "next/link";
import Image from "next/image";
import { Package, Sparkles } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import type { CatalogProduct } from "../types";

interface ProductCardProps {
  product: CatalogProduct;
}

export function ProductCard({ product }: ProductCardProps) {
  const thumbnail = product.images?.[0];
  const isOutOfStock = product.stock <= 0;
  const isLowStock = product.stock > 0 && product.stock <= 5;

  return (
    <div className="group relative flex flex-col overflow-hidden rounded-xl border border-border/70 bg-card text-card-foreground shadow-xs transition-all duration-300 hover:border-primary/40 hover:shadow-lg">
      {/* Image Container with Badges */}
      <Link
        href={`/products/${product.slug}`}
        className="relative aspect-4/3 w-full overflow-hidden bg-muted/40"
      >
        {thumbnail ? (
          <Image
            src={thumbnail}
            alt={product.title}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-muted-foreground">
            <Package className="size-10" />
          </div>
        )}

        {/* Floating Badges */}
        <div className="absolute top-3 left-3 flex flex-wrap gap-1.5 z-10">
          {product.category && (
            <Badge
              variant="secondary"
              className="bg-background/80 backdrop-blur-md text-[11px] font-medium shadow-xs"
            >
              {product.category.name}
            </Badge>
          )}
          {product.is_featured && (
            <Badge
              variant="default"
              className="gap-1 bg-amber-500/90 hover:bg-amber-500 text-white text-[11px] font-semibold shadow-xs"
            >
              <Sparkles className="size-3" />
              Featured
            </Badge>
          )}
        </div>

        {/* Out of Stock Overlay */}
        {isOutOfStock && (
          <div className="absolute inset-0 z-20 flex items-center justify-center bg-background/70 backdrop-blur-[2px]">
            <span className="rounded-md border border-destructive/40 bg-destructive/90 px-3 py-1 text-xs font-bold uppercase tracking-wider text-white shadow-md">
              Sold Out
            </span>
          </div>
        )}
      </Link>

      {/* Product Information */}
      <div className="flex flex-1 flex-col p-4">
        {/* Title */}
        <Link href={`/products/${product.slug}`} className="block">
          <h3 className="font-semibold text-base tracking-tight text-foreground transition-colors group-hover:text-primary line-clamp-1">
            {product.title}
          </h3>
        </Link>

        {/* Description snippet */}
        <p className="mt-1 text-xs text-muted-foreground line-clamp-2 leading-relaxed">
          {product.description}
        </p>

        {/* Spacer */}
        <div className="flex-1" />

        {/* Pricing & Stock Footer */}
        <div className="mt-4 flex items-baseline justify-between border-t border-border/50 pt-3">
          <div className="flex items-baseline gap-2">
            <span className="text-lg font-bold tracking-tight text-foreground">
              ${Number(product.price).toFixed(2)}
            </span>
            {product.compare_at_price &&
              Number(product.compare_at_price) > Number(product.price) && (
                <span className="text-xs text-muted-foreground line-through">
                  ${Number(product.compare_at_price).toFixed(2)}
                </span>
              )}
          </div>

          {/* Stock Status Pill */}
          <div>
            {isOutOfStock ? (
              <span className="text-[11px] font-semibold text-destructive">
                Out of Stock
              </span>
            ) : isLowStock ? (
              <span className="text-[11px] font-semibold text-amber-500">
                Only {product.stock} left
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 text-[11px] font-medium text-emerald-600 dark:text-emerald-400">
                <span className="size-1.5 rounded-full bg-emerald-500 animate-pulse" />
                In Stock
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
