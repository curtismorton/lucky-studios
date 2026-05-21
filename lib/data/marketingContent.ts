import { site } from "@/lib/data/site";

export type CtaButton = {
  label: string;
  href: string;
};

export type TeamMember = {
  name: string;
  role: string;
  bio: string;
  image: string;
};

export type SimpleItem = {
  title: string;
  description: string;
};

export type StatItem = {
  title: string;
  value: string;
  description: string;
};

export type FaqItem = {
  question: string;
  answer: string;
};

export type SocialLink = {
  label: string;
  href: string;
};

export type AboutPageContent = {
  hero: {
    titleLead: string;
    titleAccent: string;
    subtitle: string;
  };
  story: {
    titleLead: string;
    titleAccent: string;
    paragraphs: string[];
    missionTitle: string;
    missionText: string;
  };
  sociallyPowerful: {
    titleLead: string;
    titleAccent: string;
    description: string;
    bullets: string[];
    badgeText: string;
    buttonLabel: string;
    buttonHref: string;
  };
  team: {
    titleLead: string;
    titleAccent: string;
    members: TeamMember[];
  };
  values: {
    titleLead: string;
    titleAccent: string;
    items: SimpleItem[];
  };
  cta: {
    titleLead: string;
    titleAccent: string;
    subtitle: string;
    buttons: CtaButton[];
  };
};

export type BrandsPageContent = {
  hero: {
    titleLead: string;
    titleAccent: string;
    subtitle: string;
  };
  trustedBy: {
    label: string;
    brands: string[];
  };
  services: {
    title: string;
    description: string;
    ctaLabel: string;
  }[];
  caseStudy: {
    tag: string;
    titleLead: string;
    titleAccent: string;
    challenge: string;
    solution: string;
    results: string;
    quote: string;
    author: string;
    buttonLabel: string;
    buttonHref: string;
  };
  network: {
    titleLead: string;
    titleAccent: string;
    stats: StatItem[];
  };
  benefits: {
    titleLead: string;
    titleAccent: string;
    items: SimpleItem[];
  };
  cta: {
    titleLead: string;
    titleAccent: string;
    subtitle: string;
    buttonLabel: string;
    email: string;
  };
};

export type CreatorsPageContent = {
  hero: {
    titleLead: string;
    titleAccent: string;
    subtitle: string;
    buttonLabel: string;
  };
  valueProps: {
    titleLead: string;
    titleAccent: string;
    items: SimpleItem[];
  };
  successStory: {
    tag: string;
    titleLead: string;
    titleAccent: string;
    titleSuffix: string;
    quote: string;
    author: string;
    show: string;
    metrics: { value: string; label: string }[];
  };
  lookFor: {
    titleLead: string;
    titleAccent: string;
    items: string[];
  };
  cta: {
    titleLead: string;
    titleAccent: string;
    subtitle: string;
    buttonLabel: string;
  };
  faqs: FaqItem[];
};

export type StudioPageContent = {
  hero: {
    titleLead: string;
    titleAccent: string;
    subtitle: string;
    locationBadge: string;
    primaryCtaLabel: string;
    secondaryCtaLabel: string;
    heroImage: string;
    heroImageAlt: string;
  };
  gallery: {
    titleLead: string;
    titleAccent: string;
    images: string[];
  };
  equipment: {
    titleLead: string;
    titleAccent: string;
    items: SimpleItem[];
  };
  included: {
    titleLead: string;
    titleAccent: string;
    items: string[];
  };
  booking: {
    titleLead: string;
    titleAccent: string;
    options: {
      title: string;
      duration: string;
      description: string;
      ctaLabel: string;
    }[];
    memberNotePrefix: string;
    memberNoteText: string;
  };
  location: {
    titleLead: string;
    titleAccent: string;
    mapLabel: string;
    addressLines: string[];
    transportLines: string[];
  };
  cta: {
    titleLead: string;
    titleAccent: string;
    subtitle: string;
    widgetHint: string;
    buttonLabel: string;
  };
};

export type ContactPageContent = {
  hero: {
    titleLead: string;
    titleAccent: string;
    subtitle: string;
  };
  form: {
    title: string;
    submitLabel: string;
    sendingLabel: string;
    interestOptions: string[];
  };
  direct: {
    title: string;
    email: string;
    addressLines: string[];
    bookCallTitle: string;
    bookCallHint: string;
    bookCallButton: string;
    socials: SocialLink[];
  };
  faq: {
    titleLead: string;
    titleAccent: string;
    items: FaqItem[];
  };
};

export type MarketingPagesContent = {
  about: AboutPageContent;
  brands: BrandsPageContent;
  creators: CreatorsPageContent;
  studio: StudioPageContent;
  contact: ContactPageContent;
};

