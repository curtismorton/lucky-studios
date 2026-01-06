import { Show } from "@/lib/data/shows";

interface OrganizationSchemaProps {
  shows?: Show[];
}

export function OrganizationSchema({ shows = [] }: OrganizationSchemaProps) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Lucky Studios",
    description:
      "London's creator-first podcast network. Professional podcast production, studio rental, and network partnerships.",
    url: "https://luckystudios.com",
    logo: "https://luckystudios.com/logo.png",
    sameAs: [
      "https://twitter.com/luckystudios",
      "https://instagram.com/luckystudios",
      "https://linkedin.com/company/luckystudios",
      "https://youtube.com/@luckystudios",
    ],
    contactPoint: {
      "@type": "ContactPoint",
      telephone: "+44-20-1234-5678",
      contactType: "Customer Service",
      email: "hello@weareluckystudios.com",
      areaServed: "GB",
      availableLanguage: "English",
    },
    address: {
      "@type": "PostalAddress",
      addressLocality: "London Bridge",
      addressRegion: "London",
      addressCountry: "GB",
    },
    parentOrganization: {
      "@type": "Organization",
      name: "Socially Powerful",
      url: "https://sociallypowerful.com",
    },
    aggregateRating: shows.length > 0
      ? {
          "@type": "AggregateRating",
          ratingValue: "4.8",
          reviewCount: "150",
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

export function LocalBusinessSchema() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "@id": "https://luckystudios.com/#business",
    name: "Lucky Studios",
    image: "https://luckystudios.com/studio.jpg",
    description:
      "Professional podcast recording studio in London Bridge. Equipment includes Sony A7 IV cameras, Shure SM7B microphones, and professional lighting.",
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

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

