export interface HeroImage {
  src: string;
  alt: string;
}

export interface HeroProofStat {
  value: string;
  label: string;
}

export interface HeroVideoContent {
  enabled: boolean;
  src: string;
  poster: string;
  alt: string;
}

export interface HeroContent {
  mainBackground: HeroImage;
  backgroundVideo: HeroVideoContent;
  accentImage: HeroImage;
  proofStats: HeroProofStat[];
}

export interface TransformationItem {
  show: string;
  showName: string;
  rawImage: string;
  polishedImage: string;
  title: string;
  description: string[];
}

export interface TransformationSliderConfig {
  startOffset: number;
  endOffset: number;
  manualEnabled: boolean;
}

export interface TransformationContent {
  slider: TransformationSliderConfig;
  items: TransformationItem[];
}

export interface HomepageCtaContent {
  titleLead: string;
  titleAccent: string;
  subtitle: string;
  buttonLabel: string;
  buttonHref: string;
}

export interface HomepageContent {
  hero: HeroContent;
  transformation: TransformationContent;
  cta: HomepageCtaContent;
}

function clamp01(value: number, fallback: number): number {
  if (!Number.isFinite(value)) return fallback;
  return Math.max(0, Math.min(1, value));
}

function normalizeImage(input: unknown, fallback: HeroImage): HeroImage {
  if (!input || typeof input !== "object") return fallback;
  const candidate = input as Partial<HeroImage>;
  const src = typeof candidate.src === "string" ? candidate.src.trim() : "";
  const alt = typeof candidate.alt === "string" ? candidate.alt.trim() : "";
  if (!src) return fallback;
  return {
    src,
    alt: alt || fallback.alt,
  };
}

function normalizeProofStat(
  input: unknown,
  fallback: HeroProofStat
): HeroProofStat {
  if (!input || typeof input !== "object") return fallback;
  const candidate = input as Partial<HeroProofStat>;
  const value = typeof candidate.value === "string" ? candidate.value.trim() : "";
  const label = typeof candidate.label === "string" ? candidate.label.trim() : "";

  return {
    value: value || fallback.value,
    label: label || fallback.label,
  };
}

function normalizeHeroVideo(
  input: unknown,
  fallback: HeroVideoContent
): HeroVideoContent {
  if (!input || typeof input !== "object") return fallback;
  const candidate = input as Partial<HeroVideoContent>;

  const src = typeof candidate.src === "string" ? candidate.src.trim() : "";
  const poster =
    typeof candidate.poster === "string" ? candidate.poster.trim() : "";
  const alt = typeof candidate.alt === "string" ? candidate.alt.trim() : "";

  return {
    enabled:
      typeof candidate.enabled === "boolean"
        ? candidate.enabled
        : fallback.enabled,
    src,
    poster: poster || fallback.poster,
    alt: alt || fallback.alt,
  };
}

function normalizeTransformationItem(
  input: unknown,
  fallback: TransformationItem
): TransformationItem {
  if (!input || typeof input !== "object") return fallback;
  const candidate = input as Partial<TransformationItem>;

  const description = Array.isArray(candidate.description)
    ? candidate.description.filter((entry): entry is string => typeof entry === "string" && entry.trim().length > 0)
    : fallback.description;

  return {
    show:
      typeof candidate.show === "string" && candidate.show.trim().length > 0
        ? candidate.show
        : fallback.show,
    showName:
      typeof candidate.showName === "string" && candidate.showName.trim().length > 0
        ? candidate.showName
        : fallback.showName,
    rawImage:
      typeof candidate.rawImage === "string" && candidate.rawImage.trim().length > 0
        ? candidate.rawImage
        : fallback.rawImage,
    polishedImage:
      typeof candidate.polishedImage === "string" && candidate.polishedImage.trim().length > 0
        ? candidate.polishedImage
        : fallback.polishedImage,
    title:
      typeof candidate.title === "string" && candidate.title.trim().length > 0
        ? candidate.title
        : fallback.title,
    description: description.length > 0 ? description : fallback.description,
  };
}

function normalizeHomepageCta(
  input: unknown,
  fallback: HomepageCtaContent
): HomepageCtaContent {
  if (!input || typeof input !== "object") return fallback;
  const candidate = input as Partial<HomepageCtaContent>;

  const titleLead =
    typeof candidate.titleLead === "string" && candidate.titleLead.trim().length > 0
      ? candidate.titleLead
      : fallback.titleLead;
  const titleAccent =
    typeof candidate.titleAccent === "string" && candidate.titleAccent.trim().length > 0
      ? candidate.titleAccent
      : fallback.titleAccent;
  const subtitle =
    typeof candidate.subtitle === "string" && candidate.subtitle.trim().length > 0
      ? candidate.subtitle
      : fallback.subtitle;
  const buttonLabel =
    typeof candidate.buttonLabel === "string" && candidate.buttonLabel.trim().length > 0
      ? candidate.buttonLabel
      : fallback.buttonLabel;
  const buttonHref =
    typeof candidate.buttonHref === "string" && candidate.buttonHref.trim().length > 0
      ? candidate.buttonHref
      : fallback.buttonHref;

  return {
    titleLead,
    titleAccent,
    subtitle,
    buttonLabel,
    buttonHref,
  };
}

