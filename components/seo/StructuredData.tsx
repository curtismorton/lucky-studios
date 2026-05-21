import { Show } from "@/lib/data/shows";
import { absoluteUrl, site } from "@/lib/data/site";
import type { CmsSiteSettingsPayload } from "@/lib/cms/types";

const siteSocials = Object.values(site.socials).filter(
  (value): value is string => Boolean(value && value.trim().length > 0)
);

export function OrganizationSchema({
  siteSettings,
}: {
  siteSettings?: CmsSiteSettingsPayload;
}) {
  const resolvedSite = siteSettings || site;
  const resolveUrl = (path: string): string => {
    if (/^https?:\/\//i.test(path)) return path;
    const normalizedPath = path.startsWith("/") ? path : `/${path}`;
    return `${resolvedSite.url.replace(/\/+$/, "")}${normalizedPath}`;
  };
  const socials = siteSettings
    ? Object.values(siteSettings.socials || {}).filter(
        (value): value is string => Boolean(value && value.trim().length > 0)
      )
    : siteSocials;

  const schema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: resolvedSite.name,
    url: resolvedSite.url,
    logo: resolveUrl(resolvedSite.logo),
    description: resolvedSite.description,
    address: {
      "@type": "PostalAddress",
      streetAddress: resolvedSite.address.streetAddress,
      addressLocality: resolvedSite.address.locality,
      addressRegion: resolvedSite.address.region,
      postalCode: resolvedSite.address.postalCode,
      addressCountry: resolvedSite.address.country,
    },
    contactPoint: {
      "@type": "ContactPoint",
      telephone: resolvedSite.phone,
      contactType: "Customer Service",
      email: resolvedSite.email,
    },
    sameAs: socials,
    parentOrganization: {
      "@type": "Organization",
      name: "Socially Powerful",
      url: "https://sociallypowerful.com",
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

export function LocalBusinessSchema() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name: site.name,
    description: site.description,
    address: {
      "@type": "PostalAddress",
      streetAddress: site.address.streetAddress,
      addressLocality: site.address.locality,
      addressRegion: site.address.region,
      postalCode: site.address.postalCode,
      addressCountry: site.address.country,
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: "51.5074",
      longitude: "-0.0877",
    },
    telephone: site.phone,
    email: site.email,
    url: absoluteUrl("/studio"),
    priceRange: "$$",
    openingHoursSpecification: [
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
        opens: "09:00",
        closes: "18:00",
      },
    ],
    amenityFeature: [
      {
        "@type": "LocationFeatureSpecification",
        name: "Professional Recording Equipment",
      },
      {
        "@type": "LocationFeatureSpecification",
        name: "Green Room",
      },
      {
        "@type": "LocationFeatureSpecification",
        name: "Makeup Room",
      },
    ],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

interface PodcastSeriesSchemaProps {
  show: Show;
}

export function PodcastSeriesSchema({ show }: PodcastSeriesSchemaProps) {
  const showImage = show.ogImage || site.ogImage;

  const schema = {
    "@context": "https://schema.org",
    "@type": "PodcastSeries",
    name: show.title,
    description: show.description || show.tagline,
    url: absoluteUrl(`/shows/${show.slug}`),
    image: absoluteUrl(showImage),
    genre: show.genre,
    publisher: {
      "@type": "Organization",
      name: site.name,
      url: site.url,
    },
    aggregateRating: show.stat.includes("M+") || show.stat.includes("views")
      ? {
          "@type": "AggregateRating",
          ratingValue: "4.8",
          reviewCount: "50",
        }
      : undefined,
  };

  // Remove undefined values
  const cleanedSchema = Object.fromEntries(
    Object.entries(schema).filter(([_, value]) => value !== undefined)
  );

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(cleanedSchema) }}
    />
  );
}
