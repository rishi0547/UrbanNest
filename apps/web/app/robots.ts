import type { MetadataRoute } from "next";
import { siteConfig } from "@/lib/site-config";

export default function robots(): MetadataRoute.Robots {
  const baseUrl = siteConfig.url.replace(/\/+$/, "");

  return {
    rules: [
      {
        userAgent: "*",
        allow: ["/", "/products", "/products/*"],
        disallow: [
          "/admin",
          "/admin/*",
          "/profile",
          "/orders",
          "/orders/*",
          "/cart",
          "/checkout",
          "/order-success",
          "/login",
          "/register",
          "/api/*",
        ],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
