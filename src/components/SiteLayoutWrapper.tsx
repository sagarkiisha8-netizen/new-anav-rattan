"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import WhatsAppCTA from "@/components/WhatsAppCTA";

export default function SiteLayoutWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isAdminRoute = pathname?.startsWith("/admin");

  useEffect(() => {
    // Prevent Netlify preview and other scripts from injecting bottom padding
    if (typeof document !== "undefined") {
      document.body.style.paddingBottom = "0px";
      document.documentElement.style.paddingBottom = "0px";

      const removeNetlifyElements = () => {
        const badges = document.querySelectorAll(
          '#netlify-badge, .netlify-badge, [data-netlify-deploy-preview], iframe#netlify-drawer, #netlify-drawer, [class*="netlify-drawer"], [class*="netlify-badge"]'
        );
        badges.forEach((el) => {
          try {
            el.remove();
          } catch {
            (el as HTMLElement).style.display = "none";
          }
        });
        if (document.body.style.paddingBottom && document.body.style.paddingBottom !== "0px") {
          document.body.style.paddingBottom = "0px";
        }
      };

      removeNetlifyElements();
      const interval = setInterval(removeNetlifyElements, 1000);
      return () => clearInterval(interval);
    }
  }, []);

  if (isAdminRoute) {
    return <>{children}</>;
  }

  return (
    <>
      <Navbar />
      {children}
      <WhatsAppCTA />
      <Footer />
    </>
  );
}
