import { Metadata } from "next";
import ShowsPageClient from "./ShowsPageClient";

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: "Our Shows",
  description:
    "Browse all shows in the Lucky Studios network. From entertainment to football to lifestyle - discover hit podcasts reaching millions of viewers.",
  keywords: [
    "podcast shows",
    "podcast network",
    "entertainment podcasts",
    "football podcasts",
    "lifestyle podcasts",
    "Lucky Studios shows",
  ],
  openGraph: {
    title: "Our Shows | Lucky Studios",
    description:
      "Browse all shows in the Lucky Studios network. Hit podcasts reaching millions of viewers.",
    type: "website",
    url: "https://luckystudios.com/shows",
  },
};

export default function ShowsPage() {
  return <ShowsPageClient />;
}
