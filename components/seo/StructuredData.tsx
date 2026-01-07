import { Show } from "@/lib/data/shows";

interface OrganizationSchemaProps {
  shows?: Show[];aq
      "@type": "PostalAddress",
      streetAddress: "London Bridge",
      addressLocality: "London",
      addressRegion: "London",
      postalCode: "SE1",
      addressCountry: "GB",
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: "51.5074",
      longitude: "-0.0877",
    },
    telephone: "+44-20-1234-5678",
    email: "hello@weareluckystudios.com",
    url: "https://luckystudios.com/studio",
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
  const schema = {
    "@context": "https://schema.org",
    "@type": "PodcastSeries",
    name: show.title,
    description: show.description || show.tagline,
    url: `https://luckystudios.com/shows/${show.slug}`,
    image: `https://luckystudios.com/shows/${show.slug}/artwork.jpg`,
    genre: show.genre,
    publisher: {
      "@type": "Organization",
      name: "Lucky Studios",
      url: "https://luckystudios.com",
    },
    aggregateRating: show.stat.includes("M+") || show.stat.includes("views")
      ? {
          "@type": "AggregateRating",
          ratingValue: "4.8",
          reviewCount: "50",
        }
      : undefined,
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

