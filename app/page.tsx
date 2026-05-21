import HomeClient from "./page-client";
import { getHomepageContent } from "@/lib/services/homepageCms";
import { getShows } from "@/lib/services/cms/shows";

export const revalidate = 86400;

export default async function Home() {
  const [content, shows] = await Promise.all([getHomepageContent(), getShows()]);
  return <HomeClient content={content} shows={shows} />;
}
