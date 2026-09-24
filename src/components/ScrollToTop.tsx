"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";

export default function ScrollToTop() {
  const pathname = usePathname();
  const prevPathnameRef = useRef<string | null>(null);

  // Set manual scroll restoration on mount so browser doesn't retain old scroll positions
  useEffect(() => {
    if (typeof window === "undefined") return;

    if ("scrollRestoration" in window.history) {
      window.history.scrollRestoration = "manual";
    }

    const resetToTop = () => {
      window.scrollTo({ top: 0, left: 0, behavior: "instant" as ScrollBehavior });
      document.documentElement.scrollTop = 0;
      document.body.scrollTop = 0;
    };

    // Reset on initial load/refresh and browser history navigation (back/forward)
    resetToTop();
    window.addEventListener("popstate", resetToTop);
    window.addEventListener("pageshow", resetToTop);

    // Global click listener: when user clicks a link to the current route, smoothly return to top
    const handleDocumentClick = (e: MouseEvent) => {
      const target = (e.target as HTMLElement).closest("a");
      if (!target) return;

      const href = target.getAttribute("href");
      if (!href) return;

      // Ignore hash anchors (e.g. #services), external links, or protocol links
      if (href.startsWith("#") || href.startsWith("tel:") || href.startsWith("mailto:") || href.startsWith("http")) {
        return;
      }

      // Check if clicking link to current pathname (e.g. on /about clicking /about, or on / clicking /)
      try {
        const url = new URL(target.href, window.location.origin);
        if (
          url.origin === window.location.origin &&
          url.pathname === window.location.pathname &&
          !url.hash
        ) {
          e.preventDefault();
          window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
        }
      } catch {
        // Fallback simple match
        if (href === window.location.pathname) {
          e.preventDefault();
          window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
        }
      }
    };

    document.addEventListener("click", handleDocumentClick);

    return () => {
      window.removeEventListener("popstate", resetToTop);
      window.removeEventListener("pageshow", resetToTop);
      document.removeEventListener("click", handleDocumentClick);
    };
  }, []);

  // Whenever pathname changes, ensure page is positioned at the top
  useEffect(() => {
    if (typeof window === "undefined") return;

    // Reset scroll immediately
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: "instant" as ScrollBehavior,
    });
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;

    // Double-check on next animation frame and a short micro-timeout
    // to handle asynchronous Next.js App Router DOM re-renders
    const rafId = requestAnimationFrame(() => {
      window.scrollTo({ top: 0, left: 0, behavior: "instant" as ScrollBehavior });
      document.documentElement.scrollTop = 0;
      document.body.scrollTop = 0;
    });

    const timerId = setTimeout(() => {
      window.scrollTo({ top: 0, left: 0, behavior: "instant" as ScrollBehavior });
      document.documentElement.scrollTop = 0;
      document.body.scrollTop = 0;
    }, 20);

    prevPathnameRef.current = pathname;

    return () => {
      cancelAnimationFrame(rafId);
      clearTimeout(timerId);
    };
  }, [pathname]);

  return null;
}
