type SocialKey = "x" | "instagram" | "linkedin" | "youtube";

function getSiteUrl(): string {
  const raw = process.env.NEXT_PUBLIC_SITE_URL || "https://luckystudios.com";
  return raw.replace(/\/+$/, "");
}

export const site = {
  url: getSiteUrl(),
  name: "Lucky Studios",
  description:
    "London's creator-first podcast network. Professional podcast production, studio rental, and network partnerships.",
  logo: "/images/LOGO.png",
  ogImage: "/images/LOGO.png",
  email: "hello@weareluckystudios.com",
  phone: "+44-20-1234-5678",
  address: {
    streetAddress: "London Bridge",
    locality: "London",
    region: "London",
    postalCode: "SE1",
    country: "GB",
  },
  socials: {
    x: "https://x.com/luckystudios",
    instagram: "https://instagram.com/luckystudios",
    linkedin: "https://linkedin.com/company/luckystudios",
    youtube: "https://youtube.com/@luckystudios",
  } satisfies Record<SocialKey, string>,
  calendlyUrl: process.env.NEXT_PUBLIC_CALENDLY_URL || "",
};

export function absoluteUrl(path: string): string {
  if (/^https?:\/\//i.test(path)) {
    return path;
  }

  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  return `${site.url}${normalizedPath}`;
}
