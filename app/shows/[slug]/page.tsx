import { Metadata } from "next";
import { notFound } from "next/navigation";
import { getShowBySlug, shows } from "@/lib/data/shows";
import ShowHero from "@/components/shows/ShowHero";
import ShowAbout from "@/components/shows/ShowAbout";
import ShowHosts from "@/components/shows/ShowHosts";
import ShowEpisodes from "@/components/shows/ShowEpisodes";
import ShowAnalytics from "@/components/shows/ShowAnalytics";
import SponsorCTA from "@/components/shows/SponsorCTA";
import { PodcastSeriesSchema } from "@/components/seo/StructuredData";

export const dynamic = 'force-dynamic';

export async function generateStaticParams() {
  return shows.map((show) => ({
    slug: show.slug,
  }));
}

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const show = getShowBySlug(params.slug);

  if (!show) {
    return {
      title: "Show Not Found",
    };
  }

  return {
    title: show.title,
    description: show.description || `${show.title} - ${show.tagline}. Part of Lucky Studios podcast network.`,
    keywords: [
      show.title,
      show.genre,
      "podcast",
      "Lucky Studios",
      show.tagline,
    ],
    openGraph: {
      title: `${show.title} | Lucky Studios`,
      description: show.description || `${show.title} - ${show.tagline}`,
      type: "website",
      url: `https://luckystudios.com/shows/${show.slug}`,
      images: [
        {
          url: `https://luckystudios.com/shows/${show.slug}/og-image.jpg`,
          width: 1200,
          height: 630,
          alt: `${show.title} - ${show.tagline}`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: `${show.title} | Lucky Studios`,
      description: show.description || `${show.title} - ${show.tagline}`,
      images: [`https://luckystudios.com/shows/${show.slug}/og-image.jpg`],
    },
  };
}

export default function ShowPage({ params }: { params: { slug: string } }) {
  const show = getShowBySlug(params.slug);

  if (!show) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-background">
      <PodcastSeriesSchema show={show} />
      <ShowHero show={show} />
      <ShowAbout show={show} />
      {show.hosts && show.hosts.length > 0 && <ShowHosts hosts={show.hosts} />}
      <ShowEpisodes episodes={show.episodes} show={show} />
      <ShowAnalytics show={show} />
      <SponsorCTA />
    </main>
  );
}

