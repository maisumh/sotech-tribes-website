import type { MetadataRoute } from "next";

// Canonical host for the launch is the apex (trytribes.com); Vercel 308-redirects
// www -> apex. Keep this in sync with sitemap.ts and layout's metadataBase.
const BASE_URL = "https://trytribes.com";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      // Internal staff tool, API handlers, and unlinked demo/preview pages —
      // keep them out of search results.
      disallow: ["/admin", "/api", "/home2", "/mvp", "/update", "/feedback", "/costs"],
    },
    sitemap: `${BASE_URL}/sitemap.xml`,
    host: BASE_URL,
  };
}