function isObject(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function mergeWithDefaults<T>(defaults: T, input: unknown): T {
  if (Array.isArray(defaults)) {
    if (!Array.isArray(input) || input.length === 0) {
      return defaults;
    }

    if (defaults.length === 0) {
      return input as T;
    }

    return input.map((entry, index) => {
      const template = defaults[Math.min(index, defaults.length - 1)];
      return mergeWithDefaults(template, entry);
    }) as T;
  }

  if (isObject(defaults)) {
    if (!isObject(input)) {
      return defaults;
    }

    const merged: Record<string, unknown> = {};
    for (const key of Object.keys(defaults)) {
      merged[key] = mergeWithDefaults(
        (defaults as Record<string, unknown>)[key],
        (input as Record<string, unknown>)[key]
      );
    }
    return merged as T;
  }

  if (typeof defaults === "string") {
    return (typeof input === "string" && input.trim().length > 0
      ? input
      : defaults) as T;
  }

  if (typeof defaults === "boolean") {
    return (typeof input === "boolean" ? input : defaults) as T;
  }

  if (typeof defaults === "number") {
    return (typeof input === "number" && Number.isFinite(input)
      ? input
      : defaults) as T;
  }

  return (input ?? defaults) as T;
}

export const defaultMarketingPagesContent: MarketingPagesContent = {
  about: {
    hero: {
      titleLead: "About",
      titleAccent: "Lucky",
      subtitle:
        "A London production studio and creator media network backed by Socially Powerful.",
    },
    story: {
      titleLead: "Why Lucky",
      titleAccent: "Exists",
      paragraphs: [
        "Most content teams are stuck between informal creator output that is inconsistent and polished brand content that feels too slow for social platforms.",
        "Lucky sits in the middle. We bring format development, studio production, editing, packaging, distribution thinking, and brand access into one joined-up system.",
        "The goal is simple: make shows that have a reason to exist beyond the first episode, then turn every recording into assets that can actually travel.",
      ],
      missionTitle: "The operating principle",
      missionText:
        "Strong ideas need a repeatable production machine behind them.",
    },
    sociallyPowerful: {
      titleLead: "Part of",
      titleAccent: "Socially Powerful",
      description:
        "Lucky has the speed of a studio with the commercial context of a global influencer marketing agency. That means show ideas can be built with audience, talent, and brand outcomes in mind from the start.",
      bullets: [
        "Access to 15M+ influencer following",
        "Global agency backing",
        "Industry expertise",
      ],
      badgeText: "Socially Powerful",
      buttonLabel: "Learn More About Socially Powerful",
      buttonHref: "https://sociallypowerful.com",
    },
    team: {
      titleLead: "The People Building",
      titleAccent: "The System",
      members: [
        {
          name: "Curtis Morton",
          role: "Head of Talent & Podcasting",
          bio: "Building the UK's most creator-friendly podcast network",
          image: "",
        },
        {
          name: "Bartosz Struzyna",
          role: "Lead Producer (SP IP)",
          bio: "Expert in IP development and content strategy",
          image: "",
        },
        {
          name: "Aidan Rafferty",
          role: "Lead Producer (Talent)",
          bio: "Specializing in talent development and show production",
          image: "",
        },
        {
          name: "Baxter Fenwick",
          role: "Producer",
          bio: "Bringing creative visions to life through production",
          image: "",
        },
      ],
    },
    values: {
      titleLead: "What We Will Not",
      titleAccent: "Compromise On",
      items: [
        {
          title: "Creator-First",
          description:
            "We put creators at the center of everything. Your success is our success.",
        },
        {
          title: "Quality Over Quantity",
          description:
            "We focus on building exceptional shows, not just filling a roster.",
        },
        {
          title: "Authentic Partnerships",
          description:
            "Real relationships with brands and creators built on trust and results.",
        },
        {
          title: "Long-term Growth",
          description:
            "We're in it for the long haul, investing in sustainable growth for all.",
        },
      ],
    },
    cta: {
      titleLead: "Bring Us",
      titleAccent: "The Idea",
      subtitle: "Pick the route that best matches what you are trying to make.",
      buttons: [
        {
          label: "I'm a Creator",
          href: "/creators",
        },
        {
          label: "I'm a Brand",
          href: "/brands",
        },
        {
          label: "Book the Studio",
          href: "/studio",
        },
      ],
    },
  },
  brands: {
    hero: {
      titleLead: "Reach Engaged",
      titleAccent: "Audiences",
      subtitle: "Partner with shows your customers actually listen to",
    },
    trustedBy: {
      label: "Trusted by",
      brands: ["William Hill", "Partner 1", "Partner 2", "Partner 3"],
    },
    services: [
      {
        title: "Sponsor a Show",
        description:
          "Integrate into existing shows with established audiences and proven engagement. Reach millions of listeners who trust our hosts.",
        ctaLabel: "View Sponsorship Options",
      },
      {
        title: "Create a Branded Podcast",
        description:
          "Your own show, from concept to distribution. We handle everything - you get a professional podcast that tells your brand's story.",
        ctaLabel: "Discuss Your Podcast",
      },
    ],
    caseStudy: {
      tag: "Case Study",
      titleLead: "William Hill ×",
      titleAccent: "Back Post",
      challenge:
        "Reach football fans authentically through content they genuinely engage with, moving beyond traditional advertising.",
      solution:
        "Integrated sponsorship of Back Post, a weekly football podcast with deep tactical analysis and cultural commentary.",
      results:
        "Reached 500K+ engaged listeners, 4.8★ average rating, and measurable brand lift in target demographics.",
      quote:
        "Working with Lucky Studios gave us access to an audience that actually cares about football. The integration felt natural, not like advertising.",
      author: "William Hill Marketing Team",
      buttonLabel: "Read Full Case Study",
      buttonHref: "/case-studies/william-hill",
    },
    network: {
      titleLead: "Our",
      titleAccent: "Network",
      stats: [
        {
          title: "Total Reach",
          value: "1.1M+",
          description: "Unique monthly listeners",
        },
        {
          title: "Engagement Rate",
          value: "68%",
          description: "Average completion rate",
        },
        {
          title: "Key Demographics",
          value: "18-45",
          description: "Primary age range",
        },
      ],
    },
    benefits: {
      titleLead: "Why Partner",
      titleAccent: "With Us",
      items: [
        {
          title: "Influencer Access",
          description: "SP roster 15M+ followers across platforms",
        },
        {
          title: "Professional Production",
          description: "Studio-quality audio and video from day one",
        },
        {
          title: "Multi-Platform Distribution",
          description: "Spotify, Apple, YouTube, and more",
        },
        {
          title: "Performance Reporting",
          description: "Detailed analytics and ROI tracking",
        },
      ],
    },
    cta: {
      titleLead: "Ready to",
      titleAccent: "Get Started",
      subtitle:
        "Let's discuss how we can help you reach your target audience through podcast partnerships.",
      buttonLabel: "Schedule a Call",
      email: "brands@luckystudios.com",
    },
  },
  creators: {
    hero: {
      titleLead: "Grow Your Podcast",
      titleAccent: "With Us",
      subtitle: "Join London's fastest-growing podcast network",
      buttonLabel: "Apply to Join",
    },
    valueProps: {
      titleLead: "Why Partner",
      titleAccent: "With Us",
      items: [
        {
          title: "Network Growth",
          description: "Cross-promotion to 1.1M+ viewers across our network",
        },
        {
          title: "Production Support",
          description:
            "Sony A7 IV, Shure SM7B, professional editing and post-production",
        },
        {
          title: "Revenue Share",
          description:
            "YouTube, Spotify, and brand deals - we share the success",
        },
      ],
    },
    successStory: {
      tag: "Success Story",
      titleLead: "From 0 to",
      titleAccent: "10M Views",
      titleSuffix: "in Season 1",
      quote:
        "Lucky Studios didn't just give me a platform - they gave me a team. The production quality, cross-promotion, and support helped turn my idea into a hit show.",
      author: "Abby Boom",
      show: "Don't Get Me Started",
      metrics: [
        {
          value: "10M+",
          label: "Views in Season 1",
        },
        {
          value: "0 → 1M",
          label: "Subscribers in 6 months",
        },
      ],
    },
    lookFor: {
      titleLead: "What We",
      titleAccent: "Look For",
      items: [
        "Unique perspective or niche expertise",
        "Commitment to consistent content creation",
        "Passion for your subject matter",
        "Openness to collaboration and feedback",
        "Long-term vision for your show",
        "Focus on potential, not existing audience size",
      ],
    },
    cta: {
      titleLead: "Ready to",
      titleAccent: "Get Started",
      subtitle:
        "We're always looking for passionate creators with unique voices. Let's talk about how we can help grow your podcast.",
      buttonLabel: "Let's Talk",
    },
    faqs: [
      {
        question: "How does partnership work?",
        answer:
          "We provide production support, studio access, editing, and cross-promotion across our network. You focus on creating great content while we handle the technical and marketing aspects.",
      },
      {
        question: "What's the revenue split?",
        answer:
          "We operate on a revenue share model. The exact split depends on the partnership structure, but we believe in fair compensation that grows with your success.",
      },
      {
        question: "Do I need an existing audience?",
        answer:
          "No! We focus on potential, not existing audience size. If you have a unique voice and commitment to creating great content, we want to hear from you.",
      },
      {
        question: "Where is the studio located?",
        answer:
          "Our studio is located in London Bridge, easily accessible by public transport. We also support remote recording setups for creators who prefer to work from their own space.",
      },
    ],
  },
  studio: {
    hero: {
      titleLead: "London Bridge",
      titleAccent: "Studio",
      subtitle:
        "A production-ready space for shows, clips, campaign assets, and multi-camera recording.",
      locationBadge: "5 mins from London Bridge Station",
      primaryCtaLabel: "Book a Studio Walkthrough",
      secondaryCtaLabel: "Talk Through a Shoot",
      heroImage: "",
      heroImageAlt: "Lucky Studios podcast studio",
    },
    gallery: {
      titleLead: "See the Space",
      titleAccent: "Before You Book It",
      images: ["", "", "", "", "", ""],
    },
    equipment: {
      titleLead: "Production-Grade Kit",
      titleAccent: "Ready to Roll",
      items: [
        {
          title: "3x Sony A7 IV",
          description: "4K cameras for multi-angle recording",
        },
        {
          title: "Shure SM7B",
          description: "Professional broadcast microphones",
        },
        {
          title: "ATEM Mini Pro ISO",
          description: "Live production switcher with ISO recording",
        },
        {
          title: "Professional LED Lighting",
          description: "Full studio lighting setup",
        },
      ],
    },
    included: {
      titleLead: "Handled",
      titleAccent: "On the Day",
      items: [
        "On-site technical support",
        "Makeup room",
        "Green room",
        "High-speed WiFi",
        "Refreshments",
        "Same-day file transfer",
      ],
    },
    booking: {
      titleLead: "Choose the Session",
      titleAccent: "That Fits the Job",
      options: [
        {
          title: "Half Day",
          duration: "4 hours",
          description: "Best for a focused episode, interview, or short asset run.",
          ctaLabel: "Book the Session",
        },
        {
          title: "Full Day",
          duration: "8 hours",
          description: "Built for multiple episodes, campaign capture, or longer formats.",
          ctaLabel: "Plan the Day",
        },
        {
          title: "Custom/Ongoing",
          duration: "Contact us",
          description: "For repeat formats, retained production, or studio plus edit support.",
          ctaLabel: "Build the Setup",
        },
      ],
      memberNotePrefix: "Network members",
      memberNoteText: "get priority booking and exclusive discounts",
    },
    location: {
      titleLead: "Easy to Reach",
      titleAccent: "Easy to Run",
      mapLabel: "Map integration placeholder",
      addressLines: [
        site.name,
        site.address.streetAddress,
        `${site.address.locality}, ${site.address.country}`,
      ],
      transportLines: [
        "🚇 London Bridge Station (5 min walk)",
        "🚇 Borough Station (7 min walk)",
        "🚌 Multiple bus routes nearby",
      ],
    },
    cta: {
      titleLead: "Want the Studio",
      titleAccent: "And the Production Brain",
      subtitle:
        "Tell us what you need to capture and we will shape the session around the show, campaign, or content run.",
      widgetHint: "Calendly booking widget will be embedded here",
      buttonLabel: "Start Planning the Session",
    },
  },
  contact: {
    hero: {
      titleLead: "Start the",
      titleAccent: "Conversation",
      subtitle:
        "Tell us what you are trying to build and we will point the next step in the right direction.",
    },
    form: {
      title: "Start with the idea.",
      submitLabel: "Send the Brief",
      sendingLabel: "Sending...",
      interestOptions: [
        "Build a creator show",
        "Brand partnership or sponsorship",
        "Book the studio",
        "Produce campaign assets",
        "Something else",
      ],
    },
    direct: {
      title: "Prefer a Direct Route?",
      email: site.email,
      addressLines: [
        site.address.streetAddress,
        `${site.address.locality}, ${site.address.country}`,
      ],
      bookCallTitle: "Book a Working Session",
      bookCallHint:
        "Useful if you already have a creator, brand brief, or shoot window and need to pressure-test the plan quickly.",
      bookCallButton: "Schedule a Working Session",
      socials: [
        { label: "Twitter", href: site.socials.x },
        { label: "Instagram", href: site.socials.instagram },
        { label: "LinkedIn", href: site.socials.linkedin },
        { label: "YouTube", href: site.socials.youtube },
      ],
    },
    faq: {
      titleLead: "Useful Things",
      titleAccent: "To Know First",
      items: [
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
      ],
    },
  },
};

export function normalizeMarketingPagesContent(
  input: unknown
): MarketingPagesContent {
  return mergeWithDefaults(defaultMarketingPagesContent, input);
}
