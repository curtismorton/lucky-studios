import { MetadataRoute } from "next";
import { getShows } from "@/lib/services/cms/shows";
import { getSiteUrl } from "@/lib/services/cms/siteSettings";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [baseUrl, shows] = await Promise.all([getSiteUrl(), getShows()]);

  const routes = [
    "",
    "/shows",
    "/work",
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
