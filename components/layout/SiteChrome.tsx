"use client";

import { usePathname } from "next/navigation";
import Grain from "@/components/cinema/Grain";
import Footer from "@/components/layout/Footer";
import Navbar from "@/components/layout/Navbar";

type SiteChromeProps = {
  children: React.ReactNode;
  bookingHref: string;
  bookingLabel: string;
  footerBadgeHighlight: string;
  footerBadgePrefix: string;
  footerLinks: Array<{ name: string; href: string }>;
  links: Array<{ name: string; href: string }>;
  copyrightText: string;
  email: string;
  phone: string;
  socials: {
    x?: string;
    instagram?: string;
    linkedin?: string;
    youtube?: string;
  };
};

const CHROMELESS_PREFIXES = ["/admin", "/cms", "/dashboard"];

function shouldHideSiteChrome(pathname: string | null): boolean {
  if (!pathname) return false;
  return CHROMELESS_PREFIXES.some(
    (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`)
  );
}

export default function SiteChrome({
  children,
  bookingHref,
  bookingLabel,
  footerBadgeHighlight,
  footerBadgePrefix,
  footerLinks,
  links,
  copyrightText,
  email,
  phone,
  socials,
}: SiteChromeProps) {
  const pathname = usePathname();
  const hideSiteChrome = shouldHideSiteChrome(pathname);
  // The homepage opens bare — no top nav, and no footer to break the funnel.
  const hideFooter = hideSiteChrome || pathname === "/";
  const hideNav = hideSiteChrome || pathname === "/";

  return (
    <>
      {hideSiteChrome ? null : <Grain />}
      {hideNav ? null : (
        <Navbar bookingHref={bookingHref} bookingLabel={bookingLabel} />
      )}
      {children}
      {hideFooter ? null : (
        <Footer
          links={footerLinks}
          email={email}
          phone={phone}
          socials={socials}
          badgePrefix={footerBadgePrefix}
          badgeHighlight={footerBadgeHighlight}
          copyrightText={copyrightText}
        />
      )}
    </>
  );
}
