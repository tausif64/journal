import type { MetadataRoute } from "next";
import { prisma } from "@/lib/prisma";

const baseUrl =
  process.env.NEXT_PUBLIC_APP_URL?.replace(/\/$/, "") ?? "https://macroj.tausifansari.com/";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticRoutes = [
    "/",
    "/about-us",
    "/mission-vision",
    "/members",
    "/guidelines",
    "/contact",
    "/events/conferences",
    "/events/webinars",
    "/publications/journals",
    "/publications/issues",
    "/publications/articles",
    "/login",
    "/signup",
    "/forgot-password",
    "/dashboard",
    "/dashboard/profile",
    "/dashboard/submit",
    "/dashboard/articles",
    "/dashboard/testimonials",
  ];

  const publishedArticles = await prisma.article.findMany({
    where: { status: "PUBLISHED" },
    select: { slug: true, updatedAt: true },
    orderBy: { updatedAt: "desc" },
    take: 2000,
  });

  const staticEntries: MetadataRoute.Sitemap = staticRoutes.map((path) => ({
    url: `${baseUrl}${path}`,
    lastModified: new Date(),
    changeFrequency: path === "/" ? "daily" : "weekly",
    priority: path === "/" ? 1 : 0.7,
  }));

  const articleEntries: MetadataRoute.Sitemap = publishedArticles.map(
    (article) => ({
      url: `${baseUrl}/article/${article.slug}`,
      lastModified: article.updatedAt,
      changeFrequency: "weekly",
      priority: 0.8,
    })
  );

  return [...staticEntries, ...articleEntries];
}
