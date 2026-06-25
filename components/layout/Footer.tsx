import Image from "next/image";
import Link from "next/link";
import { Instagram, Linkedin, Twitter, Youtube } from "lucide-react";
import { site } from "@/lib/data/site";

const DEFAULT_FOOTER_NAV = [
  { name: "Our Shows", href: "/shows" },
  { name: "For Creators", href: "/creators" },
  { name: "For Brands", href: "/brands" },
  { name: "The Studio", href: "/studio" },
  { name: "About", href: "/about" },
];

interface FooterProps {
  links?: Array<{ name: string; href: string }>;
  email?: string;
  phone?: string;
  socials?: {
    x?: string;
    instagram?: string;
    linkedin?: string;
    youtube?: string;
  };
  badgePrefix?: string;
  badgeHighlight?: string;
  copyrightText?: string;
}

export default function Footer({
  links = DEFAULT_FOOTER_NAV,
  email = site.email,
  phone = site.phone,
  socials = site.socials,
  badgePrefix = "Part of",
  badgeHighlight = "Socially Powerful",
  copyrightText = "© 2026 Lucky Studios. All rights reserved.",
}: FooterProps) {
  const socialLinks = [
    { name: "X", href: socials?.x, Icon: Twitter },
    { name: "Instagram", href: socials?.instagram, Icon: Instagram },
    { name: "LinkedIn", href: socials?.linkedin, Icon: Linkedin },
    { name: "YouTube", href: socials?.youtube, Icon: Youtube },
  ].filter((social) => Boolean(social.href));

  return (
    <footer className="border-t border-bone/10">
      <div className="mx-auto max-w-7xl px-6 py-16 md:px-10 md:py-20 lg:px-16">
        <div className="grid gap-12 md:grid-cols-[1.4fr_1fr_1fr]">
          {/* Brand */}
          <div>
            <Image
              src="/images/LOGO-WHITE.png"
              alt="Lucky Studios"
              width={140}
              height={32}
              className="h-7 w-auto"
            />
            <p className="type-serif mt-6 text-2xl">
              Make your own <em className="italic text-tally">luck</em>.
            </p>
            <p className="tc-label mt-6 text-bone/40">
              Podcast network &amp; production studio · London
            </p>
          </div>

          {/* Nav */}
          <nav aria-label="Footer">
            <p className="tc-label text-bone/40">Index</p>
            <ul className="mt-5 space-y-3">
              {links.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="link-underline text-sm text-bone/70 hover:text-bone"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Contact */}
          <div>
            <p className="tc-label text-bone/40">Contact</p>
            <ul className="mt-5 space-y-3 text-sm">
              {email && (
                <li>
                  <a
                    href={`mailto:${email}`}
                    className="link-underline font-mono text-bone/70 hover:text-bone"
                  >
                    {email}
                  </a>
                </li>
              )}
              {phone && (
                <li>
                  <a
                    href={`tel:${phone.replace(/\s/g, "")}`}
                    className="link-underline font-mono text-bone/70 hover:text-bone"
                  >
                    {phone}
                  </a>
                </li>
              )}
            </ul>
            {socialLinks.length > 0 && (
              <div className="mt-7 flex gap-5">
                {socialLinks.map(({ name, href, Icon }) => (
                  <a
                    key={name}
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={name}
                    className="text-bone/50 transition-colors hover:text-tally"
                  >
                    <Icon size={18} />
                  </a>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="mt-16 flex flex-col gap-4 border-t border-bone/10 pt-8 sm:flex-row sm:items-center sm:justify-between">
          <p className="tc-label text-bone/40">{copyrightText}</p>
          <p className="tc-label text-bone/40">
            {badgePrefix} <span className="text-bone/70">{badgeHighlight}</span>
          </p>
        </div>
      </div>
    </footer>
  );
}
