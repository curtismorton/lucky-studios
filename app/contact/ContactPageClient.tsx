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
  Globe,
  ChevronDown,
  Loader2,
  CheckCircle2,
  AlertTriangle,
} from "lucide-react";
import Logo from "@/components/ui/Logo";
import { site } from "@/lib/data/site";
import {
  defaultMarketingPagesContent,
  type ContactPageContent,
} from "@/lib/data/marketingContent";

interface ContactFormData {
  name: string;
  email: string;
  company: string;
  interest: string;
  message: string;
}

interface ContactPageClientProps {
  content?: ContactPageContent;
  formEndpoint?: string;
}

function getSocialIcon(label: string) {
  const normalized = label.toLowerCase();
  if (normalized.includes("twitter") || normalized.includes("x")) return Twitter;
  if (normalized.includes("instagram")) return Instagram;
  if (normalized.includes("linkedin")) return Linkedin;
  if (normalized.includes("youtube")) return Youtube;
  return Globe;
}

export default function ContactPageClient({
  content,
  formEndpoint = "",
}: ContactPageClientProps) {
  const page = content || defaultMarketingPagesContent.contact;
  const hasFormEndpoint = formEndpoint.trim().length > 0;

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);
  const [submitError, setSubmitError] = useState("");
  const [submitSuccess, setSubmitSuccess] = useState("");

  const bookingHref = site.calendlyUrl || "/contact";
  const bookingTarget = site.calendlyUrl ? "_blank" : undefined;
  const bookingRel = site.calendlyUrl ? "noopener noreferrer" : undefined;

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ContactFormData>();

  const onSubmit = async (data: ContactFormData) => {
    setSubmitError("");
    setSubmitSuccess("");

    if (!hasFormEndpoint) {
      setSubmitError(
        "Contact form is not configured yet. Please email us directly and set CONTACT_FORM_ENDPOINT."
      );
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await fetch(formEndpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          ...data,
          source: "luckystudios.com/contact",
        }),
      });

      if (!response.ok) {
        const payload = await response.json().catch(() => null);
        throw new Error(
          payload?.error || payload?.message || "Form submission failed"
        );
      }

      setSubmitSuccess("Message sent. We'll get back to you within 1-2 business days.");
      reset();
    } catch (error) {
      setSubmitError(
        error instanceof Error
          ? error.message
          : "Could not send your message. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen bg-background">
      <section className="relative mx-auto max-w-7xl px-4 pb-16 pt-32 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mx-auto max-w-4xl text-center"
        >
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="mb-8 flex justify-center"
          >
            <Logo size="md" showLink={false} />
          </motion.div>

          <h1 className="mb-4 font-heading text-3xl font-bold sm:mb-6 sm:text-4xl md:text-5xl lg:text-6xl">
            {page.hero.titleLead} <span className="text-gradient-accent">{page.hero.titleAccent}</span>
          </h1>
          <p className="font-body text-base text-text-secondary sm:text-lg md:text-xl">
            {page.hero.subtitle}
          </p>
        </motion.div>
      </section>

      <section className="relative mx-auto max-w-7xl px-4 pb-16 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 sm:gap-12 lg:grid-cols-2">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="mb-4 font-heading text-2xl font-bold sm:mb-6 sm:text-3xl md:text-4xl">
              {page.form.title}
            </h2>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 sm:space-y-6">
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
                />
                {errors.name && (
                  <p className="mt-1 font-body text-sm text-accent-orange" role="alert">
                    {errors.name.message}
                  </p>
                )}
              </div>

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
                />
                {errors.email && (
                  <p className="mt-1 font-body text-sm text-accent-orange" role="alert">
                    {errors.email.message}
                  </p>
                )}
              </div>

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

              <div>
                <label
                  htmlFor="interest"
                  className="mb-2 block font-body text-sm font-medium text-white"
                >
                  I&apos;m interested in: <span className="text-accent-orange">*</span>
                </label>
                <select
                  id="interest"
                  {...register("interest", {
                    required: "Please select an option",
                  })}
                  className="min-h-[44px] w-full rounded-lg border border-background-tertiary bg-background-secondary/50 px-4 py-3 font-body text-white focus:border-accent-orange focus:outline-none focus:ring-2 focus:ring-accent-orange/20"
                  aria-invalid={errors.interest ? "true" : "false"}
                >
                  <option value="">Select an option</option>
                  {page.form.interestOptions.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
                {errors.interest && (
                  <p className="mt-1 font-body text-sm text-accent-orange" role="alert">
                    {errors.interest.message}
                  </p>
                )}
              </div>

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
                />
                {errors.message && (
                  <p className="mt-1 font-body text-sm text-accent-orange" role="alert">
                    {errors.message.message}
                  </p>
                )}
              </div>

              <motion.button
                type="submit"
                disabled={isSubmitting || !hasFormEndpoint}
                className="min-h-[44px] w-full rounded-full bg-accent-orange px-6 py-3 font-heading text-base font-semibold text-white transition-all duration-300 hover:scale-105 hover:glow-orange disabled:cursor-not-allowed disabled:opacity-50 sm:px-8 sm:py-4 sm:text-lg"
                whileHover={{ scale: isSubmitting || !hasFormEndpoint ? 1 : 1.05 }}
                whileTap={{ scale: isSubmitting || !hasFormEndpoint ? 1 : 0.95 }}
              >
                {isSubmitting ? (
                  <span className="flex items-center justify-center gap-2">
                    <Loader2 className="h-5 w-5 animate-spin" />
                    {page.form.sendingLabel}
                  </span>
                ) : (
                  page.form.submitLabel
                )}
              </motion.button>

              <AnimatePresence mode="wait">
                {submitError ? (
                  <motion.p
                    key="error"
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    className="flex items-center gap-2 text-sm text-red-300"
                  >
                    <AlertTriangle className="h-4 w-4" />
                    {submitError}
                  </motion.p>
                ) : null}

                {submitSuccess ? (
                  <motion.p
                    key="success"
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    className="flex items-center gap-2 text-sm text-emerald-300"
                  >
                    <CheckCircle2 className="h-4 w-4" />
                    {submitSuccess}
                  </motion.p>
                ) : null}
              </AnimatePresence>

              {!hasFormEndpoint && !submitError && (
                <p className="text-xs text-text-muted">
                  Configure <code>CONTACT_FORM_ENDPOINT</code> to enable form submissions.
                </p>
              )}
            </form>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="mb-4 font-heading text-2xl font-bold sm:mb-6 sm:text-3xl md:text-4xl">
              {page.direct.title}
            </h2>
            <div className="space-y-6 sm:space-y-8">
              <div>
                <div className="mb-3 flex items-center gap-3">
                  <div className="rounded-lg bg-accent-orange/10 p-2">
                    <Mail className="h-4 w-4 text-accent-orange sm:h-5 sm:w-5" />
                  </div>
                  <h3 className="font-heading text-base font-semibold text-white sm:text-lg">
                    Email
                  </h3>
                </div>
                <a
                  href={`mailto:${page.direct.email}`}
                  className="font-body text-sm text-text-secondary transition-colors hover:text-accent-orange sm:text-base"
                >
                  {page.direct.email}
                </a>
              </div>

              <div>
                <div className="mb-3 flex items-center gap-3">
                  <div className="rounded-lg bg-accent-purple/10 p-2">
                    <MapPin className="h-4 w-4 text-accent-purple sm:h-5 sm:w-5" />
                  </div>
                  <h3 className="font-heading text-base font-semibold text-white sm:text-lg">
                    Address
                  </h3>
                </div>
                <p className="font-body text-sm text-text-secondary sm:text-base">
                  {page.direct.addressLines.map((line, index) => (
                    <span key={`${line}-${index}`}>
                      {line}
                      {index < page.direct.addressLines.length - 1 ? <br /> : null}
                    </span>
                  ))}
                </p>
              </div>

              <div>
                <div className="mb-3 flex items-center gap-3">
                  <div className="rounded-lg bg-accent-cyan/10 p-2">
                    <Calendar className="h-4 w-4 text-accent-cyan sm:h-5 sm:w-5" />
                  </div>
                  <h3 className="font-heading text-base font-semibold text-white sm:text-lg">
                    {page.direct.bookCallTitle}
                  </h3>
                </div>
                <div className="rounded-2xl border border-background-tertiary bg-background-secondary/50 p-5 backdrop-blur-sm sm:p-6">
                  <p className="mb-4 font-body text-xs text-text-muted sm:text-sm">
                    {page.direct.bookCallHint}
                  </p>
                  <motion.a
                    href={bookingHref}
                    target={bookingTarget}
                    rel={bookingRel}
                    className="flex min-h-[44px] w-full items-center justify-center rounded-full border-2 border-accent-cyan bg-transparent px-4 py-2.5 font-heading text-xs font-semibold text-white transition-all duration-300 hover:bg-accent-cyan/10 hover:glow-cyan sm:px-6 sm:py-3 sm:text-sm"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    {page.direct.bookCallButton}
                  </motion.a>
                </div>
              </div>

              <div>
                <h3 className="mb-3 font-heading text-base font-semibold text-white sm:mb-4 sm:text-lg">
                  Follow Us
                </h3>
                <div className="flex flex-wrap gap-3 sm:gap-4">
                  {page.direct.socials.map((social) => {
                    const Icon = getSocialIcon(social.label);
                    return (
                      <motion.a
                        key={`${social.label}-${social.href}`}
                        href={social.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex min-h-[44px] min-w-[44px] items-center justify-center rounded-full border border-background-tertiary bg-background-secondary/50 p-2.5 text-text-secondary transition-all duration-300 hover:border-accent-orange hover:text-accent-orange hover:glow-orange sm:p-3"
                        whileHover={{ scale: 1.1, y: -2 }}
                        whileTap={{ scale: 0.9 }}
                        aria-label={social.label}
                      >
                        <Icon className="h-4 w-4 sm:h-5 sm:w-5" />
                      </motion.a>
                    );
                  })}
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      <section className="relative mx-auto max-w-4xl px-4 pb-24 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="mb-8 text-center font-heading text-3xl font-bold sm:mb-12 sm:text-4xl md:text-5xl">
            {page.faq.titleLead} <span className="text-gradient-accent">{page.faq.titleAccent}</span>
          </h2>
          <div className="space-y-3 sm:space-y-4">
            {page.faq.items.map((faq, index) => (
              <motion.div
                key={`${faq.question}-${index}`}
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
                  className="flex min-h-[44px] w-full items-center justify-between p-5 text-left font-heading text-base font-semibold text-white transition-colors hover:text-accent-orange sm:p-6 sm:text-lg"
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
                    <ChevronDown className="h-4 w-4 sm:h-5 sm:w-5" />
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
                      <div className="px-5 pb-5 sm:px-6 sm:pb-6">
                        <p className="font-body text-sm text-text-secondary sm:text-base">
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
