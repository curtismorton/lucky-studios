import { Metadata } from "next";
import BrandsPageClient from "./BrandsPageClient";

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: "For Brands",
  description:
    "Partner with Lucky Studios to reach engaged podcast audiences. Sponsor shows or create branded podcasts. 1.1M+ monthly listeners.",
  keywords: [
    "podcast sponsorship",
    "branded podcast",
    "podcast advertising",
    "podcast marketing",
    "podcast partnership",
  ],
  openGraph: {
    title: "For Brands | Lucky Studios",
    description:
      "Reach engaged audiences through podcast partnerships. Sponsor shows or create branded content.",
    type: "website",
    url: "https://luckystudios.com/brands",
  },
};

export default function BrandsPage() {
  return <BrandsPageClient />;
}
