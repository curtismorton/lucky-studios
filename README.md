# Lucky Studios

A premium podcast network website built with Next.js 14, featuring a playful and cultural brand identity.

## Tech Stack

- **Next.js 14** with App Router and TypeScript
- **Tailwind CSS v3** with custom configuration
- **Framer Motion** for animations
- **Lucide React** for icons

## Design System

- **Theme**: Dark studio palette (`#1C1C1E`, `#2C2C2E`, `#3A3A3C`)
- **Accent Colors**: 
  - Amber: `#F59E0B` (primary)
  - Gold: `#D97706`
  - Copper: `#B87333`
  - Purple: #8B5CF6
  - Cyan: #06B6D4
  - Green: #10B981
- **Fonts**: 
  - Syne (`next/font/google`, headings)
  - Space Grotesk (`next/font/google`, body)

## Getting Started

### Initial Setup (if starting fresh)
```bash
# Clone and setup (if using template)
npx create-next-app@latest lucky-studios --typescript --tailwind --app

# Navigate and install dependencies
cd lucky-studios
npm install framer-motion lucide-react react-hook-form

# Start development
npm run dev

# Build for production
npm run build

# Deploy to Vercel
vercel --prod
```

### Current Project Setup
This project is already configured with all dependencies. To get started:

```bash
# Install dependencies (if not already installed)
npm install

# Configure local env
cp .env.example .env.local

# Validate launch readiness (env + referenced images)
npm run check:launch

# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

### Build & Deploy
```bash
# Build for production
npm run build

# Deploy to Vercel
vercel --prod
```

See [DEPLOYMENT.md](./DEPLOYMENT.md) for detailed deployment instructions.
See [HOSTING_RUNBOOK.md](./HOSTING_RUNBOOK.md) for the production-safe deploy flow.

## CMS V3

- CMS URL: `/cms`
- Login: Username/password or Supabase email magic link
- AuthZ: RBAC via `cms_user_roles` (`admin`, `editor`, `viewer`)
- Admin MFA: required for publish, rollback, preview toggles, role changes, and import/export
- Legacy URLs: `/admin` redirects to `/cms/login`, `/dashboard` redirects to `/cms`
- Home editor API (form BFF):
  - `GET /api/cms/editor/homepage`
  - `PUT /api/cms/editor/homepage`
  - `POST /api/cms/editor/homepage`
- Session + auth APIs:
  - `POST /api/cms/auth/magic-link`
  - `GET /api/cms/auth/callback`
  - `POST /api/cms/auth/exchange`
  - `POST /api/cms/auth/logout`
  - `GET /api/cms/session`
  - `POST /api/cms/mfa/challenge`
  - `POST /api/cms/mfa/verify`
- Media storage: Supabase Storage `site-media` (configurable via `CMS_MEDIA_BUCKET`)
- Allowed login domains: `CMS_ALLOWED_EMAIL_DOMAINS` (defaults to `sociallypowerful.com`)
- Default first-time company role: `CMS_ALLOWED_EMAIL_DEFAULT_ROLE` (defaults to `editor`)
- First allowed user bootstrap: `admin`
- Username/password toggle: `CMS_USERNAME_PASSWORD_ENABLED`
- Username/password users: `CMS_CREDENTIAL_USERS_BASE64`, numbered `CMS_CREDENTIAL_USER_1`, `CMS_CREDENTIAL_USER_2`, etc, or `CMS_CREDENTIAL_USERS_JSON`

## CMS Core APIs

- Data/auth backing stays on role-protected `/api/dashboard/...` routes
- Core APIs:
  - `GET /api/dashboard/overview`
  - `GET /api/dashboard/entities?module=...`
  - `GET /api/dashboard/entities/:entityKey`
  - `PUT /api/dashboard/entities/:entityKey/draft`
  - `POST /api/dashboard/entities/:entityKey/publish`
  - `POST /api/dashboard/entities/:entityKey/rollback/:snapshotId`
  - `GET /api/dashboard/entities/:entityKey/history`
  - `GET /api/dashboard/media`
  - `POST /api/dashboard/media/upload`
  - `PATCH /api/dashboard/media/:assetId`
  - `POST /api/dashboard/media/:assetId/replace`
  - `GET /api/dashboard/media/:assetId/usages`
  - `POST /api/dashboard/preview/start`
  - `POST /api/dashboard/preview/stop`
  - `GET /api/dashboard/export`
  - `POST /api/dashboard/import`
- Data model migration SQL:
  - `supabase/migrations/20260224000100_cms_v2_dashboard.sql`
- Feature flags:
  - `CMS_V2_DASHBOARD_ENABLED`
  - `CMS_V2_READS_ENABLED`
  - `CMS_V2_WRITES_ENABLED`
  - `CMS_LEGACY_ADMIN_READONLY`

## Show Analytics

- Endpoint: `/api/analytics/show/[slug]`
- Data source: Supabase `episodes` table
- Expected columns: `show_id`, `title`, `views`, `release_date`, `duration_ms`
- Empty datasets return zeroed analytics so UI hides gracefully

## Project Structure

```
├── app/
│   ├── globals.css       # Global styles with CSS variables
│   ├── layout.tsx        # Root layout with fonts
│   └── page.tsx          # Home page
├── tailwind.config.ts    # Tailwind configuration with custom theme
└── package.json
```

## Brand Identity

Lucky Studios embodies a **playful and cultural** aesthetic - modern, bold, but approachable. The design emphasizes premium quality while maintaining an inviting, non-corporate feel.

# lucky-studios
