import { getFeaturedProducts } from "@/features/products/catalog/api";
import { createClient } from "@/lib/supabase/server";
import { StorefrontNav } from "@/components/storefront-nav";
import { HeroSection } from "@/components/home/hero-section";
import { CategoriesSection } from "@/components/home/categories-section";
import { FeaturedCollection } from "@/components/home/featured-collection";
import { PromoBanner } from "@/components/home/promo-banner";
import { TrustBadges } from "@/components/home/trust-badges";
import { InspirationSection } from "@/components/home/inspiration-section";
import { NewsletterSection } from "@/components/home/newsletter-section";
import { SiteFooter } from "@/components/home/site-footer";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const supabase = await createClient();
  const featuredProducts = await getFeaturedProducts(4, supabase);

  return (
    <div className="min-h-screen flex flex-col bg-[#F8F6F2]">
      <StorefrontNav />

      <main className="flex-1">
        <HeroSection />
        <CategoriesSection />
        <FeaturedCollection products={featuredProducts} />
        <PromoBanner />
        <TrustBadges />
        <InspirationSection />
        <NewsletterSection />
      </main>

      <SiteFooter />
    </div>
  );
}
