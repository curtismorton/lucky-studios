# Spotify, CMS, Analytics, and Launch Hardening Summary

## Implemented

### Rendering and Caching
- Marketing pages now use static rendering with revalidation (`86400` seconds):
  - `/`
  - `/about`
  - `/brands`
  - `/creators`
  - `/studio`
  - `/contact`
  - `/shows`
- Show detail pages use revalidation (`3600` seconds):
  - `/shows/[slug]`
- Show detail pages now include `generateStaticParams()` from `lib/data/shows.ts`.
- CMS fetches are cache-tagged and revalidated on write:
  - Homepage tag: `cms:homepage`
  - Marketing pages tag: `cms:marketing-pages`

### Metadata and SEO
- Canonical site config centralized in `lib/data/site.ts`.
- Layout metadata now uses canonical config for:
  - `metadataBase`
  - Open Graph/Twitter image
  - icon references
- Structured data now uses canonical site config and valid logo path (`/images/LOGO.png`).
- Show metadata now uses real fallback image logic:
  - `show.ogImage ?? site.ogImage`

### Spotify Integration
- In-memory Spotify token caching with in-flight dedupe in `lib/services/spotify.ts`.
- `SPOTIFY_MARKET` env var support added (default: `GB`).
- New bulk API endpoint:
  - `GET /api/spotify/shows?ids=<comma-separated>`
- New hook:
  - `lib/hooks/useSpotifyShows.ts`
- Show lists now use bulk Spotify fetch (reduced fan-out):
  - `app/shows/ShowsPageClient.tsx`
  - `components/home/ShowsGrid.tsx`
- Show detail now preloads Spotify data server-side once and passes it down to:
  - `components/shows/ShowHero.tsx`
  - `components/shows/ShowEpisodes.tsx`

### Supabase Analytics
- Server analytics service added:
  - `lib/services/analytics.ts`
- Analytics API now aggregates real data from `episodes` table:
  - `app/api/analytics/show/[slug]/route.ts`
- Empty datasets still return zeroed analytics so UI can hide gracefully.

### Lead Capture and CTAs
- Contact form submits to `CONTACT_FORM_ENDPOINT`.
- Success/error states added.
- Submit is disabled when endpoint env var is missing.
- Book-a-call CTAs now use `NEXT_PUBLIC_CALENDLY_URL` with `/contact` fallback:
  - Navbar
  - Mobile menu
  - Contact page
  - Studio page
  - Hero primary CTA

### Typography and Brand System
- Fonts aligned to design spec via `next/font/google`:
  - `Syne` for headings
  - `Space Grotesk` for body
- Tailwind font families now use CSS variables from Next Font.
- Global CSS updated to use font variables for body/headings.

### Homepage and Cleanup
- Added missing homepage sections:
  - `StatsBar`
  - `Testimonials`
- Removed unused files:
  - `components/home/HostImages.tsx`
  - `components/home/AudioWaveform.tsx`
  - `components/AnimateOnScroll.tsx`
  - `components/ui/Button.tsx`
  - `app/metadata.ts`

### Docs and Environment
- `.env.example` added with required and optional env vars.
- Updated docs to reflect current configuration:
  - `README.md`
  - `QUICK_START.md`
  - `DEPLOYMENT.md`
  - `DEPLOYMENT_CHECKLIST.md`
  - `public/images/README.md`
  - `public/images/hero/README.md`

## Current Required Environment Variables

```env
NEXT_PUBLIC_SITE_URL=https://luckystudios.com
SPOTIFY_CLIENT_ID=...
SPOTIFY_CLIENT_SECRET=...
SPOTIFY_MARKET=GB
CONTACT_FORM_ENDPOINT=https://formspree.io/f/...
SUPABASE_URL=https://<project>.supabase.co
SUPABASE_SERVICE_ROLE_KEY=...
CMS_SESSION_SECRET=...
CMS_ADMIN_MFA_CODE=...
```

## Optional Environment Variables

```env
NEXT_PUBLIC_CALENDLY_URL=https://calendly.com/...
CMS_CONTENT_TABLE=site_content
CMS_MEDIA_BUCKET=site-media
CMS_MEDIA_PREFIX=homepage
CMS_ADMIN_TOKEN=... # legacy compatibility only
```

## Verification Targets

- `npm run lint`
- `npm run build`
- `npm run check:launch`
- `GET /sitemap.xml`
- `GET /robots.txt`
- `GET /api/spotify/show/:showId`
- `GET /api/spotify/shows?ids=...`
- `GET /api/analytics/show/:slug`
