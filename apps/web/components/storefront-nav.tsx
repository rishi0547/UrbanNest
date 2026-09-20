import Link from "next/link";
import { Search, User, ShieldCheck, Package } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { CartBadge } from "@/features/cart/components/cart-badge";

const navLinks = [
  { href: "/", label: "Home", active: true },
  { href: "/products", label: "Shop" },
  { href: "/products?featured=true", label: "Collections" },
  { href: "#about", label: "About Us" },
  { href: "#inspiration", label: "Inspiration" },
  { href: "#contact", label: "Contact" },
];

export async function StorefrontNav() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  let isAdmin = false;
  if (user) {
    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .single();
    isAdmin = profile?.role === "admin";
  }

  return (
    <header className="sticky top-0 z-50 w-full bg-[#F8F6F2]/95 backdrop-blur-md border-b border-[#E5E2DC]/80 transition-colors">
      <div className="mx-auto flex h-20 max-w-[1280px] items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Brand */}
        <Link href="/" className="flex flex-col group shrink-0">
          <span className="font-heading text-2xl sm:text-[26px] font-bold tracking-tight text-[#1A1A1A]">
            UrbanNest<span className="text-[#5D6B4D]">.</span>
          </span>
          <span className="text-[9px] uppercase tracking-[0.28em] text-[#6B7280] -mt-1 font-medium">
            Furniture
          </span>
        </Link>

        {/* Center Navigation */}
        <nav className="hidden lg:flex items-center gap-1.5 xl:gap-2">
          {navLinks.map((link) =>
            link.active ? (
              <Link
                key={link.label}
                href={link.href}
                className="rounded-full bg-white border border-[#E5E2DC] px-4 py-1.5 text-xs font-semibold text-[#1A1A1A] shadow-2xs transition-all hover:border-[#5D6B4D]/30"
              >
                {link.label}
              </Link>
            ) : (
              <Link
                key={link.label}
                href={link.href}
                className="px-3.5 py-1.5 text-xs font-medium text-[#6B7280] hover:text-[#1A1A1A] transition-colors rounded-full hover:bg-white/60"
              >
                {link.label}
              </Link>
            )
          )}
          {user && (
            <Link
              href="/orders"
              className="px-3.5 py-1.5 text-xs font-medium text-[#6B7280] hover:text-[#1A1A1A] transition-colors flex items-center gap-1.5 rounded-full hover:bg-white/60"
            >
              <Package className="size-3.5" />
              Orders
            </Link>
          )}
          {isAdmin && (
            <Link
              href="/admin"
              className="px-3.5 py-1.5 text-xs font-semibold text-[#5D6B4D] hover:text-[#4E5A40] transition-colors flex items-center gap-1.5 bg-[#5D6B4D]/10 rounded-full"
            >
              <ShieldCheck className="size-3.5" />
              Admin
            </Link>
          )}
        </nav>

        {/* Right Actions */}
        <div className="flex items-center gap-1 sm:gap-2">
          <Link
            href="/products"
            className="inline-flex items-center justify-center size-10 rounded-full text-[#1A1A1A] hover:bg-white/80 transition-colors"
            title="Search catalog"
          >
            <Search className="size-[18px] stroke-[1.6]" />
          </Link>

          {user ? (
            <Link
              href="/profile"
              className="inline-flex items-center justify-center size-10 rounded-full text-[#1A1A1A] hover:bg-white/80 transition-colors"
              title="My Account"
            >
              <User className="size-[18px] stroke-[1.6]" />
            </Link>
          ) : (
            <Link
              href="/login"
              className="inline-flex items-center justify-center size-10 rounded-full text-[#1A1A1A] hover:bg-white/80 transition-colors"
              title="Sign In"
            >
              <User className="size-[18px] stroke-[1.6]" />
            </Link>
          )}

          <div className="pl-1">
            <CartBadge />
          </div>
        </div>
      </div>
    </header>
  );
}
