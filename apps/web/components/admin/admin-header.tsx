"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Package,
  Truck,
  PlusCircle,
  Store,
  User,
  Menu,
  X,
  ExternalLink,
} from "lucide-react";
import { LogoutButton } from "@/features/auth/components/logout-button";

interface AdminHeaderProps {
  adminEmail?: string | null;
  adminName?: string | null;
}

export function AdminHeader({ adminEmail, adminName }: AdminHeaderProps) {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    {
      href: "/admin",
      label: "Overview",
      icon: LayoutDashboard,
      isActive: pathname === "/admin",
    },
    {
      href: "/admin/products",
      label: "Products",
      icon: Package,
      isActive: pathname.startsWith("/admin/products"),
    },
    {
      href: "/admin/orders",
      label: "Orders",
      icon: Truck,
      isActive: pathname.startsWith("/admin/orders"),
    },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-[#E5E2DC] bg-[#F8F6F2]/95 backdrop-blur-md">
      <div className="mx-auto flex h-16 sm:h-[72px] max-w-[1440px] items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Brand & Admin Badge */}
        <div className="flex items-center gap-4 sm:gap-6">
          <Link href="/admin" className="flex items-center gap-2 group">
            <span className="font-heading text-xl sm:text-2xl font-bold tracking-tight text-[#1A1A1A] transition-opacity group-hover:opacity-90">
              UrbanNest<span className="text-[#5D6B4D]">.</span>
            </span>
            <span className="inline-flex items-center rounded-full bg-[#5D6B4D] px-2.5 py-0.5 text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-white shadow-xs">
              Admin Console
            </span>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-1 pl-4 border-l border-[#E5E2DC]">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`inline-flex items-center gap-2 rounded-lg px-3.5 py-2 text-xs font-semibold transition-all ${
                    item.isActive
                      ? "bg-white text-[#1A1A1A] shadow-xs border border-[#E5E2DC]"
                      : "text-[#6B7280] hover:text-[#1A1A1A] hover:bg-[#F0EDE8]/60"
                  }`}
                >
                  <Icon className={`size-3.5 ${item.isActive ? "text-[#5D6B4D]" : "text-[#A3A3A3]"}`} />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Right Section: Storefront, User Info, Account, Sign Out */}
        <div className="hidden sm:flex items-center gap-2.5">
          <Link
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 rounded-lg border border-[#E5E2DC] bg-white px-3 py-1.5 text-xs font-medium text-[#1A1A1A] hover:bg-[#F0EDE8]/50 hover:border-[#D4C5A9] transition-all shadow-2xs"
            title="Open storefront in new tab"
          >
            <Store className="size-3.5 text-[#5D6B4D]" />
            <span>Storefront</span>
            <ExternalLink className="size-3 text-[#A3A3A3]" />
          </Link>

          <Link
            href="/profile"
            className="inline-flex items-center gap-1.5 rounded-lg border border-[#E5E2DC] bg-white px-3 py-1.5 text-xs font-medium text-[#1A1A1A] hover:bg-[#F0EDE8]/50 hover:border-[#D4C5A9] transition-all shadow-2xs"
          >
            <User className="size-3.5 text-[#6B7280]" />
            <span>{adminName || "Account"}</span>
          </Link>

          <LogoutButton
            variant="outline"
            className="rounded-lg border-[#E5E2DC] bg-white hover:bg-rose-50 hover:text-rose-700 hover:border-rose-200 text-xs px-3 py-1.5 h-auto font-medium transition-all shadow-2xs"
          />
        </div>

        {/* Mobile Hamburger Button */}
        <div className="flex sm:hidden items-center gap-2">
          <Link
            href="/"
            className="p-2 rounded-lg text-[#6B7280] hover:text-[#1A1A1A] hover:bg-[#F0EDE8]"
            title="View Store"
          >
            <Store className="size-4" />
          </Link>
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-lg border border-[#E5E2DC] bg-white text-[#1A1A1A] hover:bg-[#F0EDE8] transition-colors"
            aria-label="Toggle admin menu"
          >
            {mobileMenuOpen ? <X className="size-5" /> : <Menu className="size-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="sm:hidden border-t border-[#E5E2DC] bg-[#F8F6F2] px-4 pt-3 pb-5 space-y-3 animate-in slide-in-from-top duration-200">
          <div className="space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center justify-between rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                    item.isActive
                      ? "bg-white text-[#1A1A1A] border border-[#E5E2DC] shadow-xs"
                      : "text-[#6B7280] hover:text-[#1A1A1A] hover:bg-[#F0EDE8]"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className={`size-4 ${item.isActive ? "text-[#5D6B4D]" : "text-[#A3A3A3]"}`} />
                    <span>{item.label}</span>
                  </div>
                  {item.isActive && (
                    <span className="size-1.5 rounded-full bg-[#5D6B4D]" />
                  )}
                </Link>
              );
            })}
          </div>

          <div className="border-t border-[#E5E2DC] pt-3 flex flex-col gap-2">
            <Link
              href="/"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center justify-between rounded-lg border border-[#E5E2DC] bg-white px-3 py-2 text-xs font-medium text-[#1A1A1A]"
            >
              <span className="flex items-center gap-2">
                <Store className="size-3.5 text-[#5D6B4D]" />
                <span>Customer Storefront</span>
              </span>
              <ExternalLink className="size-3 text-[#A3A3A3]" />
            </Link>

            <Link
              href="/profile"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-2 rounded-lg border border-[#E5E2DC] bg-white px-3 py-2 text-xs font-medium text-[#1A1A1A]"
            >
              <User className="size-3.5 text-[#6B7280]" />
              <span>Account: {adminEmail || adminName || "Operations Lead"}</span>
            </Link>

            <div className="pt-1">
              <LogoutButton
                variant="outline"
                className="w-full justify-center rounded-lg border-[#E5E2DC] bg-white text-xs py-2 hover:bg-rose-50 hover:text-rose-700"
              />
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
