import Link from "next/link";

const footerLinks = {
  shop: [
    { href: "/products", label: "All Products" },
    { href: "/products?category=living-room", label: "Sofas & Couches" },
    { href: "/products?category=living-room", label: "Chairs" },
    { href: "/products?category=dining-room", label: "Tables" },
    { href: "/products?category=bedroom", label: "Beds" },
    { href: "/products?category=home-office", label: "Storage" },
  ],
  company: [
    { href: "#about", label: "About Us" },
    { href: "#about", label: "Our Story" },
    { href: "#about", label: "Sustainability" },
    { href: "#about", label: "Careers" },
    { href: "#about", label: "Press" },
  ],
  service: [
    { href: "#contact", label: "Contact Us" },
    { href: "#contact", label: "Shipping & Delivery" },
    { href: "#contact", label: "Returns & Refunds" },
    { href: "#contact", label: "FAQs" },
    { href: "/orders", label: "Track Order" },
  ],
};

export function SiteFooter() {
  return (
    <footer className="bg-[#F8F6F2] border-t border-[#E5E2DC] pt-20 pb-16 lg:pt-28 lg:pb-20 text-[#1A1A1A]">
      <div className="mx-auto max-w-[1280px] px-4 sm:px-6 lg:px-8">
        {/* Four Column Balanced Layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          {/* Column 1: Brand Statement (4 cols) */}
          <div className="lg:col-span-4 space-y-6">
            <Link href="/" className="inline-block">
              <span className="font-heading text-2xl sm:text-3xl font-bold tracking-tight text-[#1A1A1A]">
                UrbanNest<span className="text-[#5D6B4D]">.</span>
              </span>
              <span className="block text-[9px] uppercase tracking-[0.3em] text-[#6B7280] -mt-0.5 font-medium">
                Furniture
              </span>
            </Link>

            <p className="text-sm text-[#6B7280] leading-relaxed font-light max-w-sm">
              Timeless furniture, thoughtfully designed for modern living.
              Sustainably harvested solid hardwoods, organic textiles, and
              enduring craftsmanship.
            </p>

            {/* Social Icons */}
            <div className="flex items-center gap-2.5 pt-2">
              <a
                href="#"
                className="size-9 rounded-full border border-[#E5E2DC] bg-white flex items-center justify-center text-[#1A1A1A] hover:bg-[#F0EDE8] hover:border-[#5D6B4D]/40 transition-colors shadow-2xs"
                title="Instagram"
              >
                <svg className="size-3.5 fill-current" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                </svg>
              </a>
              <a
                href="#"
                className="size-9 rounded-full border border-[#E5E2DC] bg-white flex items-center justify-center text-[#1A1A1A] hover:bg-[#F0EDE8] hover:border-[#5D6B4D]/40 transition-colors shadow-2xs"
                title="Facebook"
              >
                <svg className="size-3.5 fill-current" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                </svg>
              </a>
              <a
                href="#"
                className="size-9 rounded-full border border-[#E5E2DC] bg-white flex items-center justify-center text-[#1A1A1A] hover:bg-[#F0EDE8] hover:border-[#5D6B4D]/40 transition-colors shadow-2xs"
                title="Pinterest"
              >
                <svg className="size-3.5 fill-current" viewBox="0 0 24 24">
                  <path d="M12 0C5.373 0 0 5.373 0 12c0 5.084 3.163 9.426 7.627 11.174-.105-.949-.2-2.405.042-3.441.218-.937 1.407-5.965 1.407-5.965s-.359-.719-.359-1.782c0-1.668.967-2.914 2.171-2.914 1.023 0 1.518.769 1.518 1.69 0 1.029-.655 2.568-.994 3.995-.283 1.194.599 2.169 1.777 2.169 2.133 0 3.772-2.249 3.772-5.495 0-2.873-2.064-4.882-5.012-4.882-3.414 0-5.418 2.561-5.418 5.207 0 1.031.397 2.138.893 2.738.098.119.112.224.083.345-.09.375-.291 1.199-.332 1.365-.053.22-.174.267-.402.161-1.499-.698-2.436-2.889-2.436-4.649 0-3.785 2.75-7.262 7.929-7.262 4.163 0 7.398 2.967 7.398 6.931 0 4.136-2.607 7.464-6.227 7.464-1.216 0-2.359-.631-2.75-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146C9.57 23.812 10.763 24 12 24c6.627 0 12-5.373 12-12 0-6.627-5.373-12-12-12z" />
                </svg>
              </a>
              <a
                href="#"
                className="size-9 rounded-full border border-[#E5E2DC] bg-white flex items-center justify-center text-[#1A1A1A] hover:bg-[#F0EDE8] hover:border-[#5D6B4D]/40 transition-colors shadow-2xs"
                title="X / Twitter"
              >
                <svg className="size-3.5 fill-current" viewBox="0 0 24 24">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
              </a>
            </div>
          </div>

          {/* Column 2: Shop (2 cols) */}
          <div className="lg:col-span-2">
            <h4 className="text-xs font-semibold uppercase tracking-[0.2em] text-[#1A1A1A] mb-5">
              Shop
            </h4>
            <ul className="space-y-3">
              {footerLinks.shop.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-xs sm:text-[13px] text-[#6B7280] hover:text-[#1A1A1A] transition-colors font-light"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Company (2 cols) */}
          <div className="lg:col-span-2">
            <h4 className="text-xs font-semibold uppercase tracking-[0.2em] text-[#1A1A1A] mb-5">
              Company
            </h4>
            <ul className="space-y-3">
              {footerLinks.company.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-xs sm:text-[13px] text-[#6B7280] hover:text-[#1A1A1A] transition-colors font-light"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 4: Customer Service & Need Help (4 cols) */}
          <div className="lg:col-span-4 grid grid-cols-1 sm:grid-cols-2 gap-8 lg:gap-10">
            <div>
              <h4 className="text-xs font-semibold uppercase tracking-[0.2em] text-[#1A1A1A] mb-5">
                Service
              </h4>
              <ul className="space-y-3">
                {footerLinks.service.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-xs sm:text-[13px] text-[#6B7280] hover:text-[#1A1A1A] transition-colors font-light"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="text-xs font-semibold uppercase tracking-[0.2em] text-[#1A1A1A] mb-5">
                Concierge
              </h4>
              <div className="space-y-2.5 text-xs sm:text-[13px] text-[#6B7280] font-light">
                <p className="hover:text-[#1A1A1A] transition-colors cursor-pointer">
                  hello@urbannest.com
                </p>
                <p className="hover:text-[#1A1A1A] transition-colors cursor-pointer">
                  +1 (800) 123-4567
                </p>
                <p className="text-[11px] text-[#6B7280]/80 pt-1">
                  Mon - Fri: 9am - 6pm EST
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar with Generous Margin */}
        <div className="border-t border-[#E5E2DC] mt-16 lg:mt-24 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#6B7280] font-light">
          <p>© {new Date().getFullYear()} UrbanNest Furniture. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <Link href="#" className="hover:text-[#1A1A1A] transition-colors">
              Privacy Policy
            </Link>
            <Link href="#" className="hover:text-[#1A1A1A] transition-colors">
              Terms of Service
            </Link>
            <Link href="#" className="hover:text-[#1A1A1A] transition-colors">
              Cookies Settings
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
