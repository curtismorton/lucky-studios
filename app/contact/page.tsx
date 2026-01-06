"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { motion, AnimatePresence } from "framer-motion";
import {
  Mail,
  MapPin,
  Calendar,
  Twitter,
  Instagram,
  Linkedin,
  Youtube,
  ChevronDown,
  Loader2,
} from "lucide-react";

interface ContactFormData {
  name: string;
  email: string;
  company: string;
  interest: string;
  message: string;
}

const interestOptions = [
  "Joining as a creator",
  "Brand partnership",
  "Studio rental",
  "General inquiry",
];

const faqs = [
  {
    question: "How quickly will I receive a response?",
    answer:
      "We aim to respond to all inquiries within 24-48 hours during business days. For urgent matters, please call or use our Calendly to schedule a meeting.",
  },
  {
    question: "Do you work with creators outside the UK?",
    answer:
      "While our studio is in London, we work with creators globally. Remote recording setups and virtual collaboration are available for international partnerships.",
  },
  {
    question: "What information should I include in my inquiry?",
    answer:
      "Please include your name, contact information, and a brief description of what you're looking for. For creator applications, tell us about your show concept. For brand partnerships, share your goals and target audience.",
  },
  {
    question: "Can I visit the studio before booking?",
    answer:
      "Absolutely! We offer studio tours. Use the 'Book a Tour' button or schedule a call through Calendly to arrange a visit.",
  },
];

