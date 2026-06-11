import HomeClient from "./page-client";
import { getHomepageContent } from "@/lib/services/homepageCms";
import { getShows } from "@/lib/services/cms/shows";
import { buildPageMetadata } from "@/lib/services/cms/seo";
import { getSiteSettings } from "@/lib/services/cms/siteSettings";
import { resolveConsultationHref } from "@/lib/utils/consultationHref";

export const revalidate = 86400;

export async function generateMetadata() {
  const title = "Lucky Studios | Creator Led Podcast and Content Studio";
  const description =
    "Lucky Studios builds, produces and grows creator led podcasts for brands, talent and audiences. Strategy, studio production, editing, clips, distribution and growth.";
  const metadata = await buildPageMetadata({
    path: "/",
    fallbackTitle: title,
    fallbackDescription: description,
    fallbackKeywords: [
      "creator led podcast studio",
      "podcast production",
      "content studio",
      "podcast growth",
    ],
  });

  return {
    ...metadata,
    title,
    description,
    openGraph: {
      ...metadata.openGraph,
      title,
      description,
    },
  };
}

export default async function Home() {
  const [content, shows, siteSettings] = await Promise.all([
    getHomepageContent(),
    getShows(),
    getSiteSettings(),
  ]);
  const consultationHref = resolveConsultationHref(siteSettings.calendlyUrl);

  return (
    <HomeClient
      content={content}
      shows={shows}
      consultationHref={consultationHref}
    />
  );
}
