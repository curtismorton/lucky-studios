import { Metadata } from "next";
import StudioPageClient from "./StudioPageClient";
import { LocalBusinessSchema } from "@/components/seo/StructuredData";

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: "The Studio",
  description:
    "Rent our professional podcast studio in London Bridge. Equipped with Sony A7 IV cameras, Shure SM7B mics, and full production support.",
  keywords: [
    "podcast studio London",
    "studio rental London",
    "London Bridge studio",
    "podcast production studio",
    "video podcast studio",
    "Lucky Studios studio",
  ],
  openGraph: {
    title: "The Studio | Lucky Studios",
    description:
      "Professional podcast studio in the heart of London. Book a tour or get a quote.",
    type: "website",
    url: "https://luckystudios.com/studio",
    images: [
      {
        url: "https://luckystudios.com/og-image-studio.jpg",
        width: 1200,
        height: 630,
        alt: "Lucky Studios - Professional Podcast Studio in London",
      },
    ],
  },
};

export default function StudioPage() {
  return (
    <>
      <StudioPageClient />
      <LocalBusinessSchema />
    </>
  );
}
