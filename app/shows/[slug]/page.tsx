import { Metadata } from "next";
import { notFound } from "next/navigation";
import ShowHero from "@/components/shows/ShowHero";
import ShowAbout from "@/components/shows/ShowAbout";
import ShowHosts from "@/components/shows/ShowHosts";
import ShowEpisodes from "@/components/shows/ShowEpisodes";
import ShowAnalytics from "@/components/shows/ShowAnalytics";
import SponsorCTA from "@/components/shows/SponsorCTA";
import { PodcastSeriesSchema } from "@/components/seo/StructuredData";
import {
  getSpotifyShowData,
  isSpotifyConfigured,
  type SpotifyEpisode,
  type SpotifyShow,
} from "@/lib/services/spotify";
import { getShowBySlug, getShows } from "@/lib/services/cms/shows";
import { absoluteUrl as cmsAbsoluteUrl, getSiteSettings } from "@/lib/services/cms/siteSettings";

export const revalidate = 3600;

export async function generateStaticParams() {
  const shows = await getShows();
  return shows.map((show) => ({
    slug: show.slug,
  }));
}

export async function generateMetadata(
  props: {
    params: Promise<{ slug: string }>;
  }
): Promise<Metadata> {
  const params = await props.params;
  const [show, site] = await Promise.all([
    getShowBySlug(params.slug),
    getSiteSettings(),
  ]);

  if (!show) {
    return {
      title: "Show Not Found",
    };
  }

  const socialImage = show.seo?.ogImage || show.ogImage || site.ogImage;
  const canonicalPath = show.seo?.canonicalPath || `/shows/${show.slug}`;
  const canonicalUrl = await cmsAbsoluteUrl(canonicalPath);
  const socialImageUrl = await cmsAbsoluteUrl(socialImage);
  const title = show.seo?.title || `${show.title} | Lucky Studios`;
  const description =
    show.seo?.description ||
    show.description ||
    `${show.title} - ${show.tagline}. Part of Lucky Studios podcast network.`;

  return {
    title,
    description,
    keywords: [
      show.title,
      show.genre,
      "podcast",
      "Lucky Studios",
      show.tagline,
    ],
    openGraph: {
      title,
      description,
      type: "website",
      url: canonicalUrl,
      images: [
        {
          url: socialImageUrl,
          width: 1200,
          height: 630,
          alt: `${show.title} - ${show.tagline}`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [socialImageUrl],
    },
    alternates: { canonical: canonicalUrl },
  };
}

export default async function ShowPage(props: { params: Promise<{ slug: string }> }) {
  const params = await props.params;
  const show = await getShowBySlug(params.slug);

  if (!show) {
    notFound();
  }

  let spotifyShow: SpotifyShow | undefined;
  let spotifyEpisodes: SpotifyEpisode[] | undefined;

  if (show.spotifyShowId && isSpotifyConfigured()) {
    try {
      const spotifyData = await getSpotifyShowData(show.spotifyShowId, 10);
      spotifyShow = spotifyData.show;
      spotifyEpisodes = spotifyData.episodes;
    } catch (error) {
      console.error("Show page Spotify fetch failed:", error);
    }
  }

  return (
    <main className="min-h-screen bg-background">
      <PodcastSeriesSchema show={show} />
      <ShowHero show={show} spotifyShow={spotifyShow} />
      <ShowAbout show={show} />
      {show.hosts && show.hosts.length > 0 && <ShowHosts hosts={show.hosts} />}
      <ShowEpisodes
        episodes={show.episodes}
        show={show}
        spotifyEpisodes={spotifyEpisodes}
      />
      <ShowAnalytics show={show} />
      <SponsorCTA />
    </main>
  );
}
