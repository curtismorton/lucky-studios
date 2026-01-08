# Quick Start Guide - Spotify Integration Setup

This guide will help you get the Spotify integration up and running in 5 minutes!

## Step 1: Get Spotify API Credentials (2 minutes)

1. Go to [Spotify Developer Dashboard](https://developer.spotify.com/dashboard)
2. Log in with your Spotify account
3. Click **"Create App"**
4. Fill in:
   - **App name**: Lucky Studios (or your choice)
   - **App description**: Podcast show data integration
   - **Website**: Your website URL (optional)
   - **Redirect URI**: Leave empty (not needed)
5. Check the terms and click **"Save"**
6. You'll see your **Client ID** and **Client Secret**
   - Click **"View client secret"** to reveal it

## Step 2: Create Environment File (30 seconds)

Create a file named `.env.local` in the project root:

```bash
# Copy the example file
cp .env.example .env.local
```

Then edit `.env.local` and add your credentials:

```env
SPOTIFY_CLIENT_ID=your_actual_client_id_here
SPOTIFY_CLIENT_SECRET=your_actual_client_secret_here
```

## Step 3: Test Your Connection (1 minute)

Test that your credentials work:

```bash
npm run test:spotify
```

You should see:
```
✅ Credentials found
✅ Authentication successful!
🎉 All tests passed!
```

## Step 4: Find Your Show IDs (1 minute per show)

For each show, you need to find its Spotify show ID:

### Option A: From Spotify URL
1. Go to your show's page on Spotify
2. Copy the URL (e.g., `https://open.spotify.com/show/4rOoJ6Egrf8K2IrywzwOMk`)
3. Extract the ID using our script:

```bash
npm run extract:spotify-id "https://open.spotify.com/show/4rOoJ6Egrf8K2IrywzwOMk"
```

This will output the ID and show you exactly what to add to your code.

### Option B: Manual Extraction
The ID is the part after `/show/` in the URL:
- URL: `https://open.spotify.com/show/4rOoJ6Egrf8K2IrywzwOMk`
- ID: `4rOoJ6Egrf8K2IrywzwOMk`

## Step 5: Add Show IDs to Your Data (1 minute)

Open `lib/data/shows.ts` and find each show. Replace the empty `spotifyShowId` with the actual ID:

```typescript
{
  id: '2',
  slug: 'back-post',
  title: 'Back Post',
  // ... other fields
  spotifyShowId: '4rOoJ6Egrf8K2IrywzwOMk', // ← Add your ID here
}
```

## Step 6: Test with a Show (30 seconds)

Test fetching a specific show:

```bash
npm run test:spotify 4rOoJ6Egrf8K2IrywzwOMk
```

You should see show details like name, publisher, and episode count.

## Step 7: Start the Dev Server

```bash
npm run dev
```

Visit a show page (e.g., `http://localhost:3000/shows/back-post`) and you should see:
- ✅ Spotify cover art displayed
- ✅ Latest episodes from Spotify
- ✅ All data automatically synced

## Troubleshooting

### "Spotify credentials not found"
- Make sure `.env.local` exists in the project root
- Check that variable names are exactly: `SPOTIFY_CLIENT_ID` and `SPOTIFY_CLIENT_SECRET`
- Restart your dev server after adding credentials

### "Authentication failed"
- Double-check your Client ID and Client Secret
- Make sure there are no extra spaces or quotes
- Verify your app is active in the Spotify Dashboard

### "Show not found"
- Verify the show ID is correct
- Make sure the show is publicly available on Spotify
- Try accessing the show URL directly in a browser

### Images not loading
- Check browser console for errors
- Verify `next.config.js` includes Spotify CDN domains (already configured)
- Make sure the show has cover art on Spotify

## Next Steps

Once Spotify is working:
- [ ] Connect your database for analytics (see `DATABASE_SETUP.md`)
- [ ] Test all show pages
- [ ] Deploy to production (see `DEPLOYMENT.md`)

## Need Help?

- Check `SPOTIFY_SETUP.md` for detailed documentation
- Review `IMPLEMENTATION_SUMMARY.md` for full feature list
- Check the Spotify API docs: https://developer.spotify.com/documentation/web-api

