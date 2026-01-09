import { Metadata } from "next";
import AboutPageClient from "./AboutPageClient";

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: "About Us",
  description:
    "Learn about Lucky Studios - London's creator-first podcast network. Part of Socially Powerful, building the UK's most creator-friendly podcast network.",
  keywords: [
    "Lucky Studios",
    "podcast network London",
    "creator-first podcast",
    "Socially Powerful",
    "podcast production company",
    "about Lucky Studios",
  ],
  openGraph: {
    title: "About Us | Lucky Studios",
    description:
      "London's creator-first podcast network. Learn about our mission, team, and values.",
    type: "website",
    url: "https://luckystudios.com/about",
  },
};

export default function AboutPage() {
  return <AboutPageClient />;
}
