"use client";

import { AnimatePresence, motion } from "motion/react";
import {
  AlertTriangle,
  CheckCircle2,
  Globe,
  Instagram,
  Linkedin,
  Loader2,
  Twitter,
  Youtube,
} from "lucide-react";
import { useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { useEffect, useState } from "react";
import Slate from "@/components/cinema/Slate";
import Reveal from "@/components/cinema/Reveal";
import { contactContent, type ContactContent } from "@/lib/content/contact";

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
  content?: ContactContent;
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
  { label: string; title: string[]; description: string; audienceType: AudienceType | "" }
> = {
  creator: {
    label: "CREATOR ENQUIRY",
    title: ["Bring the voice."],
    description:
      "Tell us what people already come to you for, and what the show could unlock.",
    audienceType: "creator",
  },
  brand: {
    label: "BRAND ENQUIRY",
    title: ["Bring the objective."],
    description:
      "The audience, the category, the outcome — we'll bring the format that owns it.",
    audienceType: "brand",
  },
  agency: {
    label: "PARTNER ENQUIRY",
    title: ["Bring the brief."],
    description:
      "Talent, campaign or platform need — tell us what's behind it and we'll shape the show.",
    audienceType: "agency",
  },
  idea: {
    label: "SHOW IDEA",
    title: ["Bring the idea."],
    description:
      "The show you can't stop thinking about. A personality, a community or a point of view is enough.",
    audienceType: "",
  },
  consultation: {
    label: "FIRST CONTACT",
    title: ["Bring whatever", "you've got."],
    description:
      "Creator, brand, brief or half-formed idea — give us the useful context and we'll find the right first conversation.",
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

const FIELD_CLASS =
  "w-full border border-bone/20 bg-ink px-4 py-3.5 text-bone placeholder:text-bone/30 transition-colors focus:border-tally focus:outline-none";

const LABEL_CLASS = "tc-label mb-2.5 block text-bone/60";

export default function ContactPageClient({
  content,
  formEndpoint = "",
  consultationHref,
}: ContactPageClientProps) {
  const page = content || contactContent;
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

      setSubmitSuccess("Message received. We'll be in touch shortly.");
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

  return (
    <main>
      {/* Opener */}
      <section className="mx-auto max-w-7xl px-6 pb-14 pt-36 md:px-10 md:pt-44 lg:px-16">
        <Slate scene="CONTACT" title={entry.label} className="mb-12" />
        <Reveal>
          <h1 className="type-display text-[clamp(2.75rem,7vw,6.5rem)] uppercase">
            {entry.title.map((line) => (
              <span key={line} className="block">
                {line.replace(/\.$/, "")}
                {line.endsWith(".") && <span className="text-tally">.</span>}
              </span>
            ))}
          </h1>
        </Reveal>
        <Reveal delay={0.12}>
          <p className="mt-7 max-w-2xl text-lg leading-relaxed text-bone/70">
            {entry.description}
          </p>
        </Reveal>
      </section>

      <section className="mx-auto max-w-7xl px-6 pb-24 md:px-10 md:pb-32 lg:px-16">
        <div className="grid gap-12 lg:grid-cols-[1.05fr_0.7fr] lg:gap-16">
          {/* The form */}
          <Reveal amount={0.1}>
            <form
              onSubmit={handleSubmit(onSubmit)}
              className="space-y-7 border border-bone/15 bg-carbon p-6 sm:p-10"
            >
              <div className="grid gap-7 sm:grid-cols-2">
                <div>
                  <label htmlFor="name" className={LABEL_CLASS}>
                    Name <span className="text-tally">*</span>
                  </label>
                  <input
                    id="name"
                    type="text"
                    {...register("name", { required: "Name is required" })}
                    className={FIELD_CLASS}
                    placeholder="Your name"
                    aria-invalid={Boolean(errors.name)}
                  />
                  {errors.name ? (
                    <p className="mt-2 text-sm text-tally" role="alert">
                      {errors.name.message}
                    </p>
                  ) : null}
                </div>
                <div>
                  <label htmlFor="email" className={LABEL_CLASS}>
                    Email <span className="text-tally">*</span>
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
                    className={FIELD_CLASS}
                    placeholder="you@example.com"
                    aria-invalid={Boolean(errors.email)}
                  />
                  {errors.email ? (
                    <p className="mt-2 text-sm text-tally" role="alert">
                      {errors.email.message}
                    </p>
                  ) : null}
                </div>
              </div>

              <div>
                <label htmlFor="audienceType" className={LABEL_CLASS}>
                  I am a <span className="text-tally">*</span>
                </label>
                <select
                  id="audienceType"
                  {...register("audienceType", { required: "Select one option" })}
                  className={`${FIELD_CLASS} min-h-[52px]`}
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
                  <p className="mt-2 text-sm text-tally" role="alert">
                    {errors.audienceType.message}
                  </p>
                ) : null}
              </div>

              <div>
                <label htmlFor="brief" className={LABEL_CLASS}>
                  What are you trying to build? <span className="text-tally">*</span>
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
                  className={FIELD_CLASS}
                  placeholder="The idea, the audience, the brief, the format — whatever you've got."
                  aria-invalid={Boolean(errors.brief)}
                />
                {errors.brief ? (
                  <p className="mt-2 text-sm text-tally" role="alert">
                    {errors.brief.message}
                  </p>
                ) : null}
              </div>

              <div>
                <label htmlFor="optionalLink" className={LABEL_CLASS}>
                  Optional link
                </label>
                <input
                  id="optionalLink"
                  type="url"
                  {...register("optionalLink")}
                  className={FIELD_CLASS}
                  placeholder="Show, channel, brief or brand link"
                />
              </div>

              <motion.button
                type="submit"
                disabled={isSubmitting || !hasFormEndpoint}
                className="tc-label flex min-h-[56px] w-full items-center justify-center gap-3 bg-tally !text-xs text-ink transition-colors hover:bg-bone disabled:cursor-not-allowed disabled:opacity-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-tally"
                whileTap={isSubmitting || !hasFormEndpoint ? undefined : { scale: 0.99 }}
              >
                {isSubmitting ? (
                  <span className="inline-flex items-center gap-2">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    {page.form.sendingLabel}
                  </span>
                ) : (
                  <>Send it →</>
                )}
              </motion.button>

              <AnimatePresence mode="wait">
                {submitError ? (
                  <motion.p
                    key="error"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="flex items-center gap-2 text-sm text-tally"
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
                    className="flex items-center gap-2 text-sm text-bone"
                    role="status"
                  >
                    <CheckCircle2 className="h-4 w-4 text-tally" />
                    {submitSuccess}
                  </motion.p>
                ) : null}
              </AnimatePresence>

              {!hasFormEndpoint ? (
                <p className="border border-tally/30 bg-tally/5 p-4 text-sm leading-relaxed text-bone/70">
                  Online submissions aren&apos;t configured yet. Email{" "}
                  <a
                    className="link-underline text-bone"
                    href={`mailto:${page.direct.email}`}
                  >
                    {page.direct.email}
                  </a>{" "}
                  to start the conversation.
                </p>
              ) : null}
            </form>
          </Reveal>

          {/* Direct routes */}
          <Reveal delay={0.1} amount={0.1}>
            <aside className="space-y-12">
              <div>
                <h2 className="tc-label text-bone/50">Direct line</h2>
                <a
                  href={`mailto:${page.direct.email}`}
                  className="link-underline mt-4 inline-block font-mono text-lg text-bone"
                >
                  {page.direct.email}
                </a>
                <p className="tc-label mt-6 !leading-loose text-bone/45">
                  {page.direct.addressLines.map((line) => (
                    <span key={line} className="block">
                      {line}
                    </span>
                  ))}
                </p>
              </div>

              <div className="border-l-2 border-tally bg-carbon p-7">
                <h3 className="flex items-center gap-3">
                  <span className="h-2 w-2 rounded-full bg-tally animate-rec-blink motion-reduce:animate-none" aria-hidden />
                  <span className="tc-label text-bone">Skip the form</span>
                </h3>
                <p className="mt-4 text-sm leading-relaxed text-bone/65">
                  Already have a creator, a brief or a format to discuss? Book the
                  conversation directly.
                </p>
                <a
                  href={consultationHref}
                  target={bookingExternal ? "_blank" : undefined}
                  rel={bookingExternal ? "noopener noreferrer" : undefined}
                  className="tc-label mt-6 inline-flex min-h-[48px] w-full items-center justify-center border border-bone/25 px-5 !text-xs text-bone transition-colors hover:border-bone hover:bg-bone hover:text-ink"
                >
                  Book a consultation →
                </a>
              </div>

              {page.direct.socials.length > 0 && (
                <div className="flex gap-4">
                  {page.direct.socials.map((social) => {
                    const Icon = getSocialIcon(social.label);
                    return (
                      <a
                        key={social.href}
                        href={social.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={social.label}
                        className="flex h-11 w-11 items-center justify-center border border-bone/15 text-bone/60 transition-colors hover:border-tally hover:text-tally"
                      >
                        <Icon className="h-4.5 w-4.5" />
                      </a>
                    );
                  })}
                </div>
              )}
            </aside>
          </Reveal>
        </div>
      </section>
    </main>
  );
}
