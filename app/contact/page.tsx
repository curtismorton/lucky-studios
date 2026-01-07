import { Metadata } from "next";
import ContactPageClient from "./ContactPageClient";

export const metadata: Metadata = {
  title: "Contact Us",
  description:
    "Get in touch with Lucky Studios. Contact us about joining as a creator, brand partnerships, studio rental, or general inquiries.",
  keywords: [
    "contact Lucky Studios",
    "podcast network contact",
    "studio rental inquiry",
    "creator application",
    "brand partnership inquiry",
  ],
  openGraph: {
    title: "Contact Us | Lucky Studios",
    description:
      "Have a question? We'd love to hear from you. Contact Lucky Studios for creator applications, brand partnerships, or studio rental.",
    type: "website",
    url: "https://luckystudios.com/contact",
  },
};

export default function ContactPage() {
  return <ContactPageClient />;
}