export default function ContactPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ContactFormData>();

  const onSubmit = async (data: ContactFormData) => {
    setIsSubmitting(true);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500));
    console.log("Form submitted:", data);
    setIsSubmitting(false);
    reset();
    // In production, you'd show a success message here
  };

  return (
    <main className="min-h-screen bg-background">
      {/* Hero */}
      <section className="relative mx-auto max-w-7xl px-4 pt-32 pb-16 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mx-auto max-w-4xl text-center"
        >
          <h1 className="mb-4 sm:mb-6 font-heading text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold">
            Get in <span className="text-gradient-accent">Touch</span>
          </h1>
          <p className="font-body text-base sm:text-lg md:text-xl text-text-secondary">
            Have a question? We'd love to hear from you.
          </p>
        </motion.div>
      </section>

      {/* Two Column Layout */}
      <section className="relative mx-auto max-w-7xl px-4 pb-16 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 sm:gap-12 lg:grid-cols-2">
          {/* Left - Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="mb-6 font-heading text-3xl font-bold md:text-4xl">
              Send us a Message
            </h2>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              {/* Name */}
              <div>
                <label
                  htmlFor="name"
                  className="mb-2 block font-body text-sm font-medium text-white"
                >
                  Name <span className="text-accent-orange">*</span>
                </label>
                <input
                  id="name"
                  type="text"
                  {...register("name", { required: "Name is required" })}
                  className="w-full rounded-lg border border-background-tertiary bg-background-secondary/50 px-4 py-3 font-body text-white placeholder:text-text-muted focus:border-accent-orange focus:outline-none focus:ring-2 focus:ring-accent-orange/20"
                  placeholder="Your name"
                  aria-invalid={errors.name ? "true" : "false"}
                  aria-describedby={errors.name ? "name-error" : undefined}
                />
                {errors.name && (
                  <p
                    id="name-error"
                    className="mt-1 font-body text-sm text-accent-orange"
                    role="alert"
                  >
                    {errors.name.message}
                  </p>
                )}
              </div>

              {/* Email */}
              <div>
                <label
                  htmlFor="email"
                  className="mb-2 block font-body text-sm font-medium text-white"
                >
                  Email <span className="text-accent-orange">*</span>
                </label>
                <input
                  id="email"
                  type="email"
                  {...register("email", {
                    required: "Email is required",
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                      message: "Invalid email address",
                    },
                  })}
                  className="w-full rounded-lg border border-background-tertiary bg-background-secondary/50 px-4 py-3 font-body text-white placeholder:text-text-muted focus:border-accent-orange focus:outline-none focus:ring-2 focus:ring-accent-orange/20"
                  placeholder="your.email@example.com"
                  aria-invalid={errors.email ? "true" : "false"}
                  aria-describedby={errors.email ? "email-error" : undefined}
                />
                {errors.email && (
                  <p
                    id="email-error"
                    className="mt-1 font-body text-sm text-accent-orange"
                    role="alert"
                  >
                    {errors.email.message}
                  </p>
                )}
              </div>

              {/* Company */}
              <div>
                <label
                  htmlFor="company"
                  className="mb-2 block font-body text-sm font-medium text-white"
                >
                  Company
                </label>
                <input
                  id="company"
                  type="text"
                  {...register("company")}
                  className="w-full rounded-lg border border-background-tertiary bg-background-secondary/50 px-4 py-3 font-body text-white placeholder:text-text-muted focus:border-accent-orange focus:outline-none focus:ring-2 focus:ring-accent-orange/20"
                  placeholder="Your company (optional)"
                />
              </div>

              {/* Interest Dropdown */}
              <div>
                <label
                  htmlFor="interest"
                  className="mb-2 block font-body text-sm font-medium text-white"
                >
                  I'm interested in: <span className="text-accent-orange">*</span>
                </label>
                <select
                  id="interest"
                  {...register("interest", {
                    required: "Please select an option",
                  })}
                  className="w-full rounded-lg border border-background-tertiary bg-background-secondary/50 px-4 py-3 font-body text-white focus:border-accent-orange focus:outline-none focus:ring-2 focus:ring-accent-orange/20"
                  aria-invalid={errors.interest ? "true" : "false"}
                  aria-describedby={
                    errors.interest ? "interest-error" : undefined
                  }
                >
                  <option value="">Select an option</option>
                  {interestOptions.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
                {errors.interest && (
                  <p
                    id="interest-error"
                    className="mt-1 font-body text-sm text-accent-orange"
                    role="alert"
                  >
                    {errors.interest.message}
                  </p>
                )}
              </div>

              {/* Message */}
              <div>
                <label
                  htmlFor="message"
                  className="mb-2 block font-body text-sm font-medium text-white"
                >
                  Message <span className="text-accent-orange">*</span>
                </label>
                <textarea
                  id="message"
                  rows={6}
                  {...register("message", {
                    required: "Message is required",
                    minLength: {
                      value: 10,
                      message: "Message must be at least 10 characters",
                    },
                  })}
                  className="w-full rounded-lg border border-background-tertiary bg-background-secondary/50 px-4 py-3 font-body text-white placeholder:text-text-muted focus:border-accent-orange focus:outline-none focus:ring-2 focus:ring-accent-orange/20"
                  placeholder="Tell us about your inquiry..."
                  aria-invalid={errors.message ? "true" : "false"}
                  aria-describedby={
                    errors.message ? "message-error" : undefined
                  }
                />
                {errors.message && (
                  <p
                    id="message-error"
                    className="mt-1 font-body text-sm text-accent-orange"
                    role="alert"
                  >
                    {errors.message.message}
                  </p>
                )}
              </div>

              {/* Submit Button */}
              <motion.button
                type="submit"
                disabled={isSubmitting}
                className="w-full rounded-full bg-accent-orange px-6 py-3 sm:px-8 sm:py-4 font-heading text-base sm:text-lg font-semibold text-white transition-all duration-300 hover:scale-105 hover:glow-orange disabled:cursor-not-allowed disabled:opacity-50 touch-manipulation min-h-[44px]"
                whileHover={{ scale: isSubmitting ? 1 : 1.05 }}
                whileTap={{ scale: isSubmitting ? 1 : 0.95 }}
              >
                {isSubmitting ? (
                  <span className="flex items-center justify-center gap-2">
                    <Loader2 className="h-5 w-5 animate-spin" />
                    Sending...
                  </span>
                ) : (
                  "Send Message"
                )}
              </motion.button>
            </form>
          </motion.div>

          {/* Right - Direct Contact */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="mb-6 font-heading text-3xl font-bold md:text-4xl">
              Direct Contact
            </h2>
            <div className="space-y-8">
              {/* Email */}
              <div>
                <div className="mb-3 flex items-center gap-3">
                  <div className="rounded-lg bg-accent-orange/10 p-2">
                    <Mail className="h-5 w-5 text-accent-orange" />
                  </div>
                  <h3 className="font-heading text-lg font-semibold text-white">
                    Email
                  </h3>
                </div>
                <a
                  href="mailto:hello@weareluckystudios.com"
                  className="font-body text-text-secondary transition-colors hover:text-accent-orange"
                >
                  hello@weareluckystudios.com
                </a>
              </div>

              {/* Address */}
              <div>
                <div className="mb-3 flex items-center gap-3">
                  <div className="rounded-lg bg-accent-purple/10 p-2">
                    <MapPin className="h-5 w-5 text-accent-purple" />
                  </div>
                  <h3 className="font-heading text-lg font-semibold text-white">
                    Address
                  </h3>
                </div>
                <p className="font-body text-text-secondary">
                  London Bridge
                  <br />
                  London, UK
                </p>
              </div>

              {/* Calendly Embed */}
              <div>
                <div className="mb-3 flex items-center gap-3">
                  <div className="rounded-lg bg-accent-cyan/10 p-2">
                    <Calendar className="h-5 w-5 text-accent-cyan" />
                  </div>
                  <h3 className="font-heading text-lg font-semibold text-white">
                    Book a Call
                  </h3>
                </div>
                <div className="rounded-2xl border border-background-tertiary bg-background-secondary/50 p-6 backdrop-blur-sm">
                  <p className="mb-4 font-body text-sm text-text-muted">
                    Calendly booking widget will be embedded here
                  </p>
                  <motion.button
                    className="w-full rounded-full border-2 border-accent-cyan bg-transparent px-6 py-3 font-heading text-sm font-semibold text-white transition-all duration-300 hover:bg-accent-cyan/10 hover:glow-cyan"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    Schedule a Meeting
                  </motion.button>
                </div>
              </div>

              {/* Social Links */}
              <div>
                <h3 className="mb-4 font-heading text-lg font-semibold text-white">
                  Follow Us
                </h3>
                <div className="flex gap-4">
                  {[
                    { icon: Twitter, href: "#", label: "Twitter" },
                    { icon: Instagram, href: "#", label: "Instagram" },
                    { icon: Linkedin, href: "#", label: "LinkedIn" },
                    { icon: Youtube, href: "#", label: "YouTube" },
                  ].map((social) => {
                    const Icon = social.icon;
                    return (
                      <motion.a
                        key={social.label}
                        href={social.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="rounded-full border border-background-tertiary bg-background-secondary/50 p-3 text-text-secondary transition-all duration-300 hover:border-accent-orange hover:text-accent-orange hover:glow-orange"
                        whileHover={{ scale: 1.1, y: -2 }}
                        whileTap={{ scale: 0.9 }}
                        aria-label={social.label}
                      >
                        <Icon className="h-5 w-5" />
                      </motion.a>
                    );
                  })}
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="relative mx-auto max-w-4xl px-4 pb-24 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="mb-12 text-center font-heading text-4xl font-bold md:text-5xl">
            Frequently Asked <span className="text-gradient-accent">Questions</span>
          </h2>
          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="overflow-hidden rounded-2xl border border-background-tertiary bg-background-secondary/50 backdrop-blur-sm"
              >
                <button
                  onClick={() =>
                    setExpandedFaq(expandedFaq === index ? null : index)
                  }
                  className="flex w-full items-center justify-between p-6 text-left font-heading text-lg font-semibold text-white transition-colors hover:text-accent-orange"
                  aria-expanded={expandedFaq === index}
                  aria-controls={`faq-answer-${index}`}
                >
                  <span>{faq.question}</span>
                  <motion.div
                    animate={{
                      rotate: expandedFaq === index ? 180 : 0,
                    }}
                    transition={{ duration: 0.3 }}
                  >
                    <ChevronDown className="h-5 w-5" />
                  </motion.div>
                </button>
                <AnimatePresence>
                  {expandedFaq === index && (
                    <motion.div
                      id={`faq-answer-${index}`}
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="overflow-hidden"
                    >
                      <div className="px-6 pb-6">
                        <p className="font-body text-text-secondary">
                          {faq.answer}
                        </p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>
    </main>
  );
}

