"use client";

import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useRef,
} from "react";
import { usePathname } from "next/navigation";
import { BrandLoader } from "@/components/ui/brand-loader";

interface PageTransitionContextValue {
  isNavigating: boolean;
}

const PageTransitionContext = createContext<PageTransitionContextValue>({
  isNavigating: false,
});

export function usePageTransition() {
  return useContext(PageTransitionContext);
}

export function PageTransitionProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [isNavigating, setIsNavigating] = useState(false);
  const [isExiting, setIsExiting] = useState(false);
  const currentPathRef = useRef(pathname);

  // Monitor pathname changes to trigger the smooth exit animation
  useEffect(() => {
    if (isNavigating && pathname !== currentPathRef.current) {
      currentPathRef.current = pathname;
      // Start editorial exit sequence
      setIsExiting(true);
      const exitTimer = setTimeout(() => {
        setIsNavigating(false);
        setIsExiting(false);
      }, 350); // Exact exit animation duration (300-450ms)

      return () => clearTimeout(exitTimer);
    } else {
      currentPathRef.current = pathname;
    }
  }, [pathname, isNavigating]);

  // Intercept legitimate internal navigation link clicks
  useEffect(() => {
    const handleLinkClick = (e: MouseEvent) => {
      // Ignore modified clicks or non-primary mouse buttons
      if (
        e.defaultPrevented ||
        e.button !== 0 ||
        e.metaKey ||
        e.ctrlKey ||
        e.shiftKey ||
        e.altKey
      ) {
        return;
      }

      // Find closest anchor tag
      const anchor = (e.target as HTMLElement)?.closest("a");
      if (!anchor) return;

      // Ignore links with target="_blank", download, or explicit bypass
      if (
        anchor.hasAttribute("download") ||
        anchor.getAttribute("target") === "_blank" ||
        anchor.getAttribute("data-no-transition") === "true"
      ) {
        return;
      }

      const href = anchor.getAttribute("href");
      if (!href) return;

      // Ignore hash links, mailto, tel, or javascript:
      if (
        href.startsWith("#") ||
        href.startsWith("mailto:") ||
        href.startsWith("tel:") ||
        href.startsWith("javascript:")
      ) {
        return;
      }

      try {
        const url = new URL(anchor.href, window.location.href);

        // Verify same origin
        if (url.origin === window.location.origin) {
          // Strictly trigger ONLY when navigating to a DIFFERENT route pathname.
          // This guarantees it will NEVER trigger for:
          // - sorting or filtering on the same page (e.g. /products?sort=price)
          // - wishlist toggles, cart updates, dropdowns, or modals
          if (url.pathname !== window.location.pathname) {
            setIsExiting(false);
            setIsNavigating(true);
          }
        }
      } catch {
        // Safe catch for any malformed URLs
      }
    };

    document.addEventListener("click", handleLinkClick, { capture: true });

    return () => {
      document.removeEventListener("click", handleLinkClick, { capture: true });
    };
  }, []);

  // Safety fallback: ensure loader dismisses gracefully if navigation stalls
  useEffect(() => {
    if (isNavigating) {
      const fallbackTimer = setTimeout(() => {
        setIsExiting(true);
        setTimeout(() => {
          setIsNavigating(false);
          setIsExiting(false);
        }, 350);
      }, 5000);

      return () => clearTimeout(fallbackTimer);
    }
  }, [isNavigating]);

  return (
    <PageTransitionContext.Provider value={{ isNavigating }}>
      {children}
      {isNavigating && (
        <BrandLoader fullscreen isExiting={isExiting} />
      )}
    </PageTransitionContext.Provider>
  );
}
