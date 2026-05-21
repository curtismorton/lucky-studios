import type { Metadata } from "next";
import { Space_Grotesk, Syne } from "next/font/google";
import "./globals.css";
import SiteChrome from "@/components/layout/SiteChrome";
import { OrganizationSchema } from "@/components/seo/StructuredData";
import { site } from "@/lib/data/site";
import { getNavFooterSettings, getSeoDefaults, getSiteSettings } from "@/lib/services/cms/siteSettings";

const headingFont = Syne({
  subsets: ["latin"],
  variable: "--font-heading",
  weight: ["500", "600", "700", "800"],
});

const bodyFont = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-body",
  weight: ["400", "500", "600", "700"],
});

export async function generateMetadata(): Promise<Metadata> {
  const [siteSettings, seoDefaults] = await Promise.all([
    getSiteSettings(),
    getSeoDefaults(),
  ]);

  const baseUrl = siteSettings.url || site.url;
  const globalSeo = seoDefaults.global || {};
  const description = globalSeo.description || siteSettings.description || site.description;
  const title =
    globalSeo.title || `${siteSettings.name || site.name} | London's Creator-First Podcast Network`;
  const ogImage = globalSeo.ogImage || siteSettings.ogImage || site.ogImage;

  return {
    metadataBase: new URL(baseUrl),
    title: {
      template: "%s | Lucky Studios",
      default: title,
    },
    description,
    keywords: globalSeo.keywords || [
      "podcast network",
      "podcast production",
      "podcast studio London",
      "podcast recording studio",
      "creator network",
      "podcast partnership",
      "London podcast studio",
      "podcast branding",
    ],
    authors: [{ name: siteSettings.name || "Lucky Studios" }],
    creator: siteSettings.name || "Lucky Studios",
    publisher: siteSettings.name || "Lucky Studios",
    openGraph: {
      type: "website",
      locale: "en_GB",
      url: baseUrl,
      siteName: siteSettings.name || site.name,
      title,
      description,
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [ogImage],
      creator: siteSettings.socials?.x || "@luckystudios",
    },
    icons: {
      icon: [
        { url: siteSettings.logo || site.logo, type: "image/png" },
        { url: "/favicon.ico", sizes: "any" },
      ],
      apple: [{ url: siteSettings.logo || site.logo, type: "image/png" }],
    },
    robots: globalSeo.noindex
      ? {
          index: false,
          follow: false,
        }
      : {
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
  };
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [siteSettings, navFooter] = await Promise.all([
    getSiteSettings(),
    getNavFooterSettings(),
  ]);
  const bookingHref = siteSettings.calendlyUrl || "/contact";

  return (
    <html
      lang="en"
      className={`dark ${headingFont.variable} ${bodyFont.variable}`}
    >
      <head>
        <OrganizationSchema siteSettings={siteSettings} />
      </head>
      <body
        className="font-body antialiased bg-background"
      >
        <SiteChrome
          links={navFooter.primaryLinks}
          bookingHref={bookingHref}
          bookingLabel={navFooter.bookingLabel}
          footerLinks={navFooter.footerLinks}
          email={siteSettings.email}
          phone={siteSettings.phone}
          socials={siteSettings.socials}
          footerBadgePrefix={navFooter.footerBadgePrefix}
          footerBadgeHighlight={navFooter.footerBadgeHighlight}
          copyrightText={navFooter.copyrightText}
        >
          {children}
        </SiteChrome>
      </body>
    </html>
  );
}
