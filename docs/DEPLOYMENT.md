# Lucky Studios - Vercel Deployment Guide

## Pre-Deployment Checklist

### 1. Build Test
```bash
npm run build
```
- ✅ Fix any TypeScript errors
- ✅ Fix any import errors
- ✅ Ensure all pages compile

### 2. Environment Variables

Create `.env.local` with the following (see `.env.example` for template):

```env
# Required
NEXT_PUBLIC_SITE_URL=https://luckystudios.com
SPOTIFY_CLIENT_ID=...
SPOTIFY_CLIENT_SECRET=...
SPOTIFY_MARKET=GB
CONTACT_FORM_ENDPOINT=https://formspree.io/f/...
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_ROLE_KEY=...
CMS_SESSION_SECRET=...
CMS_ADMIN_MFA_CODE=...

# Optional
NEXT_PUBLIC_CALENDLY_URL=https://calendly.com/your-handle
CMS_CONTENT_TABLE=site_content
CMS_MEDIA_BUCKET=site-media
CMS_MEDIA_PREFIX=homepage
CMS_ADMIN_TOKEN=... # legacy compatibility only (not used by /cms UI)
```

**In Vercel Dashboard:**
1. Go to Project Settings → Environment Variables
2. Add all variables from `.env.local`
3. Set for Production, Preview, and Development

### 3. Vercel Configuration

The `vercel.json` file is already configured with:
- Build command: `npm run build`
- Framework: Next.js
- Region: London (lhr1)
- Sitemap and robots.txt rewrites

### 4. Final Checks

#### Domain Mapping
- [ ] `https://luckystudios.com` serves the Lucky Studios app, not a placeholder page
- [ ] `https://luckystudios.com/sitemap.xml` returns the generated sitemap
- [ ] `https://luckystudios.com/robots.txt` returns the generated robots file
- [ ] Canonical/OG URLs match the actually live public hostname

#### Links
- [ ] All internal links work
- [ ] External links open correctly
- [ ] No broken hrefs

#### Images
- [ ] All images have alt text
- [ ] Hero/transformation image paths exist under `public/images`
- [ ] OG images are referenced correctly

#### Performance
- [ ] No console errors
- [ ] Fast initial load
- [ ] Optimized fonts (Google Fonts)
- [ ] Images optimized (when added)

#### SEO
- [ ] All pages have unique metadata
- [ ] Structured data validates
- [ ] Sitemap generates correctly
- [ ] Robots.txt configured

## Deployment Steps

1. **Install Vercel CLI** (if not already installed):
   ```bash
   npm i -g vercel
   ```

2. **Login to Vercel**:
   ```bash
   vercel login
   ```

3. **Deploy to Production**:
   ```bash
   vercel --prod
   ```

4. **Or deploy via GitHub**:
   - Push code to GitHub
   - Connect repository in Vercel dashboard
   - Vercel will auto-deploy on push

## Post-Deployment

1. Test all pages on production URL
2. Verify environment variables are set
3. Check analytics (if configured)
4. Test contact form
5. Verify sitemap.xml and robots.txt
6. Verify `/api/spotify/show/:id` returns data in production
7. Verify `/api/analytics/show/:slug` returns Supabase-backed data
8. Verify the custom domain (`https://luckystudios.com`) is pointed at the app before treating the deployment as live

## Current Production Observation

Observed on April 9, 2026:
- `https://lucky-studios.vercel.app` is serving the app correctly.
- `https://luckystudios.com` is still serving a "Coming Soon" placeholder page.
- Because `NEXT_PUBLIC_SITE_URL` and metadata point at `https://luckystudios.com`, canonical tags, sitemap entries, and robots output currently reference a hostname that is not serving the app.

This makes domain cutover the main remaining production blocker.

## Troubleshooting

### Build Errors
- Check TypeScript errors: `npm run build`
- Verify all imports use `@/` alias
- Ensure client components have `"use client"`

### Runtime Errors
- Check browser console
- Verify environment variables are set
- Check Vercel function logs

### Performance Issues
- Check Vercel Analytics
- Optimize images
- Review bundle size
