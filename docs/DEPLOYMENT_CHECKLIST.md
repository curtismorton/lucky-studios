# Lucky Studios - Vercel Deployment Checklist

## ✅ Completed Tasks

### Latest Local Validation
- ✅ `npm run lint` passed on 2026-03-31
- ✅ `npm run build` passed on 2026-03-31
- ✅ `npm run check:launch` passed on 2026-03-31

### 1. Build Configuration
- ✅ `next.config.js` optimized with image formats, compression, and SWC minification
- ✅ `vercel.json` created with proper configuration
- ✅ TypeScript configuration verified
- ✅ Fixed duplicate export in `app/creators/page.tsx`
- ✅ Created `CreatorsPageClient.tsx` and `BrandsPageClient.tsx` for proper metadata separation

### 2. Environment Variables
- ✅ `.env.example` included
- ⚠️ Required production env vars must be set in Vercel (Spotify + Supabase + form service)

### 3. Vercel Configuration
- ✅ `vercel.json` created with:
  - Build command: `npm run build`
  - Framework: Next.js
  - Region: London (lhr1)
  - Sitemap and robots.txt rewrites

### 4. Code Quality
- ✅ All linter errors fixed
- ✅ Mobile responsiveness verified
- ✅ Touch targets (44px minimum) implemented
- ✅ Proper client/server component separation

## ⚠️ Pre-Deployment Actions Required

### 1. Run Build Test
```bash
npm run build
```
**Action:** Run this locally to verify no build errors before deploying.

### 2. Environment Variables (Required)
Add these in Vercel Dashboard → Settings → Environment Variables:
- `NEXT_PUBLIC_SITE_URL`
- `SPOTIFY_CLIENT_ID`
- `SPOTIFY_CLIENT_SECRET`
- `SPOTIFY_MARKET` (`GB` recommended)
- `CONTACT_FORM_ENDPOINT`
- `SUPABASE_URL`
- `SUPABASE_SERVICE_ROLE_KEY`
- `CMS_SESSION_SECRET`
- `CMS_ADMIN_MFA_CODE`

Optional:
- `NEXT_PUBLIC_CALENDLY_URL`
- `CMS_CONTENT_TABLE`
- `CMS_MEDIA_BUCKET`
- `CMS_MEDIA_PREFIX`
- `CMS_ADMIN_TOKEN` (legacy compatibility only; not used by `/cms` UI)

### 3. Image Assets
- ⚠️ Verify current assets exist and are referenced correctly:
  - `/public/images/LOGO.png`
  - `/public/images/hero/*` used by homepage/transformation sections
  - any CMS-configured image/video URLs

### 4. Final Verification
- [ ] Test all internal links
- [ ] Verify sitemap.xml generates: `/sitemap.xml`
- [ ] Verify robots.txt generates: `/robots.txt`
- [ ] Check all pages load without errors
- [ ] Test contact form submission (Form Service endpoint)
- [ ] Verify mobile responsiveness on real devices
- [ ] Confirm `https://luckystudios.com` serves the Lucky Studios app instead of the current placeholder page

## 🚀 Deployment Steps

### Option 1: Vercel CLI
```bash
# Install Vercel CLI (if not installed)
npm i -g vercel

# Login
vercel login

# Deploy to production
vercel --prod
```

### Option 2: GitHub Integration
1. Push code to GitHub repository
2. Go to Vercel Dashboard
3. Click "New Project"
4. Import your GitHub repository
5. Vercel will auto-detect Next.js and deploy

## 📋 Post-Deployment Checklist

- [ ] Verify production URL loads correctly
- [ ] Test all pages and navigation
- [ ] Check mobile responsiveness
- [ ] Verify sitemap.xml is accessible
- [ ] Test contact form (if endpoint configured)
- [ ] Check browser console for errors
- [ ] Verify metadata appears correctly in social shares
- [ ] Test page load speeds
- [ ] Verify structured data (use Google Rich Results Test)

## 🔧 Known Issues / Future Improvements

1. **Domain cutover**: As of April 9, 2026, `https://lucky-studios.vercel.app` serves the app, but `https://luckystudios.com` still serves a placeholder page. Canonical metadata, sitemap, and robots currently point to `luckystudios.com`, so DNS/domain mapping must be fixed before launch.
2. **Images**: Core logo and hero assets are present locally. Verify any CMS-managed image/video URLs before deploy.
3. **Contact Form**: Ensure `CONTACT_FORM_ENDPOINT` is configured in each environment.
4. **Calendly**: Set `NEXT_PUBLIC_CALENDLY_URL` to enable direct booking CTA.
5. **Google Verification**: Update `verification.google` in `app/layout.tsx` with actual code.
6. **Social Links**: Update canonical values in `lib/data/site.ts`.

## 📝 Notes

- All pages are mobile-responsive with proper breakpoints
- Touch targets meet 44px minimum requirement
- SEO metadata is configured for all pages
- Structured data (JSON-LD) is implemented
- Sitemap and robots.txt are auto-generated
- Fonts are optimized with Google Fonts
- Continue optimizing new media through Next/Image and CMS review before deploy

## 🆘 Troubleshooting

### Build Fails
- Check TypeScript errors: `npm run build`
- Verify all imports use `@/` alias
- Ensure client components have `"use client"` directive

### Runtime Errors
- Check Vercel function logs
- Verify environment variables are set
- Check browser console for client-side errors

### Performance Issues
- Check Vercel Analytics dashboard
- Optimize images (use Next.js Image component)
- Review bundle size in build output

---

**Ready to deploy!** Run `npm run build` locally first, then deploy with `vercel --prod` or via GitHub integration.
