import Link from "next/link";
import { Mail, Phone, MapPin, Clock } from "lucide-react";

const footerLinks = {
  shop: [
    { href: "/products", label: "All Products" },
    { href: "/products?category=living-room", label: "Sofas & Couches" },
    { href: "/products?category=living-room", label: "Chairs & Lounges" },
    { href: "/products?category=dining-room", label: "Dining Tables" },
    { href: "/products?category=bedroom", label: "Beds & Nightstands" },
    { href: "/products?category=storage", label: "Storage & Sideboards" },
  ],
  company: [
    { href: "/products", label: "About Us" },
    { href: "/products?featured=true", label: "Our Story" },
    { href: "/products?featured=true", label: "Sustainability" },
    { href: "/products", label: "Collections" },
    { href: "/products", label: "Lookbook" },
  ],
  service: [
    { href: "/orders", label: "Track Your Order" },
    { href: "/profile", label: "My Account" },
    { href: "/orders", label: "Returns & Exchanges" },
    { href: "/products", label: "Shipping Policy" },
    { href: "mailto:hello@urbannest.com", label: "Contact Us" },
  ],
};

export function SiteFooter() {
  return (
    <footer className="bg-[#F8F6F2] border-t border-[#E5E2DC] pt-12 sm:pt-16 pb-12 text-[#1A1A1A]">
      {/* Unified 1440px Master Container */}
      <div className="w-full max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
        {/* 5-Column Balanced Grid Inspired by Reference */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8 lg:gap-10 pb-12 border-b border-[#E5E2DC]">
          {/* Column 1: Brand & Bio (4 cols) */}
          <div className="lg:col-span-4 space-y-4 pr-0 lg:pr-6">
            <Link href="/" className="inline-block">
              <span className="font-heading text-2xl sm:text-[28px] font-bold tracking-tight text-[#1A1A1A]">
                UrbanNest<span className="text-[#5D6B4D]">.</span>
              </span>
              <span className="block text-[9px] uppercase tracking-[0.3em] text-[#6B7280] -mt-1 font-medium">
                Furniture &amp; Living
              </span>
            </Link>

            <p className="text-xs sm:text-sm text-[#6B7280] leading-relaxed font-light max-w-sm">
              Thoughtfully designed handcrafted furniture and decor to help you
              create a sanctuary you truly love. Sustainably harvested hardwoods
              and timeless craftsmanship.
            </p>

            {/* Social Icons */}
            <div className="flex items-center gap-2 pt-2">
              <a
                href="#"
                className="size-8.5 rounded-full border border-[#E5E2DC] bg-white flex items-center justify-center text-[#1A1A1A] hover:bg-[#5D6B4D] hover:text-white hover:border-[#5D6B4D] transition-colors shadow-2xs"
                title="Instagram"
              >
                <svg className="size-3.5 fill-current" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                </svg>
              </a>
              <a
                href="#"
                className="size-8.5 rounded-full border border-[#E5E2DC] bg-white flex items-center justify-center text-[#1A1A1A] hover:bg-[#5D6B4D] hover:text-white hover:border-[#5D6B4D] transition-colors shadow-2xs"
                title="Pinterest"
              >
                <svg className="size-3.5 fill-current" viewBox="0 0 24 24">
                  <path d="M12 0C5.373 0 0 5.373 0 12c0 5.084 3.163 9.426 7.627 11.174-.105-.949-.2-2.405.042-3.441.218-.937 1.407-5.965 1.407-5.965s-.359-.719-.359-1.782c0-1.668.967-2.914 2.171-2.914 1.023 0 1.518.769 1.518 1.69 0 1.029-.655 2.568-.994 3.995-.283 1.194.599 2.169 1.777 2.169 2.133 0 3.772-2.249 3.772-5.495 0-2.873-2.064-4.882-5.012-4.882-3.414 0-5.418 2.561-5.418 5.207 0 1.031.397 2.138.893 2.738.098.119.112.224.083.345-.09.375-.291 1.199-.332 1.365-.053.22-.174.267-.402.161-1.499-.698-2.436-2.889-2.436-4.649 0-3.785 2.75-7.262 7.929-7.262 4.163 0 7.398 2.967 7.398 6.931 0 4.136-2.607 7.464-6.227 7.464-1.216 0-2.359-.631-2.75-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146C9.57 23.812 10.763 24 12 24c6.627 0 12-5.373 12-12 0-6.627-5.373-12-12-12z" />
                </svg>
              </a>
              <a
                href="#"
                className="size-8.5 rounded-full border border-[#E5E2DC] bg-white flex items-center justify-center text-[#1A1A1A] hover:bg-[#5D6B4D] hover:text-white hover:border-[#5D6B4D] transition-colors shadow-2xs"
                title="X"
              >
                <svg className="size-3.5 fill-current" viewBox="0 0 24 24">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
              </a>
            </div>
          </div>

          {/* Column 2: Shop (2 cols) */}
          <div className="lg:col-span-2">
            <h4 className="text-xs font-semibold uppercase tracking-[0.2em] text-[#1A1A1A] mb-4">
              Shop
            </h4>
            <ul className="space-y-2.5">
              {footerLinks.shop.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-xs sm:text-sm text-[#6B7280] hover:text-[#5D6B4D] transition-colors font-light"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Customer Care (2 cols) */}
          <div className="lg:col-span-2">
            <h4 className="text-xs font-semibold uppercase tracking-[0.2em] text-[#1A1A1A] mb-4">
              Customer Care
            </h4>
            <ul className="space-y-2.5">
              {footerLinks.service.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-xs sm:text-sm text-[#6B7280] hover:text-[#5D6B4D] transition-colors font-light"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 4: Company (2 cols) */}
          <div className="lg:col-span-2">
            <h4 className="text-xs font-semibold uppercase tracking-[0.2em] text-[#1A1A1A] mb-4">
              Company
            </h4>
            <ul className="space-y-2.5">
              {footerLinks.company.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-xs sm:text-sm text-[#6B7280] hover:text-[#5D6B4D] transition-colors font-light"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 5: Concierge / Contact (2 cols) */}
          <div className="lg:col-span-2 space-y-3">
            <h4 className="text-xs font-semibold uppercase tracking-[0.2em] text-[#1A1A1A] mb-4">
              Contact Us
            </h4>
            <div className="space-y-2 text-xs text-[#6B7280]">
              <p className="flex items-center gap-2">
                <Mail className="size-3.5 text-[#5D6B4D] shrink-0" />
                <span>hello@urbannest.com</span>
              </p>
              <p className="flex items-center gap-2">
                <Phone className="size-3.5 text-[#5D6B4D] shrink-0" />
                <span>+91 98765 43210</span>
              </p>
              <p className="flex items-start gap-2">
                <MapPin className="size-3.5 text-[#5D6B4D] shrink-0 mt-0.5" />
                <span>Indiranagar, Bangalore</span>
              </p>
              <p className="flex items-center gap-2">
                <Clock className="size-3.5 text-[#5D6B4D] shrink-0" />
                <span>Mon-Sat: 10AM - 8PM</span>
              </p>
            </div>
          </div>
        </div>

        {/* Bottom Legal & Payment Badges */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#6B7280]">
          <p>
            &copy; {new Date().getFullYear()} UrbanNest Furniture. All rights reserved.
          </p>

          {/* Payment Method Badges */}
          <div className="flex items-center gap-2.5 font-mono text-[10px] uppercase tracking-wider text-[#9CA3AF]">
            <span className="px-2 py-0.5 bg-white border border-[#E5E2DC] rounded">Visa</span>
            <span className="px-2 py-0.5 bg-white border border-[#E5E2DC] rounded">Mastercard</span>
            <span className="px-2 py-0.5 bg-white border border-[#E5E2DC] rounded">UPI</span>
            <span className="px-2 py-0.5 bg-white border border-[#E5E2DC] rounded">RuPay</span>
            <span className="px-2 py-0.5 bg-white border border-[#E5E2DC] rounded">NetBanking</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
