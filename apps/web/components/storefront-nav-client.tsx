"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Search,
  User,
  ShieldCheck,
  Package,
  Menu,
  X,
  ArrowRight,
  Heart,
  Truck,
  RotateCcw,
  Sparkles,
} from "lucide-react";
import { CartBadge } from "@/features/cart/components/cart-badge";

interface StorefrontNavClientProps {
  user: boolean;
  isAdmin: boolean;
}

export function StorefrontNavClient({ user, isAdmin }: StorefrontNavClientProps) {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Close mobile menu automatically on route change and restore scroll
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  // Lock body scroll when mobile menu drawer is open
  useEffect(() => {
    if (mobileMenuOpen) {
      const originalStyle = window.getComputedStyle(document.body).overflow;
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = originalStyle;
      };
    }
  }, [mobileMenuOpen]);

  const navLinks = [
    {
      href: "/",
      label: "Home",
      isActive: pathname === "/",
    },
    {
      href: "/products",
      label: "Shop",
      isActive: pathname === "/products" && !pathname.includes("featured"),
    },
    {
      href: "/products?featured=true",
      label: "Collections",
      isActive: pathname === "/products" && pathname.includes("featured"),
    },
  ];

  const isOrdersActive = pathname.startsWith("/orders");
  const isAdminActive = pathname.startsWith("/admin");
  const isProfileActive = pathname.startsWith("/profile");

  return (
    <header className="sticky top-0 z-50 w-full transition-colors">
      {/* ========================================================
          OPTIONAL REFINED ANNOUNCEMENT STRIP
          ======================================================== */}
      <div className="w-full bg-[#F0EDE8]/90 border-b border-[#E5E2DC]/80 text-[#6B7280] text-[11px] font-medium tracking-wide">
        <div className="w-full max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-9">
          {/* Desktop Left Messages */}
          <div className="hidden md:flex items-center gap-6">
            <span className="inline-flex items-center gap-1.5 text-[#1A1A1A]">
              <Truck className="size-3.5 text-[#5D6B4D]" /> Free Shipping on Orders Over ₹9,999
            </span>
            <span className="inline-flex items-center gap-1.5">
              <RotateCcw className="size-3.5 text-[#5D6B4D]" /> 30-Day Easy Returns
            </span>
          </div>

          {/* Mobile Centered Notice */}
          <div className="md:hidden flex items-center justify-center w-full">
            <span className="inline-flex items-center gap-1.5 text-[#1A1A1A] truncate">
              <Truck className="size-3.5 text-[#5D6B4D]" /> Free Shipping on Orders Over ₹9,999 • 30-Day Returns
            </span>
          </div>

          {/* Desktop Right Messages */}
          <div className="hidden md:flex items-center gap-6">
            <span className="inline-flex items-center gap-1.5">
              <ShieldCheck className="size-3.5 text-[#5D6B4D]" /> 100% Safe Payments
            </span>
            <span className="inline-flex items-center gap-1.5 text-[#5D6B4D]">
              <Sparkles className="size-3.5 text-[#5D6B4D]" /> Bespoke Design Concierge
            </span>
          </div>
        </div>
      </div>

      {/* ========================================================
          MAIN NAVBAR — MASTER 1440px CONTAINER
          ======================================================== */}
      <div className="w-full bg-[#F8F6F2]/95 backdrop-blur-md border-b border-[#E5E2DC]/80">
        <div className="w-full max-w-[1440px] mx-auto flex h-20 items-center justify-between px-4 sm:px-6 lg:px-8">
          {/* Brand Logo (Aligned to exact left boundary) */}
          <Link href="/" className="flex flex-col group shrink-0">
            <span className="font-heading text-2xl sm:text-[28px] font-bold tracking-tight text-[#1A1A1A] transition-opacity group-hover:opacity-90">
              UrbanNest<span className="text-[#5D6B4D]">.</span>
            </span>
            <span className="text-[9px] uppercase tracking-[0.28em] text-[#6B7280] -mt-1 font-medium">
              Furniture
            </span>
          </Link>

          {/* Desktop Navigation (Center) */}
          <nav className="hidden lg:flex items-center gap-1 xl:gap-2">
            {navLinks.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className={`px-4 py-2 text-xs uppercase tracking-wider font-semibold rounded-full transition-all duration-200 ${
                  link.isActive
                    ? "bg-white border border-[#E5E2DC] text-[#1A1A1A] shadow-2xs"
                    : "text-[#6B7280] hover:text-[#1A1A1A] hover:bg-white/60"
                }`}
              >
                {link.label}
              </Link>
            ))}

            {/* Logged in: Orders */}
            {user && (
              <Link
                href="/orders"
                className={`px-4 py-2 text-xs uppercase tracking-wider font-semibold rounded-full transition-all duration-200 flex items-center gap-1.5 ${
                  isOrdersActive
                    ? "bg-white border border-[#E5E2DC] text-[#1A1A1A] shadow-2xs"
                    : "text-[#6B7280] hover:text-[#1A1A1A] hover:bg-white/60"
                }`}
              >
                <Package className="size-3.5" />
                <span>Orders</span>
              </Link>
            )}

            {/* Admin only: Admin Dashboard */}
            {isAdmin && (
              <Link
                href="/admin"
                className={`px-4 py-2 text-xs uppercase tracking-wider font-bold rounded-full transition-all duration-200 flex items-center gap-1.5 ${
                  isAdminActive
                    ? "bg-[#5D6B4D] text-white shadow-2xs"
                    : "text-[#5D6B4D] hover:text-[#4E5A40] bg-[#5D6B4D]/10 hover:bg-[#5D6B4D]/20"
                }`}
              >
                <ShieldCheck className="size-3.5" />
                <span>Admin</span>
              </Link>
            )}
          </nav>

          {/* Right Actions (Aligned to exact right boundary) */}
          <div className="flex items-center gap-1 sm:gap-2">
            {/* Search */}
            <Link
              href="/products"
              className="inline-flex items-center justify-center size-10 rounded-full text-[#1A1A1A] hover:bg-white/80 transition-colors"
              title="Search catalog"
            >
              <Search className="size-[19px] stroke-[1.6]" />
              <span className="sr-only">Search</span>
            </Link>

            {/* Wishlist Link */}
            <Link
              href="/products?featured=true"
              className="inline-flex items-center justify-center size-10 rounded-full text-[#1A1A1A] hover:bg-white/80 transition-colors"
              title="Wishlist & Collections"
            >
              <Heart className="size-[19px] stroke-[1.6]" />
              <span className="sr-only">Wishlist</span>
            </Link>

            {/* Account / User */}
            {user ? (
              <Link
                href="/profile"
                className={`inline-flex items-center justify-center size-10 rounded-full transition-colors ${
                  isProfileActive
                    ? "bg-white text-[#5D6B4D] border border-[#E5E2DC] shadow-2xs"
                    : "text-[#1A1A1A] hover:bg-white/80"
                }`}
                title="My Account"
              >
                <User className="size-[19px] stroke-[1.6]" />
                <span className="sr-only">Profile</span>
              </Link>
            ) : (
              <Link
                href="/login"
                className="inline-flex items-center justify-center size-10 rounded-full text-[#1A1A1A] hover:bg-white/80 transition-colors"
                title="Sign In"
              >
                <User className="size-[19px] stroke-[1.6]" />
                <span className="sr-only">Sign In</span>
              </Link>
            )}

            {/* Cart Badge */}
            <div className="pl-0.5 sm:pl-1">
              <CartBadge />
            </div>

            {/* Mobile Hamburger Toggle */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden inline-flex items-center justify-center size-10 min-w-[40px] min-h-[40px] rounded-full text-[#1A1A1A] hover:bg-white/80 transition-colors ml-0.5"
              aria-label="Toggle navigation menu"
              aria-expanded={mobileMenuOpen}
            >
              {mobileMenuOpen ? (
                <X className="size-5 stroke-[1.8]" />
              ) : (
                <Menu className="size-5 stroke-[1.8]" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer / Dropdown */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-b border-[#E5E2DC] bg-[#F8F6F2] px-4 pt-3 pb-8 space-y-2 animate-in slide-in-from-top-2 duration-200 max-h-[calc(100vh-5rem)] overflow-y-auto shadow-lg">
          <div className="flex flex-col space-y-1.5">
            {/* Quick Search option in mobile drawer */}
            <Link
              href="/products"
              className="px-4 py-3 rounded-xl text-sm font-medium text-[#6B7280] hover:text-[#1A1A1A] hover:bg-white/60 transition-colors flex items-center justify-between min-h-[44px]"
            >
              <div className="flex items-center gap-2.5">
                <Search className="size-4 text-[#5D6B4D]" />
                <span>Search Catalog</span>
              </div>
              <ArrowRight className="size-4 text-[#6B7280]/60" />
            </Link>

            {navLinks.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className={`px-4 py-3 rounded-xl text-sm transition-colors flex items-center justify-between min-h-[44px] ${
                  link.isActive
                    ? "bg-white font-semibold text-[#1A1A1A] shadow-2xs border border-[#E5E2DC]"
                    : "font-medium text-[#6B7280] hover:text-[#1A1A1A] hover:bg-white/60"
                }`}
              >
                <span>{link.label}</span>
                {link.isActive && <ArrowRight className="size-4 text-[#5D6B4D]" />}
              </Link>
            ))}

            {user && (
              <Link
                href="/orders"
                className={`px-4 py-3 rounded-xl text-sm transition-colors flex items-center justify-between min-h-[44px] ${
                  isOrdersActive
                    ? "bg-white font-semibold text-[#1A1A1A] shadow-2xs border border-[#E5E2DC]"
                    : "font-medium text-[#6B7280] hover:text-[#1A1A1A] hover:bg-white/60"
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Package className="size-4" />
                  <span>My Orders</span>
                </div>
                {isOrdersActive && <ArrowRight className="size-4 text-[#5D6B4D]" />}
              </Link>
            )}

            {isAdmin && (
              <Link
                href="/admin"
                className={`px-4 py-3 rounded-xl text-sm font-semibold transition-colors flex items-center justify-between min-h-[44px] ${
                  isAdminActive
                    ? "bg-[#5D6B4D] text-white shadow-2xs"
                    : "text-[#5D6B4D] bg-[#5D6B4D]/10 hover:bg-[#5D6B4D]/20"
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <ShieldCheck className="size-4" />
                  <span>Admin Dashboard</span>
                </div>
                <ArrowRight className="size-4" />
              </Link>
            )}

            <div className="pt-2 border-t border-[#E5E2DC]/80">
              {user ? (
                <Link
                  href="/profile"
                  className="px-4 py-3 rounded-xl text-sm font-medium text-[#1A1A1A] hover:bg-white/60 flex items-center gap-2.5 min-h-[44px]"
                >
                  <User className="size-4 text-muted-foreground" />
                  <span>My Profile &amp; Account</span>
                </Link>
              ) : (
                <Link
                  href="/login"
                  className="px-4 py-3 rounded-xl text-sm font-semibold text-[#5D6B4D] bg-[#5D6B4D]/10 hover:bg-[#5D6B4D]/20 flex items-center justify-between min-h-[44px]"
                >
                  <span>Sign In / Create Account</span>
                  <ArrowRight className="size-4" />
                </Link>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
