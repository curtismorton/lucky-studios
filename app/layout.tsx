import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { OrganizationSchema } from "@/components/seo/StructuredData";
import { site } from "@/lib/data/site";

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    template: "%s | Lucky Studios",
    default: "Lucky Studios | London's Creator-First Podcast Network",
  },
  description:
    "Professional podcast production, studio rental, and network partnerships in London Bridge. Join the network behind 5M+ views.",
  keywords: [
    "podcast network",
    "podcast production",
    "podcast studio London",
    "podcast recording studio",
    "creator network",
    "podcast partnership",
    "London podcast studio",
    "podcast branding",
  ],
  authors: [{ name: "Lucky Studios" }],
  creator: "Lucky Studios",
  publisher: "Lucky Studios",
  openGraph: {
    type: "website",
    locale: "en_GB",
    url: site.url,
    siteName: site.name,
    title: "Lucky Studios | London's Creator-First Podcast Network",
    description:
      "Professional podcast production, studio rental, and network partnerships in London Bridge. Join the network behind 5M+ views.",
    images: [
      {
        url: site.ogImage,
        width: 1200,
        height: 630,
        alt: "Lucky Studios - London's Creator-First Podcast Network",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Lucky Studios | London's Creator-First Podcast Network",
    description:
      "Professional podcast production, studio rental, and network partnerships in London Bridge.",
    images: [site.ogImage],
    creator: "@luckystudios",
  },
  icons: {
    icon: [
      { url: site.logo, type: "image/png" },
      { url: "/favicon.ico", sizes: "any" },
    ],
    apple: [
      { url: site.logo, type: "image/png" },
    ],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    google: "your-google-verification-code",
    // Add other verification codes as needed
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <head>
        <OrganizationSchema />
      </head>
      <body
        className="font-body antialiased bg-background"
      >
        <Navbar />
        {children}
        <Footer />
      </body>
    </html>
  );
}
