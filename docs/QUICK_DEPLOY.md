# Quick Deploy Guide

## Vercel CLI Not Installed

To deploy to Vercel, you have two options:

## Option 1: Install Vercel CLI (Requires Node.js/npm)

First, ensure Node.js is installed:
```bash
# Check if Node.js is installed
node --version
npm --version

# If not installed, install via Homebrew:
brew install node

# Or download from: https://nodejs.org/
```

Then install Vercel CLI:
```bash
npm install -g vercel
```

Login and deploy:
```bash
vercel login
vercel --prod
```

## Option 2: Deploy via Vercel Dashboard (Recommended - No CLI needed)

### Step 1: Push to GitHub
```bash
# Initialize git (if not already)
git init
git add .
git commit -m "Initial commit"

# Create a new repository on GitHub, then:
git remote add origin https://github.com/yourusername/lucky-studios.git
git push -u origin main
```

### Step 2: Deploy on Vercel
1. Go to [vercel.com](https://vercel.com)
2. Sign up/Login with your GitHub account
3. Click **"New Project"**
4. Import your `lucky-studios` repository
5. Vercel will auto-detect Next.js settings:
   - Framework: Next.js
   - Build Command: `npm run build`
   - Output Directory: `.next`
6. Click **"Deploy"**

Vercel will automatically:
- Install dependencies (`npm install`)
- Build your project (`npm run build`)
- Deploy to production
- Provide you with a production URL

### Step 3: Configure Environment Variables (Optional)
If you need any environment variables:
1. Go to Project Settings → Environment Variables
2. Add variables from `.env.example` if needed
3. Redeploy

## Option 3: Use Vercel CLI via npx (No Global Install)

If you have Node.js but don't want to install Vercel globally:
```bash
npx vercel --prod
```

This will download and run Vercel CLI temporarily.

## Current Project Status

✅ **Ready for Deployment:**
- `vercel.json` configured
- `next.config.js` optimized
- All code files in place
- No build errors detected

⚠️ **Before First Deploy:**
- Ensure code is pushed to GitHub (for dashboard method)
- Or have Node.js/npm installed (for CLI method)

## Post-Deployment

After deployment, verify:
- [ ] Production URL loads correctly
- [ ] All pages work
- [ ] Sitemap accessible: `your-domain.com/sitemap`
- [ ] Robots.txt accessible: `your-domain.com/robots`
- [ ] Mobile responsiveness works
- [ ] No console errors

---

**Recommended:** Use Option 2 (Vercel Dashboard) - it's the easiest and doesn't require any local setup!

