import { Show } from "@/lib/data/shows";

export function OrganizationSchema() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Lucky Studios",
    url: "https://luckystudios.com",
    logo: "https://luckystudios.com/logo.png",
    description:
      "London's creator-first podcast network. Professional podcast production, studio rental, and network partnerships.",
    address: {
      "@type": "PostalAddress",
      streetAddress: "London Bridge",
      addressLocality: "London",
      addressRegion: "London",
      postalCode: "SE1",
      addressCountry: "GB",
    },
    contactPoint: {
      "@type": "ContactPoint",
      telephone: "+44-20-1234-5678",
      contactType: "Customer Service",
      email: "hello@weareluckystudios.com",
    },
    sameAs: [
      "https://twitter.com/luckystudios",
      "https://instagram.com/luckystudios",
      "https://linkedin.com/company/luckystudios",
      "https://youtube.com/@luckystudios",
    ],
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
    name: "Lucky Studios",
    description:
      "Professional podcast studio rental in London Bridge. Equipped with Sony A7 IV cameras, Shure SM7B microphones, and full production support.",
    address: {
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
