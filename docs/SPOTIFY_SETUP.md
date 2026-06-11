# Spotify API Integration Setup

This guide explains how to set up Spotify API integration for automatic show data fetching.

## Prerequisites

1. A Spotify Developer account
2. A Spotify app created in the [Spotify Developer Dashboard](https://developer.spotify.com/dashboard)

## Setup Steps

### 1. Create a Spotify App

1. Go to [Spotify Developer Dashboard](https://developer.spotify.com/dashboard)
2. Click "Create App"
3. Fill in:
   - **App name**: Lucky Studios (or your preferred name)
   - **App description**: Podcast show data integration
   - **Redirect URI**: Not needed for Client Credentials flow
   - **Website**: Your website URL
4. Accept the terms and create the app

### 2. Get Your Credentials

1. In your app dashboard, you'll see:
   - **Client ID**: Copy this
   - **Client Secret**: Click "View client secret" and copy it

### 3. Configure Environment Variables

Add these to your `.env.local` file:

```env
SPOTIFY_CLIENT_ID=your_client_id_here
SPOTIFY_CLIENT_SECRET=your_client_secret_here
```

### 4. Find Spotify Show IDs

For each show, you need to find its Spotify show ID:

1. Go to the show's page on Spotify (e.g., `https://open.spotify.com/show/4rOoJ6Egrf8K2IrywzwOMk`)
2. The show ID is the last part of the URL: `4rOoJ6Egrf8K2IrywzwOMk`
3. Alternatively, you can search for the show in Spotify and get the ID from the URL

### 5. Add Show IDs to Your Data

Update `lib/data/shows.ts` and add the `spotifyShowId` to each show:

```typescript
{
  id: '2',
  slug: 'back-post',
  title: 'Back Post',
  // ... other fields
  spotifyShowId: '4rOoJ6Egrf8K2IrywzwOMk', // Add the Spotify show ID here
}
```

## How It Works

### Automatic Data Fetching

Once configured, the system will automatically:

1. **Fetch Cover Art**: Show cards and hero sections will display the actual Spotify cover art
2. **Fetch Latest Episodes**: The episodes section will show the most recent episodes from Spotify
3. **Update Automatically**: Data is cached but refreshes periodically to stay up-to-date

### API Endpoints

- `/api/spotify/show/[showId]` - Fetches show data and episodes
- `/api/spotify/episodes/[showId]` - Fetches episodes only

### Caching

- Show data is cached for 1 hour
- Episodes are cached for 30 minutes
- Stale-while-revalidate is enabled for better performance

## Troubleshooting

### "Spotify credentials not configured"

Make sure you've added `SPOTIFY_CLIENT_ID` and `SPOTIFY_CLIENT_SECRET` to your `.env.local` file.

### "Spotify show not found"

- Verify the show ID is correct
- Make sure the show is publicly available on Spotify
- Check that your Spotify app has the correct permissions

### Images not loading

- Check that `next.config.js` includes Spotify CDN domains (already configured)
- Verify the show has cover art on Spotify

## Rate Limits

Spotify API has rate limits:
- Client Credentials flow: 10,000 requests per hour per app
- The caching strategy helps minimize API calls

If you hit rate limits, increase cache durations in the API routes.

