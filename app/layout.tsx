import type { Metadata } from "next";
import { Syne, Space_Grotesk } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { OrganizationSchema } from "@/components/seo/StructuredData";

const syne = Syne({
  subsets: ["latin"],
  variable: "--font-syne",
  display: "swap",
  weight: ["400", "500", "600", "700", "800"],
});

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space-grotesk",
  display: "swap",
  weight: ["300", "400", "500", "600", "700"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://luckystudios.com"),
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
    url: "https://luckystudios.com",
    siteName: "Lucky Studios",
    title: "Lucky Studios | London's Creator-First Podcast Network",
    description:
      "Professional podcast production, studio rental, and network partnerships in London Bridge. Join the network behind 5M+ views.",
    images: [
      {
        url: "/og-image.jpg",
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
    images: ["/og-image.jpg"],
    creator: "@luckystudios",
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
        className={`${syne.variable} ${spaceGrotesk.variable} font-body antialiased bg-background`}
      >
        <Navbar />
        {children}
        <Footer />
      </body>
    </html>
  );
}

