# Setup Checklist

Use this checklist to track your setup progress.

## ✅ Pre-Setup (Already Done)

- [x] Spotify API integration code implemented
- [x] Analytics components created
- [x] All components updated to use Spotify data
- [x] Helper scripts created
- [x] Documentation written

## 🔧 Setup Steps

### 1. Environment Configuration

- [ ] Create `.env.local` file in project root
- [ ] Add `SPOTIFY_CLIENT_ID` to `.env.local`
- [ ] Add `SPOTIFY_CLIENT_SECRET` to `.env.local`
- [ ] Test credentials: `npm run test:spotify`

### 2. Spotify Show IDs

For each show, find and add the Spotify show ID:

- [ ] **Behind the Screens** - Find ID and add to `lib/data/shows.ts`
- [ ] **Back Post** - Find ID and add to `lib/data/shows.ts`
- [ ] **Don't Get Me Started with Abby Boom** - Find ID and add to `lib/data/shows.ts`
- [ ] **Coming Soon** - Skip (no Spotify ID needed)

**Quick way to find IDs:**
```bash
npm run extract:spotify-id "https://open.spotify.com/show/YOUR_SHOW_ID"
```

### 3. Testing

- [ ] Test authentication: `npm run test:spotify`
- [ ] Test show fetch: `npm run test:spotify <show-id>`
- [ ] Start dev server: `npm run dev`
- [ ] Visit show pages and verify:
  - [ ] Cover art displays from Spotify
  - [ ] Latest episodes load from Spotify
  - [ ] No console errors

### 4. Database Analytics (Optional)

- [ ] Choose database (PostgreSQL, MongoDB, Supabase, etc.)
- [ ] Set up database connection
- [ ] Update `app/api/analytics/show/[slug]/route.ts` with database queries
- [ ] Test analytics endpoint
- [ ] Verify analytics display on show pages

### 5. Production Deployment

- [ ] Push code to GitHub
- [ ] Set environment variables in Vercel/hosting platform
- [ ] Deploy to production
- [ ] Test production site
- [ ] Verify Spotify integration works in production

## 📝 Notes

- Keep `.env.local` in `.gitignore` (already configured)
- Never commit credentials to git
- Test locally before deploying
- Spotify API has rate limits (10,000 requests/hour)

## 🆘 Need Help?

- See `QUICK_START.md` for step-by-step instructions
- See `SPOTIFY_SETUP.md` for detailed Spotify setup
- See `DATABASE_SETUP.md` for database integration
- See `IMPLEMENTATION_SUMMARY.md` for feature overview

