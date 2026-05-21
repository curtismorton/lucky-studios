import { MetadataRoute } from "next";
import { getSiteUrl } from "@/lib/services/cms/siteSettings";

export default async function robots(): Promise<MetadataRoute.Robots> {
  const baseUrl = await getSiteUrl();

  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/api/", "/admin/", "/dashboard/", "/cms/"],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
