import { Metadata } from "next";
import CreatorsPageClient from "./CreatorsPageClient";

export const metadata: Metadata = {
  title: "For Creators",
  description:
    "Join Lucky Studios podcast network. Grow your audience with production support, cross-promotion to 1.1M+ viewers, and revenue sharing.",
  keywords: [
    "podcast network",
    "join podcast network",
    "podcast creator",
    "podcast production",
    "podcast partnership",
  ],
  openGraph: {
    title: "For Creators | Lucky Studios",
    description:
      "Join London's fastest-growing podcast network. Production support, cross-promotion, and revenue sharing.",
    type: "website",
    url: "https://luckystudios.com/creators",
  },
};

export default function CreatorsPage() {
  return <CreatorsPageClient />;
}

