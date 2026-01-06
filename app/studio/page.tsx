"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Camera,
  Mic,
  Video,
  Lightbulb,
  Wifi,
  Coffee,
  Download,
  MapPin,
  X,
  ArrowRight,
} from "lucide-react";

export default function StudioPage() {
  const [selectedImage, setSelectedImage] = useState<number | null>(null);

  const galleryImages = Array.from({ length: 6 }, (_, i) => i + 1);

  return (
    <main className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative mx-auto max-w-7xl px-4 pt-32 pb-16 sm:px-6 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-16">
          {/* Content */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="flex flex-col justify-center"
          >
            <h1 className="mb-6 font-heading text-5xl font-bold md:text-6xl lg:text-7xl">
              The <span className="text-gradient-accent">Studio</span>
            </h1>
            <p className="mb-6 font-body text-xl text-text-secondary md:text-2xl">
              Professional podcast studio in the heart of London
            </p>
            <div className="mb-8">
              <span className="inline-flex items-center gap-2 rounded-full border border-accent-cyan/30 bg-accent-cyan/10 px-4 py-2 text-sm font-medium text-accent-cyan">
                <MapPin className="h-4 w-4" />
                5 mins from London Bridge Station
              </span>
            </div>
            <div className="flex flex-wrap gap-4">
              <motion.button
                className="rounded-full bg-accent-cyan px-8 py-4 font-heading text-lg font-semibold text-white transition-all duration-300 hover:scale-105 hover:glow-cyan"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Book a Tour
              </motion.button>
              <motion.button
                className="rounded-full border-2 border-accent-cyan bg-transparent px-8 py-4 font-heading text-lg font-semibold text-white transition-all duration-300 hover:bg-accent-cyan/10 hover:glow-cyan"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Get a Quote
              </motion.button>
            </div>
          </motion.div>

          {/* Studio Image Placeholder */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="relative aspect-[4/3] w-full overflow-hidden rounded-3xl"
          >
            <div className="h-full w-full bg-gradient-to-br from-accent-cyan/30 via-accent-purple/30 to-accent-orange/30" />
          </motion.div>
        </div>
      </section>

      {/* Gallery */}
      <section className="relative mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="mb-12 text-center font-heading text-4xl font-bold md:text-5xl">
            Studio <span className="text-gradient-accent">Gallery</span>
          </h2>
          <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
            {galleryImages.map((image, index) => (
              <motion.button
                key={image}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                onClick={() => setSelectedImage(image)}
                className="group relative aspect-square overflow-hidden rounded-2xl"
              >
                <div className="h-full w-full bg-gradient-to-br from-accent-cyan/20 via-accent-purple/20 to-accent-orange/20 transition-transform duration-300 group-hover:scale-110" />
                <div className="absolute inset-0 bg-black/0 transition-colors duration-300 group-hover:bg-black/20" />
              </motion.button>
            ))}
          </div>
        </motion.div>

        {/* Lightbox */}
        <AnimatePresence>
          {selectedImage !== null && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4"
              onClick={() => setSelectedImage(null)}
            >
              <motion.button
                className="absolute right-4 top-4 text-white"
                onClick={() => setSelectedImage(null)}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <X className="h-8 w-8" />
              </motion.button>
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.8, opacity: 0 }}
                className="relative max-h-[90vh] max-w-4xl"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="aspect-video w-full overflow-hidden rounded-2xl bg-gradient-to-br from-accent-cyan/30 via-accent-purple/30 to-accent-orange/30" />
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </section>

      {/* Equipment Grid */}
      <section className="relative mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="mb-12 text-center font-heading text-4xl font-bold md:text-5xl">
            Professional <span className="text-gradient-accent">Equipment</span>
          </h2>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {[
              {
                icon: Camera,
                title: "3x Sony A7 IV",
                description: "4K cameras for multi-angle recording",
              },
              {
                icon: Mic,
                title: "Shure SM7B",
                description: "Professional broadcast microphones",
              },
              {
                icon: Video,
                title: "ATEM Mini Pro ISO",
                description: "Live production switcher with ISO recording",
              },
              {
                icon: Lightbulb,
                title: "Professional LED Lighting",
                description: "Full studio lighting setup",
              },
            ].map((item, index) => {
              const Icon = item.icon;
              return (
                <motion.div
                  key={item.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className="rounded-2xl border border-background-tertiary bg-background-secondary/50 p-6 backdrop-blur-sm transition-all duration-300 hover:border-accent-cyan/50"
                >
                  <div className="mb-4 inline-flex rounded-xl bg-accent-cyan/10 p-3">
                    <Icon className="h-6 w-6 text-accent-cyan" />
                  </div>
                  <h3 className="mb-2 font-heading text-xl font-semibold text-white">
                    {item.title}
                  </h3>
                  <p className="font-body text-sm text-text-secondary">
                    {item.description}
                  </p>
                </motion.div>
              );
            })}
          </div>
        </motion.div>
      </section>

      {/* What's Included */}
      <section className="relative mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="mb-8 text-center font-heading text-4xl font-bold md:text-5xl">
            What's <span className="text-gradient-accent">Included</span>
          </h2>
          <div className="grid gap-4 md:grid-cols-2">
            {[
              { icon: Video, text: "On-site technical support" },
              { icon: Coffee, text: "Makeup room" },
              { icon: Coffee, text: "Green room" },
              { icon: Wifi, text: "High-speed WiFi" },
              { icon: Coffee, text: "Refreshments" },
              { icon: Download, text: "Same-day file transfer" },
            ].map((item, index) => {
              const Icon = item.icon;
              return (
                <motion.div
                  key={item.text}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="flex items-center gap-4 rounded-2xl border border-background-tertiary bg-background-secondary/50 p-4 backdrop-blur-sm"
                >
                  <div className="flex-shrink-0">
                    <div className="rounded-lg bg-accent-cyan/10 p-2">
                      <Icon className="h-5 w-5 text-accent-cyan" />
                    </div>
                  </div>
                  <span className="font-body text-text-secondary">
                    {item.text}
                  </span>
                </motion.div>
              );
            })}
          </div>
        </motion.div>
      </section>

      {/* Booking Options */}
      <section className="relative mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="mb-12 text-center font-heading text-4xl font-bold md:text-5xl">
            Booking <span className="text-gradient-accent">Options</span>
          </h2>
          <div className="grid gap-6 md:grid-cols-3">
            {[
              {
                title: "Half Day",
                duration: "4 hours",
                description: "Perfect for single episode recordings",
              },
              {
                title: "Full Day",
                duration: "8 hours",
                description: "Ideal for multiple episodes or longer formats",
              },
              {
                title: "Custom/Ongoing",
                duration: "Contact us",
                description: "Regular bookings? Let's discuss your needs",
              },
            ].map((option, index) => (
              <motion.div
                key={option.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="rounded-2xl border border-background-tertiary bg-background-secondary/50 p-8 backdrop-blur-sm transition-all duration-300 hover:border-accent-cyan/50"
              >
                <h3 className="mb-2 font-heading text-2xl font-bold text-white">
                  {option.title}
                </h3>
                <p className="mb-4 font-heading text-xl font-semibold text-accent-cyan">
                  {option.duration}
                </p>
                <p className="mb-6 font-body text-text-secondary">
                  {option.description}
                </p>
                <motion.button
                  className="w-full rounded-full border-2 border-accent-cyan bg-transparent px-6 py-3 font-heading text-sm font-semibold text-white transition-all duration-300 hover:bg-accent-cyan/10 hover:glow-cyan"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  {option.title === "Custom/Ongoing" ? "Get Quote" : "Book Now"}
                </motion.button>
              </motion.div>
            ))}
          </div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="mt-8 rounded-2xl border border-accent-purple/30 bg-accent-purple/10 p-6 text-center"
          >
            <p className="font-body text-sm text-text-secondary">
              <span className="font-semibold text-accent-purple">
                Network members
              </span>{" "}
              get priority booking and exclusive discounts
            </p>
          </motion.div>
        </motion.div>
      </section>

      {/* Location */}
      <section className="relative mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="mb-12 text-center font-heading text-4xl font-bold md:text-5xl">
            Find <span className="text-gradient-accent">Us</span>
          </h2>
          <div className="grid gap-8 lg:grid-cols-2">
            {/* Map Placeholder */}
            <div className="relative aspect-square w-full overflow-hidden rounded-2xl">
              <div className="h-full w-full bg-gradient-to-br from-accent-cyan/20 via-accent-purple/20 to-accent-orange/20" />
              {/* Note: Replace with actual Google Maps embed or similar */}
              <div className="absolute inset-0 flex items-center justify-center">
                <p className="font-body text-sm text-text-muted">
                  Map integration placeholder
                </p>
              </div>
            </div>

            {/* Address & Transport */}
            <div className="flex flex-col justify-center">
              <div className="mb-6">
                <h3 className="mb-4 font-heading text-2xl font-semibold text-white">
                  Address
                </h3>
                <p className="font-body text-text-secondary">
                  Lucky Studios
                  <br />
                  London Bridge
                  <br />
                  London, UK
                </p>
              </div>
              <div>
                <h3 className="mb-4 font-heading text-2xl font-semibold text-white">
                  Transport
                </h3>
                <ul className="space-y-2 font-body text-text-secondary">
                  <li>🚇 London Bridge Station (5 min walk)</li>
                  <li>🚇 Borough Station (7 min walk)</li>
                  <li>🚌 Multiple bus routes nearby</li>
                </ul>
              </div>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Final CTA */}
      <section className="relative mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="relative overflow-hidden rounded-3xl border border-accent-cyan/30 bg-gradient-to-br from-background-secondary to-background-tertiary p-12 text-center"
        >
          <div className="absolute inset-0 bg-gradient-glow opacity-30" />
          <div className="relative z-10">
            <h2 className="mb-6 font-heading text-4xl font-bold md:text-5xl">
              Ready to <span className="text-gradient-accent">Create</span>?
            </h2>
            <p className="mb-8 font-body text-lg text-text-secondary">
              Book a tour or schedule your recording session
            </p>
            {/* Calendly Embed Placeholder */}
            <div className="mx-auto max-w-2xl rounded-2xl border border-background-tertiary bg-background-secondary/50 p-8 backdrop-blur-sm">
              <p className="mb-4 font-body text-sm text-text-muted">
                Calendly booking widget will be embedded here
              </p>
              <motion.button
                className="inline-flex items-center gap-2 rounded-full bg-accent-cyan px-8 py-4 font-heading text-lg font-semibold text-white transition-all duration-300 hover:scale-105 hover:glow-cyan"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Schedule a Call
                <ArrowRight className="h-5 w-5" />
              </motion.button>
            </div>
          </div>
        </motion.div>
      </section>
    </main>
  );
}