export const defaultHomepageContent: HomepageContent = {
  hero: {
    mainBackground: {
      src: "/images/hero/hero-main-our-pic.jpg",
      alt: "Lucky Studios team portrait",
    },
    backgroundVideo: {
      enabled: false,
      src: "",
      poster: "/images/hero/hero-main-our-pic.jpg",
      alt: "Lucky Studios hero background video",
    },
    accentImage: {
      src: "/images/hero/hero-2104-copy.jpg",
      alt: "Lucky Studios hosts on set",
    },
    proofStats: [
      {
        value: "#10",
        label: "Spotify Football",
      },
      {
        value: "2.78M",
        label: "TikTok Views",
      },
      {
        value: "8",
        label: "Weeks Live",
      },
      {
        value: "8-Cam",
        label: "Studio Production",
      },
    ],
  },
  transformation: {
    slider: {
      startOffset: 0.68,
      endOffset: 0.42,
      manualEnabled: true,
    },
    items: [
      {
        show: "backpost",
        showName: "Back Post",
        rawImage: "/images/hero/hero-2771.jpg",
        polishedImage: "/images/hero/hero-2771-3.jpg",
        title: "From Studio Session to Spotify Top 10",
        description: [
          "What started as three mates talking football in our Bermondsey studio became one of the fastest-growing football podcasts in the UK. The raw energy of the recording translates into polished content that resonates with fans.",
          "Every episode goes through our full production pipeline-professional audio mixing, clip creation for socials, thumbnail design, and strategic distribution across platforms.",
        ],
      },
      {
        show: "dgms",
        showName: "Don't Get Me Started",
        rawImage: "/images/hero/hero-2171.jpg",
        polishedImage: "/images/hero/hero-2104-copy.jpg",
        title: "Authentic Conversations, Professional Production",
        description: [
          "Abby Boom brings the passion-we bring the production value. The magic happens when genuine enthusiasm meets world-class audio and visual quality.",
          "Our 8-camera setup captures every reaction, giving editors the flexibility to create dynamic content that keeps audiences engaged across long-form and short-form formats.",
        ],
      },
    ],
  },
  cta: {
    titleLead: "Ready to",
    titleAccent: "Listen?",
    subtitle:
      "Join the Lucky Studios community and discover your next favorite podcast.",
    buttonLabel: "Get Started",
    buttonHref: "/contact",
  },
};

export function normalizeHomepageContent(input: unknown): HomepageContent {
  if (!input || typeof input !== "object") {
    return defaultHomepageContent;
  }

  const candidate = input as Partial<HomepageContent>;
  const hero = candidate.hero;
  const transformation = candidate.transformation;

  const proofStats =
    hero && Array.isArray((hero as { proofStats?: unknown[] }).proofStats)
      ? (hero as { proofStats?: unknown[] }).proofStats!
          .map((entry, index) =>
            normalizeProofStat(
              entry,
              defaultHomepageContent.hero.proofStats[
                index % defaultHomepageContent.hero.proofStats.length
              ]
            )
          )
          .slice(0, 6)
      : defaultHomepageContent.hero.proofStats;

  const transformationItems =
    transformation && Array.isArray(transformation.items) && transformation.items.length > 0
      ? transformation.items.map((entry, index) =>
          normalizeTransformationItem(
            entry,
            defaultHomepageContent.transformation.items[
              index % defaultHomepageContent.transformation.items.length
            ]
          )
        )
      : defaultHomepageContent.transformation.items;

  return {
    hero: {
      mainBackground: normalizeImage(
        hero?.mainBackground,
        defaultHomepageContent.hero.mainBackground
      ),
      backgroundVideo: normalizeHeroVideo(
        (hero as { backgroundVideo?: unknown } | undefined)?.backgroundVideo,
        defaultHomepageContent.hero.backgroundVideo
      ),
      accentImage: normalizeImage(
        (hero as { accentImage?: unknown } | undefined)?.accentImage,
        defaultHomepageContent.hero.accentImage
      ),
      proofStats:
        proofStats.length > 0
          ? proofStats
          : defaultHomepageContent.hero.proofStats,
    },
    transformation: {
      slider: {
        startOffset: clamp01(
          transformation?.slider?.startOffset ?? defaultHomepageContent.transformation.slider.startOffset,
          defaultHomepageContent.transformation.slider.startOffset
        ),
        endOffset: clamp01(
          transformation?.slider?.endOffset ?? defaultHomepageContent.transformation.slider.endOffset,
          defaultHomepageContent.transformation.slider.endOffset
        ),
        manualEnabled:
          typeof transformation?.slider?.manualEnabled === "boolean"
            ? transformation.slider.manualEnabled
            : defaultHomepageContent.transformation.slider.manualEnabled,
      },
      items: transformationItems,
    },
    cta: normalizeHomepageCta(candidate.cta, defaultHomepageContent.cta),
  };
}
