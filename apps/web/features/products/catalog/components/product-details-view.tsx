"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Package } from "lucide-react";
import { useProductBySlug } from "../queries";
import { Button } from "@/components/ui/button";
import { ProductGallery } from "./product-gallery";
import { ProductInfoPanel, COLOR_SWATCHES } from "./product-info-panel";
import { ProductTrustBadges } from "./product-trust-badges";
import { ProductTabsSection } from "./product-tabs-section";
import { RelatedProductsSection } from "./related-products-section";
import { StickyPurchaseBar } from "./sticky-purchase-bar";

interface ProductDetailsViewProps {
  slug: string;
}

export function ProductDetailsView({ slug }: ProductDetailsViewProps) {
  const { data: product, isLoading, isError } = useProductBySlug(slug);
  const [selectedColorHex, setSelectedColorHex] = useState(COLOR_SWATCHES[0]!.hex);
  const [activeTab, setActiveTab] = useState("description");

  if (isLoading) {
    return (
      <div className="w-full space-y-16 animate-pulse py-8">
        {/* Top 55/45 Skeleton */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-start">
          <div className="lg:col-span-7 aspect-[4/3] rounded-3xl bg-[#E5E2DC]/50" />
          <div className="lg:col-span-5 space-y-6">
            <div className="h-5 w-1/3 rounded-full bg-[#E5E2DC]/60" />
            <div className="h-12 w-4/5 rounded-xl bg-[#E5E2DC]/80" />
            <div className="h-8 w-1/4 rounded-lg bg-[#E5E2DC]/70" />
            <div className="h-28 w-full rounded-2xl bg-[#E5E2DC]/40" />
            <div className="h-14 w-full rounded-full bg-[#E5E2DC]/60" />
          </div>
        </div>
      </div>
    );
  }

  if (isError || !product) {
    return (
      <div className="rounded-3xl border border-[#E5E2DC] bg-white p-16 text-center space-y-5 max-w-lg mx-auto shadow-sm">
        <div className="size-16 rounded-full bg-[#F8F6F2] border border-[#E5E2DC] flex items-center justify-center mx-auto text-[#6B7280]">
          <Package className="size-8" />
        </div>
        <h2 className="font-heading text-2xl font-normal text-[#1A1A1A]">
          Furniture Piece Not Found
        </h2>
        <p className="text-sm text-[#6B7280] font-light leading-relaxed">
          The requested luxury piece could not be located in our active catalog, or may have been archived.
        </p>
        <Link href="/products" className="inline-block pt-2">
          <Button className="rounded-full bg-[#5D6B4D] hover:bg-[#4E5A40] text-white px-6">
            <ArrowLeft className="size-4 mr-2" />
            Return to Collection
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="w-full">
      {/* 1. Main 2-Column Showcase (55% Gallery / 45% Information Panel) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 xl:gap-16 items-start">
        {/* Left: 55% Image Gallery (7 cols out of 12) */}
        <div className="lg:col-span-7">
          <ProductGallery
            product={product}
            selectedColorHex={selectedColorHex}
          />
        </div>

        {/* Right: 45% Product Information Panel (5 cols out of 12) */}
        <div className="lg:col-span-5">
          <ProductInfoPanel
            product={product}
            onTabSelect={(tabId) => {
              setActiveTab(tabId);
              const tabElement = document.getElementById("product-tabs-section");
              if (tabElement) {
                tabElement.scrollIntoView({ behavior: "smooth" });
              }
            }}
            selectedColorHex={selectedColorHex}
            onColorChange={setSelectedColorHex}
          />
        </div>
      </div>

      {/* 2. Full-Width Trust Badges Strip (Target: 32px below Showcase) */}
      <div className="mt-8">
        <ProductTrustBadges />
      </div>

      {/* 3. Product Information Tabs Section (Target: 48px below Trust Badges) */}
      <div id="product-tabs-section" className="mt-12">
        <ProductTabsSection
          product={product}
          activeTab={activeTab}
          onTabChange={setActiveTab}
        />
      </div>

      {/* 4. Related Products ("You May Also Like") (Target: 80px below Tabs, 64px before Footer) */}
      <div className="mt-16 lg:mt-20 pb-12 sm:pb-16">
        <RelatedProductsSection currentProduct={product} />
      </div>

      {/* 5. Sticky Purchase Bar on Scroll */}
      <StickyPurchaseBar
        product={product}
        selectedColorHex={selectedColorHex}
      />
    </div>
  );
}
