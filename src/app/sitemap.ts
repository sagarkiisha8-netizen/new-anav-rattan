import { MetadataRoute } from "next";
import { defaultSiteContent } from "@/lib/db";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://drrattanentclinic.com";
  const lastModified = new Date();

  const staticRoutes = [
    "",
    "/about",
    "/services",
    "/doctors",
    "/doctors/dr-ganesh-dutt-rattan",
    "/doctors/dr-anav-rattan",
    "/research",
    "/faqs",
    "/gallery",
    "/contact",
    "/book-appointment",
    "/privacy-policy",
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified,
    changeFrequency: route === "" ? ("daily" as const) : ("weekly" as const),
    priority: route === "" ? 1.0 : route.startsWith("/services") || route.startsWith("/doctors") ? 0.9 : 0.8,
  }));

  const serviceRoutes = defaultSiteContent.services.map((service) => ({
    url: `${baseUrl}/services/${service.slug}`,
    lastModified,
    changeFrequency: "weekly" as const,
    priority: 0.85,
  }));

  return [...staticRoutes, ...serviceRoutes];
}
