# Spotify API & Analytics Integration - Implementation Summary

## ✅ What's Been Implemented

### 1. Spotify API Integration

**Files Created:**
- `lib/services/spotify.ts` - Spotify API service with authentication and data fetching
- `lib/hooks/useSpotifyShow.ts` - React hook for fetching Spotify data in components
- `app/api/spotify/show/[showId]/route.ts` - API endpoint for show data
- `app/api/spotify/episodes/[showId]/route.ts` - API endpoint for episodes

**Features:**
- Automatic cover art fetching from Spotify
- Latest episodes pulled from Spotify API
- Caching for performance (1 hour for shows, 30 min for episodes)
- Client Credentials authentication flow
- Error handling and fallbacks

### 2. Updated Components

**ShowCard Component:**
- Now displays Spotify cover art when available
- Falls back to gradient placeholder if no Spotify data

**ShowHero Component:**
- Displays Spotify cover art in the hero section
- Falls back to gradient placeholder

**ShowEpisodes Component:**
- Fetches and displays latest episodes from Spotify
- Falls back to static episodes if Spotify data unavailable
- Shows episode duration, release date, and links to Spotify

### 3. Analytics Integration

**Files Created:**
- `components/shows/ShowAnalytics.tsx` - Analytics display component
- `app/api/analytics/show/[slug]/route.ts` - Analytics API endpoint (ready for database connection)

**Features:**
- Displays total views, episodes, average views, growth rate
- Shows top episodes with view counts
- Gracefully handles missing data
- Beautiful animated UI with icons

### 4. Data Structure Updates

**Updated:**
- `lib/data/shows.ts` - Added `spotifyShowId` field to Show interface
- All shows now have a `spotifyShowId` field (currently empty, needs to be filled)

### 5. Configuration

**Updated:**
- `next.config.js` - Added Spotify CDN domains to image remote patterns
- Created `SPOTIFY_SETUP.md` - Setup guide for Spotify integration
- Created `DATABASE_SETUP.md` - Setup guide for database analytics

## 🔧 What You Need to Do

### Step 1: Set Up Spotify API

1. **Get Spotify Credentials:**
   - Go to [Spotify Developer Dashboard](https://developer.spotify.com/dashboard)
   - Create an app
   - Copy Client ID and Client Secret

2. **Add Environment Variables:**
   Create `.env.local` file:
   ```env
   SPOTIFY_CLIENT_ID=your_client_id
   SPOTIFY_CLIENT_SECRET=your_client_secret
   ```

3. **Add Spotify Show IDs:**
   - Find each show's Spotify ID from their Spotify URL
   - Update `lib/data/shows.ts` with the `spotifyShowId` for each show
   - Example: For "Back Post", if the Spotify URL is `https://open.spotify.com/show/4rOoJ6Egrf8K2IrywzwOMk`, the ID is `4rOoJ6Egrf8K2IrywzwOMk`

### Step 2: Set Up Database Analytics (Optional)

1. **Choose Your Database:**
   - PostgreSQL (Vercel Postgres, Supabase)
   - MongoDB
   - Prisma ORM
   - Or any other database

2. **Update Analytics API:**
   - Edit `app/api/analytics/show/[slug]/route.ts`
   - Replace the mock data section with your database queries
   - See `DATABASE_SETUP.md` for examples

3. **Add Database Connection:**
   - Add database connection string to `.env.local`
   - Install necessary packages

## 📋 Example: Adding Spotify ID to "Back Post"

```typescript
// In lib/data/shows.ts
{
  id: '2',
  slug: 'back-post',
  title: 'Back Post',
  // ... other fields
  spotifyShowId: '4rOoJ6Egrf8K2IrywzwOMk', // Add the actual Spotify show ID
}
```

## 🎯 How It Works

### Automatic Data Fetching

1. **Cover Art:**
   - Components check if `spotifyShowId` exists
   - If yes, fetch cover art from Spotify API
   - Display the image, or fall back to gradient placeholder

2. **Episodes:**
   - `ShowEpisodes` component fetches latest episodes from Spotify
   - Displays them with proper formatting
   - Falls back to static episodes if Spotify unavailable

3. **Analytics:**
   - Fetches from your database via API endpoint
   - Displays metrics in a beautiful card layout
   - Hides if no data available

### Caching Strategy

- **Show Data:** Cached for 1 hour, stale-while-revalidate for 24 hours
- **Episodes:** Cached for 30 minutes, stale-while-revalidate for 1 hour
- **Analytics:** Cached for 5 minutes, stale-while-revalidate for 10 minutes

## 🚀 Testing

1. **Test Spotify Integration:**
   ```bash
   # Start dev server
   npm run dev
   
   # Visit a show page with spotifyShowId set
   # Check browser console for any errors
   ```

2. **Test Analytics:**
   ```bash
   # Test the API endpoint directly
   curl http://localhost:3000/api/analytics/show/back-post
   ```

## 📝 Notes

- All components gracefully handle missing data
- The system works even if Spotify API is unavailable (falls back to static data)
- Analytics component only shows if data is available
- Images are optimized through Next.js Image component
- All API calls are cached for performance

## 🔍 Files Modified

- `lib/data/shows.ts` - Added spotifyShowId field
- `components/shows/ShowCard.tsx` - Added Spotify cover art
- `components/shows/ShowHero.tsx` - Added Spotify cover art
- `components/shows/ShowEpisodes.tsx` - Added Spotify episodes fetching
- `app/shows/[slug]/page.tsx` - Added ShowAnalytics component
- `next.config.js` - Added Spotify CDN domains

## 📚 Documentation

- `SPOTIFY_SETUP.md` - Complete Spotify setup guide
- `DATABASE_SETUP.md` - Database integration examples
- This file - Implementation summary

## ⚠️ Important

- Make sure to add Spotify credentials to `.env.local` (not committed to git)
- Add Spotify show IDs to each show in `lib/data/shows.ts`
- Update the analytics API route with your actual database queries
- Test in development before deploying to production

