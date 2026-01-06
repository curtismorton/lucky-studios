import { MetadataRoute } from "next";
import { shows } from "@/lib/data/shows";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://luckystudios.com";

  const routes = [
    "",
    "/shows",
    "/creators",
    "/brands",
    "/studio",
    "/about",
    "/contact",
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: route === "" ? 1 : 0.8,
  }));

  const showRoutes = shows.map((show) => ({
    url: `${baseUrl}/shows/${show.slug}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: show.featured ? 0.9 : 0.7,
  }));

  return [...routes, ...showRoutes];
}

