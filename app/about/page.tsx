"use client";

import { motion } from "framer-motion";
import { ArrowRight, Users, Target, Handshake, TrendingUp } from "lucide-react";
import Link from "next/link";

const teamMembers = [
  {
    name: "Curtis Morton",
    role: "Head of Talent & Podcasting",
    bio: "Building the UK's most creator-friendly podcast network",
  },
  {
    name: "Bartosz Struzyna",
    role: "Lead Producer (SP IP)",
    bio: "Expert in IP development and content strategy",
  },
  {
    name: "Aidan Rafferty",
    role: "Lead Producer (Talent)",
    bio: "Specializing in talent development and show production",
  },
  {
    name: "Baxter Fenwick",
    role: "Producer",
    bio: "Bringing creative visions to life through production",
  },
];

const values = [
  {
    icon: Users,
    title: "Creator-First",
    description:
      "We put creators at the center of everything. Your success is our success.",
  },
  {
    icon: Target,
    title: "Quality Over Quantity",
    description:
      "We focus on building exceptional shows, not just filling a roster.",
  },
  {
    icon: Handshake,
    title: "Authentic Partnerships",
    description:
      "Real relationships with brands and creators built on trust and results.",
  },
  {
    icon: TrendingUp,
    title: "Long-term Growth",
    description:
      "We're in it for the long haul, investing in sustainable growth for all.",
  },
];

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative mx-auto max-w-7xl px-4 pt-32 pb-16 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mx-auto max-w-4xl text-center"
        >
          <h1 className="mb-6 font-heading text-5xl font-bold md:text-6xl lg:text-7xl">
            About <span className="text-gradient-accent">Lucky Studios</span>
          </h1>
          <p className="font-body text-xl text-text-secondary md:text-2xl">
            London's creator-first podcast network
          </p>
        </motion.div>
      </section>

      {/* Our Story */}
      <section className="relative mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="mb-8 font-heading text-4xl font-bold md:text-5xl">
            Our <span className="text-gradient-accent">Story</span>
          </h2>
          <div className="space-y-6 font-body text-lg leading-relaxed text-text-secondary">
            <p>
              Lucky Studios was born from a simple belief: creators deserve
              better. Too many podcast networks treat talent as content factories,
              prioritizing volume over quality and growth.
            </p>
            <p>
              We set out to build something different—a network that puts
              creators first, providing the resources, support, and platform
              they need to build authentic, successful shows.
            </p>
            <p>
              As part of{" "}
              <span className="font-semibold text-white">Socially Powerful</span>
              , we combine creator-first values with global agency backing,
              giving our network access to industry expertise and a 15M+
              influencer following.
            </p>
            <div className="mt-8 rounded-2xl border border-accent-orange/30 bg-accent-orange/10 p-6">
              <p className="font-heading text-xl font-semibold text-white">
                Our Mission
              </p>
              <p className="mt-2 font-body text-lg text-text-secondary">
                Build the UK's most creator-friendly podcast network
              </p>
            </div>
          </div>
        </motion.div>
      </section>

      {/* SP Connection Card */}
      <section className="relative mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="relative overflow-hidden rounded-3xl border border-accent-purple/30 bg-gradient-to-br from-background-secondary to-background-tertiary p-12 md:p-16"
        >
          <div className="absolute inset-0 bg-gradient-glow opacity-30" />
          <div className="relative z-10">
            <div className="mb-8 grid gap-8 md:grid-cols-2">
              <div>
                <h2 className="mb-6 font-heading text-4xl font-bold md:text-5xl">
                  Part of{" "}
                  <span className="text-gradient-accent">Socially Powerful</span>
                </h2>
                <p className="mb-8 font-body text-lg text-text-secondary">
                  Lucky Studios is backed by Socially Powerful, a global
                  influencer marketing agency. This partnership gives our network
                  unique advantages:
                </p>
                <ul className="space-y-4">
                  {[
                    "Access to 15M+ influencer following",
                    "Global agency backing",
                    "Industry expertise",
                  ].map((item, index) => (
                    <motion.li
                      key={item}
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.5, delay: index * 0.1 }}
                      className="flex items-center gap-3 font-body text-text-secondary"
                    >
                      <div className="h-2 w-2 rounded-full bg-accent-purple" />
                      {item}
                    </motion.li>
                  ))}
                </ul>
              </div>
              <div className="flex items-center justify-center">
                {/* Socially Powerful Logo Placeholder */}
                <div className="rounded-2xl border border-background-tertiary bg-background-secondary/50 p-12 backdrop-blur-sm">
                  <p className="font-heading text-2xl font-bold text-white">
                    Socially Powerful
                  </p>
                </div>
              </div>
            </div>
            <Link
              href="https://sociallypowerful.com"
              target="_blank"
              rel="noopener noreferrer"
            >
              <motion.button
                className="inline-flex items-center gap-2 rounded-full border-2 border-accent-purple bg-transparent px-6 py-3 font-heading text-sm font-semibold text-white transition-all duration-300 hover:bg-accent-purple/10 hover:glow-purple"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Learn More About Socially Powerful
                <ArrowRight className="h-4 w-4" />
              </motion.button>
            </Link>
          </div>
        </motion.div>
      </section>

      {/* Team Grid */}
      <section className="relative mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="mb-12 text-center font-heading text-4xl font-bold md:text-5xl">
            Our <span className="text-gradient-accent">Team</span>
          </h2>
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            {teamMembers.map((member, index) => (
              <motion.div
                key={member.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="text-center"
              >
                {/* Photo Placeholder */}
                <div className="mb-4 flex justify-center">
                  <div className="h-32 w-32 rounded-full bg-gradient-to-br from-accent-orange/30 via-accent-purple/30 to-accent-cyan/30" />
                </div>
                <h3 className="mb-2 font-heading text-xl font-semibold text-white">
                  {member.name}
                </h3>
                <p className="mb-3 font-body text-sm font-medium text-accent-purple">
                  {member.role}
                </p>
                <p className="font-body text-sm text-text-secondary">
                  {member.bio}
                </p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* Values */}
      <section className="relative mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="mb-12 text-center font-heading text-4xl font-bold md:text-5xl">
            Our <span className="text-gradient-accent">Values</span>
          </h2>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {values.map((value, index) => {
              const Icon = value.icon;
              return (
                <motion.div
                  key={value.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className="rounded-2xl border border-background-tertiary bg-background-secondary/50 p-6 backdrop-blur-sm transition-all duration-300 hover:border-accent-orange/50"
                >
                  <div className="mb-4 inline-flex rounded-xl bg-accent-orange/10 p-3">
                    <Icon className="h-6 w-6 text-accent-orange" />
                  </div>
                  <h3 className="mb-3 font-heading text-xl font-semibold text-white">
                    {value.title}
                  </h3>
                  <p className="font-body text-sm text-text-secondary">
                    {value.description}
                  </p>
                </motion.div>
              );
            })}
          </div>
        </motion.div>
      </section>

      {/* Contact CTA */}
      <section className="relative mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="relative overflow-hidden rounded-3xl border border-accent-orange/30 bg-gradient-to-br from-background-secondary to-background-tertiary p-12 text-center"
        >
          <div className="absolute inset-0 bg-gradient-glow opacity-30" />
          <div className="relative z-10">
            <h2 className="mb-6 font-heading text-4xl font-bold md:text-5xl">
              Want to <span className="text-gradient-accent">Work With Us</span>?
            </h2>
            <p className="mb-8 font-body text-lg text-text-secondary">
              Choose your path based on who you are
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link href="/creators">
                <motion.button
                  className="rounded-full border-2 border-accent-purple bg-transparent px-8 py-4 font-heading text-lg font-semibold text-white transition-all duration-300 hover:bg-accent-purple/10 hover:glow-purple"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  I'm a Creator
                </motion.button>
              </Link>
              <Link href="/brands">
                <motion.button
                  className="rounded-full border-2 border-accent-cyan bg-transparent px-8 py-4 font-heading text-lg font-semibold text-white transition-all duration-300 hover:bg-accent-cyan/10 hover:glow-cyan"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  I'm a Brand
                </motion.button>
              </Link>
              <Link href="/studio">
                <motion.button
                  className="rounded-full border-2 border-accent-orange bg-transparent px-8 py-4 font-heading text-lg font-semibold text-white transition-all duration-300 hover:bg-accent-orange/10 hover:glow-orange"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Book the Studio
                </motion.button>
              </Link>
            </div>
          </div>
        </motion.div>
      </section>
    </main>
  );
}

