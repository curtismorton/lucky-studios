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

# Optional
NEXT_PUBLIC_GA_ID=your-google-analytics-id
CONTACT_FORM_ENDPOINT=your-api-endpoint
NEXT_PUBLIC_CALENDLY_URL=your-calendly-url
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

#### Links
- [ ] All internal links work
- [ ] External links open correctly
- [ ] No broken hrefs

#### Images
- [ ] All images have alt text
- [ ] Placeholder images are acceptable
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

