"use client";

import { motion } from "framer-motion";
import { Twitter, Instagram, Linkedin, Youtube } from "lucide-react";
import Logo from "@/components/ui/Logo";

const footerNav = [
  { name: "Our Shows", href: "#shows" },
  { name: "For Creators", href: "#creators" },
  { name: "For Brands", href: "#brands" },
  { name: "The Studio", href: "#studio" },
  { name: "About", href: "#about" },
];

const contactInfo = [
  { label: "Email", value: "hello@luckystudios.com", href: "mailto:hello@luckystudios.com" },
  { label: "Phone", value: "+44 20 1234 5678", href: "tel:+442012345678" },
];

const socialLinks = [
  { name: "Twitter", icon: Twitter, href: "#" },
  { name: "Instagram", icon: Instagram, href: "#" },
  { name: "LinkedIn", icon: Linkedin, href: "#" },
  { name: "YouTube", icon: Youtube, href: "#" },
];

export default function Footer() {
  return (
    <footer className="relative border-t border-background-tertiary bg-background">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        {/* Logo Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mb-12 flex justify-center"
        >
          <Logo size="md" />
        </motion.div>
        
        <div className="grid grid-cols-1 gap-12 md:grid-cols-3">
          {/* Navigation Column */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <h3 className="mb-6 font-heading text-lg font-semibold text-white">
              Navigation
            </h3>
            <ul className="space-y-3">
              {footerNav.map((link) => (
                <li key={link.name}>
                  <a
                    href={link.href}
                    className="font-body text-sm text-text-secondary transition-colors hover:text-accent-orange"
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Contact Column */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <h3 className="mb-6 font-heading text-lg font-semibold text-white">
              Contact
            </h3>
            <ul className="space-y-3">
              {contactInfo.map((item) => (
                <li key={item.label}>
                  <a
                    href={item.href}
                    className="font-body text-sm text-text-secondary transition-colors hover:text-accent-orange"
                  >
                    <span className="block font-medium text-white">{item.label}</span>
                    {item.value}
                  </a>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Social Column */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <h3 className="mb-6 font-heading text-lg font-semibold text-white">
              Follow Us
            </h3>
            <div className="flex gap-4">
              {socialLinks.map((social) => {
                const Icon = social.icon;
                return (
                  <motion.a
                    key={social.name}
                    href={social.href}
                    className="rounded-full border border-background-tertiary bg-background-secondary p-3 text-text-secondary transition-all duration-300 hover:border-accent-orange hover:text-accent-orange hover:glow-orange"
                    whileHover={{ scale: 1.1, y: -2 }}
                    whileTap={{ scale: 0.9 }}
                    aria-label={social.name}
                  >
                    <Icon className="h-5 w-5" />
                  </motion.a>
                );
              })}
            </div>
          </motion.div>
        </div>

        {/* Badge and Copyright */}
        <div className="mt-12 border-t border-background-tertiary pt-8">
          <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="rounded-full border border-accent-purple/30 bg-background-secondary px-4 py-2"
            >
              <span className="font-body text-xs font-medium text-text-secondary">
                Part of{" "}
                <span className="text-accent-purple">Socially Powerful</span>
              </span>
            </motion.div>
            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="font-body text-sm text-text-muted"
            >
              © 2026 Lucky Studios. All rights reserved.
            </motion.p>
          </div>
        </div>
      </div>
    </footer>
  );
}

