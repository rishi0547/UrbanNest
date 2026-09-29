import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

interface AuthLayoutProps {
  imageSrc: string;
  imageAlt: string;
  quote: string;
  subquote: string;
  badge?: string;
  eyebrow?: string;
  title: string;
  description: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
}

export function AuthLayout({
  imageSrc,
  imageAlt,
  quote,
  subquote,
  badge = "ATELIER COLLECTION",
  eyebrow = "URBANNEST",
  title,
  description,
  children,
  footer,
}: AuthLayoutProps) {
  return (
    <div className="min-h-screen lg:h-screen w-full flex flex-col lg:flex-row bg-[#F8F6F2] overflow-x-hidden selection:bg-[#5D6B4D]/20 selection:text-[#1A1A1A]">
      {/* ========================================================
          LEFT COLUMN — DESKTOP ARCHITECTURAL HERO (53% Viewport)
          ======================================================== */}
      <section className="relative hidden lg:flex lg:w-[53%] h-full shrink-0 overflow-hidden bg-[#1A1A1A] text-white flex-col justify-between p-10 lg:p-12 xl:p-16 select-none">
        <Image
          src={imageSrc}
          alt={imageAlt}
          fill
          priority
          sizes="(min-width: 1024px) 53vw, 100vw"
          className="object-cover object-center transition-transform duration-1000 ease-out hover:scale-[1.02]"
        />

        {/* Architectural Vignette & Editorial Scrim */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/35 to-black/20 pointer-events-none" />

        {/* Top Left Branding — Aligned via consistent container padding */}
        <div className="relative z-10">
          <Link href="/" className="inline-flex flex-col group">
            <span className="font-heading text-3xl font-bold tracking-tight text-white transition-opacity group-hover:opacity-90">
              UrbanNest<span className="text-[#8B9E83]">.</span>
            </span>
            <span className="text-[10px] uppercase tracking-[0.3em] text-[#D4C5A9] font-medium -mt-1">
              Handcrafted Living
            </span>
          </Link>
        </div>

        {/* Bottom Editorial Content Block — Elevated 8-12vh from bottom, width limited to ~560px */}
        <div className="relative z-10 max-w-[560px] w-full mb-4 xl:mb-8">
          <div className="inline-block px-3.5 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/15 text-[10px] uppercase tracking-[0.25em] font-medium text-white/90 mb-5">
            {badge}
          </div>
          <h2 className="font-heading text-[2.2rem] sm:text-[2.6rem] lg:text-[3rem] xl:text-[3.4rem] text-white font-normal leading-[1.05] tracking-tight">
            &ldquo;{quote}&rdquo;
          </h2>
          <p className="mt-4 text-sm sm:text-base text-white/80 font-normal tracking-wide leading-relaxed max-w-[460px]">
            {subquote}
          </p>
        </div>
      </section>

      {/* ========================================================
          MOBILE HERO BANNER (< lg viewports, 200–230px)
          ======================================================== */}
      <section className="relative block lg:hidden w-full h-[200px] sm:h-[230px] overflow-hidden bg-[#1A1A1A] text-white shrink-0">
        <Image
          src={imageSrc}
          alt={imageAlt}
          fill
          priority
          sizes="100vw"
          className="object-cover object-center"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/45 to-black/40" />

        <div className="relative z-10 flex flex-col justify-between h-full p-5 sm:p-6">
          <div className="flex items-center justify-between">
            <Link href="/" className="inline-flex flex-col">
              <span className="font-heading text-2xl font-bold tracking-tight text-white">
                UrbanNest<span className="text-[#8B9E83]">.</span>
              </span>
            </Link>
            <Link
              href="/"
              className="inline-flex items-center gap-1.5 text-xs text-white/90 bg-white/10 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-white/20 hover:bg-white/20 transition-colors"
            >
              <ArrowLeft className="size-3" />
              <span>Shop</span>
            </Link>
          </div>

          <div>
            <span className="text-[9px] uppercase tracking-[0.22em] text-[#D4C5A9] font-medium block mb-1">
              {badge}
            </span>
            <p className="font-heading text-base sm:text-lg text-white font-normal tracking-tight line-clamp-1">
              {quote}
            </p>
          </div>
        </div>
      </section>

      {/* ========================================================
          RIGHT COLUMN — MASTER AUTHENTICATION PANEL (47% Viewport)
          ======================================================== */}
      <section className="w-full lg:w-[47%] h-full flex flex-col px-5 py-6 sm:px-10 sm:py-8 lg:px-12 xl:px-16 overflow-y-auto bg-[#F8F6F2]">
        {/* Unified Master Content Container (max-width: 460px) */}
        <div className="w-full max-w-[460px] mx-auto flex flex-col justify-between min-h-full">
          {/* Top Header Row — Perfectly aligned to left & right edges of 460px container */}
          <header className="hidden lg:flex items-center justify-between w-full pb-8 sm:pb-10 lg:pb-12 pt-2 sm:pt-4">
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-xs font-medium text-[#6B7280] hover:text-[#1A1A1A] transition-colors group"
            >
              <ArrowLeft className="size-3.5 transition-transform group-hover:-translate-x-1" />
              <span>Return to storefront</span>
            </Link>

            <Link href="/" className="inline-flex items-center group">
              <span className="font-heading text-lg font-bold tracking-tight text-[#1A1A1A] transition-opacity group-hover:opacity-80">
                UrbanNest<span className="text-[#5D6B4D]">.</span>
              </span>
            </Link>
          </header>

          {/* Form Content Area */}
          <div className="w-full flex-1 pt-2 sm:pt-4 lg:pt-0">
            {/* Editorial Heading Hierarchy */}
            <div className="text-left mb-8 sm:mb-9">
              <span className="text-[11px] font-semibold tracking-[0.25em] uppercase text-[#5D6B4D] mb-3.5 block">
                {eyebrow}
              </span>
              <h1 className="font-heading text-[32px] sm:text-[38px] lg:text-[44px] text-[#1A1A1A] font-normal tracking-tight leading-[1.08]">
                {title}
              </h1>
              <p className="mt-3 sm:mt-3.5 text-xs sm:text-sm text-[#6B7280] font-normal leading-relaxed max-w-[420px]">
                {description}
              </p>
            </div>

            {/* Form Fields */}
            <div className="w-full">{children}</div>

            {/* Bottom Auth Links */}
            {footer && <div className="w-full">{footer}</div>}
          </div>

          {/* Bottom Copyright Notice */}
          <footer className="w-full pt-8 pb-4 text-center sm:text-left">
            <p className="text-[11px] text-[#9CA3AF] tracking-wide">
              UrbanNest Handcrafted Living &copy; {new Date().getFullYear()}. All rights reserved.
            </p>
          </footer>
        </div>
      </section>
    </div>
  );
}
