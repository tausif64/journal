import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: ["/"],
        disallow: [
          "/api/",
          "/admin/",
          "/admin-auth/",
          "/editor-auth/",
          "/editor/",
        ],
      },
    ],
    sitemap: "https://macroj.tausifansari.com/",
  };
}
