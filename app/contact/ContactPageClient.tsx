"use client";

import { AnimatePresence, MotionConfig, motion } from "framer-motion";
import {
  AlertTriangle,
  Calendar,
  CheckCircle2,
  Globe,
  Instagram,
  Linkedin,
  Loader2,
  Mail,
  MapPin,
  Twitter,
  Youtube,
} from "lucide-react";
import { useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { useEffect, useState } from "react";
import {
  defaultMarketingPagesContent,
  type ContactPageContent,
} from "@/lib/data/marketingContent";

type AudienceType = "creator" | "brand" | "agency" | "platform" | "other";
type ContactIntent = "creator" | "brand" | "agency" | "idea" | "consultation" | "";

interface ContactFormData {
  name: string;
  email: string;
  audienceType: AudienceType | "";
  brief: string;
  optionalLink: string;
}

interface ContactPageClientProps {
  content?: ContactPageContent;
  formEndpoint?: string;
  consultationHref: string;
}

const audienceOptions: Array<{ value: AudienceType; label: string }> = [
  { value: "creator", label: "Creator" },
  { value: "brand", label: "Brand" },
  { value: "agency", label: "Agency" },
  { value: "platform", label: "Platform" },
  { value: "other", label: "Other" },
];

const intentContent: Record<
  Exclude<ContactIntent, "">,
  { label: string; title: string; description: string; audienceType: AudienceType | "" }
> = {
  creator: {
    label: "Creator enquiry",
    title: "Let us build the show around your audience.",
    description:
      "Tell us what people already come to you for and what the show could unlock.",
    audienceType: "creator",
  },
  brand: {
    label: "Brand enquiry",
    title: "Turn the objective into a content property.",
    description:
      "Share the audience, category and outcome you want a recurring show to own.",
    audienceType: "brand",
  },
  agency: {
    label: "Partner enquiry",
    title: "Bring the brief. We will shape the format.",
    description:
      "Tell us about the talent, campaign or platform need behind the idea.",
    audienceType: "agency",
  },
  idea: {
    label: "Show idea",
    title: "Tell us the show you cannot stop thinking about.",
    description:
      "A strong personality, community or point of view is enough to start.",
    audienceType: "",
  },
  consultation: {
    label: "Consultation",
    title: "Tell us what you are trying to build.",
    description:
      "Share the useful context and we will find the right first conversation.",
    audienceType: "",
  },
};

function getSocialIcon(label: string) {
  const normalized = label.toLowerCase();
  if (normalized.includes("twitter") || normalized.includes("x")) return Twitter;
  if (normalized.includes("instagram")) return Instagram;
  if (normalized.includes("linkedin")) return Linkedin;
  if (normalized.includes("youtube")) return Youtube;
  return Globe;
}

function normalizeIntent(value: string | null): ContactIntent {
  if (
    value === "creator" ||
    value === "brand" ||
    value === "agency" ||
    value === "idea" ||
    value === "consultation"
  ) {
    return value;
  }
  return "";
}

function isConfiguredFormEndpoint(endpoint: string): boolean {
  const normalized = endpoint.trim().toLowerCase();
  if (!normalized) return false;

  // Keep template environment values from presenting a working submission flow.
  return !normalized.includes("your_form_id") && !normalized.includes("your-form-id");
}

export default function ContactPageClient({
  content,
  formEndpoint = "",
  consultationHref,
}: ContactPageClientProps) {
  const page = content || defaultMarketingPagesContent.contact;
  const searchParams = useSearchParams();
  const intent = normalizeIntent(searchParams.get("intent"));
  const entry = intent ? intentContent[intent] : intentContent.consultation;
  const hasFormEndpoint = isConfiguredFormEndpoint(formEndpoint);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [submitSuccess, setSubmitSuccess] = useState("");

  const bookingExternal = /^https?:\/\//i.test(consultationHref);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
  } = useForm<ContactFormData>({
    defaultValues: {
      audienceType: entry.audienceType,
    },
  });

  useEffect(() => {
    setValue("audienceType", entry.audienceType);
  }, [entry.audienceType, setValue]);

  const onSubmit = async (data: ContactFormData) => {
    setSubmitError("");
    setSubmitSuccess("");
    if (!hasFormEndpoint) {
      return;
    }

    setIsSubmitting(true);
    try {
      // CONTACT_FORM_ENDPOINT remains the external submission integration boundary.
      const response = await fetch(formEndpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          name: data.name,
          email: data.email,
          company: "",
          interest: data.audienceType,
          message: data.brief,
          audienceType: data.audienceType,
          brief: data.brief,
          optionalLink: data.optionalLink,
          entryIntent: intent || "contact",
          source: "luckystudios.com/contact",
        }),
      });

      if (!response.ok) {
        const payload = await response.json().catch(() => null);
        throw new Error(
          payload?.error || payload?.message || "Form submission failed"
        );
      }

      setSubmitSuccess("Message sent. We will be in touch shortly.");
      reset({ audienceType: entry.audienceType });
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

  const fieldClassName =
    "w-full rounded-xl border border-white/10 bg-white/[0.045] px-4 py-3.5 font-body text-white placeholder:text-white/35 transition focus:border-accent-orange focus:outline-none focus:ring-2 focus:ring-accent-orange/20";

  return (
    <MotionConfig reducedMotion="user">
      <main className="min-h-screen overflow-hidden bg-background">
      <section className="relative px-4 pb-14 pt-32 sm:px-6 md:pb-20 lg:px-8">
        <div className="pointer-events-none absolute left-1/2 top-0 h-[460px] w-full max-w-4xl -translate-x-1/2 bg-[radial-gradient(circle_at_50%_20%,rgba(245,158,11,0.17),transparent_58%)]" />
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55 }}
          className="relative mx-auto max-w-4xl text-center"
        >
          <p className="mb-5 text-xs font-semibold uppercase tracking-[0.28em] text-accent-orange">
            {entry.label}
          </p>
          <h1 className="mb-5 font-heading text-4xl font-bold leading-tight text-white sm:text-5xl md:text-6xl">
            {entry.title}
          </h1>
          <p className="mx-auto max-w-2xl text-base leading-relaxed text-white/65 sm:text-lg">
            {entry.description}
          </p>
        </motion.div>
      </section>

      <section className="relative mx-auto max-w-7xl px-4 pb-24 sm:px-6 lg:px-8">
        <div className="grid gap-10 lg:grid-cols-[1.04fr_0.72fr] lg:gap-16">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="rounded-3xl border border-white/10 bg-white/[0.03] p-5 sm:p-8"
          >
            <h2 className="mb-8 font-heading text-2xl font-semibold text-white sm:text-3xl">
              Start with the useful details.
            </h2>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
              <div className="grid gap-5 sm:grid-cols-2">
                <div>
                  <label htmlFor="name" className="mb-2 block text-sm font-medium text-white">
                    Name <span className="text-accent-orange">*</span>
                  </label>
                  <input
                    id="name"
                    type="text"
                    {...register("name", { required: "Name is required" })}
                    className={fieldClassName}
                    placeholder="Your name"
                    aria-invalid={Boolean(errors.name)}
                  />
                  {errors.name ? (
                    <p className="mt-2 text-sm text-accent-orange" role="alert">
                      {errors.name.message}
                    </p>
                  ) : null}
                </div>
                <div>
                  <label htmlFor="email" className="mb-2 block text-sm font-medium text-white">
                    Email <span className="text-accent-orange">*</span>
                  </label>
                  <input
                    id="email"
                    type="email"
                    {...register("email", {
                      required: "Email is required",
                      pattern: {
                        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                        message: "Enter a valid email address",
                      },
                    })}
                    className={fieldClassName}
                    placeholder="you@example.com"
                    aria-invalid={Boolean(errors.email)}
                  />
                  {errors.email ? (
                    <p className="mt-2 text-sm text-accent-orange" role="alert">
                      {errors.email.message}
                    </p>
                  ) : null}
                </div>
              </div>

              <div>
                <label htmlFor="audienceType" className="mb-2 block text-sm font-medium text-white">
                  I am a <span className="text-accent-orange">*</span>
                </label>
                <select
                  id="audienceType"
                  {...register("audienceType", { required: "Select one option" })}
                  className={`${fieldClassName} min-h-[52px]`}
                  aria-invalid={Boolean(errors.audienceType)}
                >
                  <option value="">Select one option</option>
                  {audienceOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
                {errors.audienceType ? (
                  <p className="mt-2 text-sm text-accent-orange" role="alert">
                    {errors.audienceType.message}
                  </p>
                ) : null}
              </div>

              <div>
                <label htmlFor="brief" className="mb-2 block text-sm font-medium text-white">
                  What are you trying to build? <span className="text-accent-orange">*</span>
                </label>
                <textarea
                  id="brief"
                  rows={6}
                  {...register("brief", {
                    required: "Tell us what you are trying to build",
                    minLength: {
                      value: 10,
                      message: "Please add a little more detail",
                    },
                  })}
                  className={fieldClassName}
                  placeholder="Tell us about the idea, audience, brief, format or support you need."
                  aria-invalid={Boolean(errors.brief)}
                />
                {errors.brief ? (
                  <p className="mt-2 text-sm text-accent-orange" role="alert">
                    {errors.brief.message}
                  </p>
                ) : null}
              </div>

              <div>
                <label htmlFor="optionalLink" className="mb-2 block text-sm font-medium text-white">
                  Optional link
                </label>
                <input
                  id="optionalLink"
                  type="url"
                  {...register("optionalLink")}
                  className={fieldClassName}
                  placeholder="Show, channel, brief or brand link"
                />
              </div>

              <motion.button
                type="submit"
                disabled={isSubmitting || !hasFormEndpoint}
                className="flex min-h-[52px] w-full items-center justify-center rounded-full bg-accent-orange px-8 py-3.5 font-heading text-base font-semibold text-white transition hover:bg-amber-500 disabled:cursor-not-allowed disabled:opacity-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-orange"
                whileTap={isSubmitting || !hasFormEndpoint ? undefined : { scale: 0.98 }}
              >
                {isSubmitting ? (
                  <span className="inline-flex items-center gap-2">
                    <Loader2 className="h-5 w-5 animate-spin" />
                    {page.form.sendingLabel}
                  </span>
                ) : (
                  "Send us your idea"
                )}
              </motion.button>

              <AnimatePresence mode="wait">
                {submitError ? (
                  <motion.p
                    key="error"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="flex items-center gap-2 text-sm text-red-300"
                    role="alert"
                  >
                    <AlertTriangle className="h-4 w-4" />
                    {submitError}
                  </motion.p>
                ) : null}
                {submitSuccess ? (
                  <motion.p
                    key="success"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex items-center gap-2 text-sm text-emerald-300"
                    role="status"
                  >
                    <CheckCircle2 className="h-4 w-4" />
                    {submitSuccess}
                  </motion.p>
                ) : null}
              </AnimatePresence>

              {!hasFormEndpoint ? (
                <p className="rounded-xl border border-accent-orange/20 bg-accent-orange/[0.06] p-4 text-sm leading-relaxed text-white/65">
                  Online submissions are not configured yet. Email{" "}
                  <a className="text-white underline decoration-accent-orange" href={`mailto:${page.direct.email}`}>
                    {page.direct.email}
                  </a>{" "}
                  to start the conversation.
                </p>
              ) : null}
            </form>
          </motion.div>

          <motion.aside
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="space-y-9 pt-2"
          >
            <div>
              <h2 className="mb-6 font-heading text-2xl font-semibold text-white">
                Prefer a direct route?
              </h2>
              <div className="space-y-6 text-sm text-white/65">
                <a href={`mailto:${page.direct.email}`} className="flex items-center gap-3 transition hover:text-accent-orange">
                  <Mail className="h-5 w-5 text-accent-orange" />
                  {page.direct.email}
                </a>
                <div className="flex items-start gap-3">
                  <MapPin className="mt-0.5 h-5 w-5 text-accent-orange" />
                  <p>
                    {page.direct.addressLines.map((line) => (
                      <span key={line} className="block">
                        {line}
                      </span>
                    ))}
                  </p>
                </div>
              </div>
            </div>

            <div className="rounded-2xl border border-accent-orange/20 bg-accent-orange/[0.055] p-6">
              <div className="mb-4 flex items-center gap-3">
                <Calendar className="h-5 w-5 text-accent-orange" />
                <h3 className="font-heading text-lg font-semibold text-white">
                  Book a consultation
                </h3>
              </div>
              <p className="mb-6 text-sm leading-relaxed text-white/62">
                Useful when you already have a creator, brand brief or format to discuss.
              </p>
              <a
                href={consultationHref}
                target={bookingExternal ? "_blank" : undefined}
                rel={bookingExternal ? "noopener noreferrer" : undefined}
                className="inline-flex min-h-[48px] w-full items-center justify-center rounded-full border border-accent-orange/40 px-5 py-3 font-heading text-sm font-semibold text-white transition hover:bg-accent-orange/12 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-orange"
              >
                Book a consultation
              </a>
            </div>

            <div className="flex gap-3">
              {page.direct.socials.map((social) => {
                const Icon = getSocialIcon(social.label);
                return (
                  <a
                    key={social.href}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={social.label}
                    className="flex h-11 w-11 items-center justify-center rounded-full border border-white/10 text-white/65 transition hover:border-accent-orange hover:text-accent-orange focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-orange"
                  >
                    <Icon className="h-5 w-5" />
                  </a>
                );
              })}
            </div>
          </motion.aside>
        </div>
      </section>
      </main>
    </MotionConfig>
  );
}
