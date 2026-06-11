import { site } from "@/lib/data/site";

/** /contact copy + direct-route details. Edit here until the CMS re-model. */

export const contactContent = {
  form: {
    sendingLabel: "Sending…",
  },
  direct: {
    email: site.email,
    addressLines: [
      site.address.streetAddress,
      `${site.address.locality}, ${site.address.country}`,
    ],
    socials: [
      { label: "Twitter", href: site.socials.x },
      { label: "Instagram", href: site.socials.instagram },
      { label: "LinkedIn", href: site.socials.linkedin },
      { label: "YouTube", href: site.socials.youtube },
    ],
  },
};

export type ContactContent = typeof contactContent;
