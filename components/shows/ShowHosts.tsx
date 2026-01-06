"use client";

import { motion } from "framer-motion";
import { Twitter, Instagram } from "lucide-react";
import { type Host } from "@/lib/data/shows";

interface ShowHostsProps {
  hosts: Host[];
}

export default function ShowHosts({ hosts }: ShowHostsProps) {
  return (
    <section className="relative mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
      >
        <h2 className="mb-12 font-heading text-3xl font-bold md:text-4xl">
          Hosts
        </h2>
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {hosts.map((host, index) => (
            <motion.div
              key={host.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="text-center"
            >
              {/* Photo Placeholder */}
              <div className="mb-4 flex justify-center">
                <div className="h-24 w-24 rounded-full bg-gradient-to-br from-accent-orange/30 via-accent-purple/30 to-accent-cyan/30" />
              </div>
              <h3 className="mb-2 font-heading text-xl font-semibold text-white">
                {host.name}
              </h3>
              <p className="mb-4 font-body text-sm text-text-secondary">
                {host.role}
              </p>
              {/* Social Links */}
              {host.social && (
                <div className="flex justify-center gap-3">
                  {host.social.twitter && (
                    <motion.a
                      href={`https://twitter.com/${host.social.twitter.replace('@', '')}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="rounded-full border border-background-tertiary bg-background-secondary/50 p-2 text-text-secondary transition-all duration-300 hover:border-accent-orange/50 hover:text-accent-orange"
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                    >
                      <Twitter className="h-4 w-4" />
                    </motion.a>
                  )}
                  {host.social.instagram && (
                    <motion.a
                      href={`https://instagram.com/${host.social.instagram.replace('@', '')}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="rounded-full border border-background-tertiary bg-background-secondary/50 p-2 text-text-secondary transition-all duration-300 hover:border-accent-orange/50 hover:text-accent-orange"
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                    >
                      <Instagram className="h-4 w-4" />
                    </motion.a>
                  )}
                </div>
              )}
            </motion.div>
          ))}
        </div>
      </motion.div>
    </section>
  );
}

