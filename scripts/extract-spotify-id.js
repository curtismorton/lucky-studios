/**
 * Extract Spotify Show ID from URL
 * 
 * This script helps you extract the Spotify show ID from a Spotify URL.
 * 
 * Usage:
 *   node scripts/extract-spotify-id.js <spotify-url>
 * 
 * Examples:
 *   node scripts/extract-spotify-id.js https://open.spotify.com/show/4rOoJ6Egrf8K2IrywzwOMk
 *   node scripts/extract-spotify-id.js https://open.spotify.com/show/4rOoJ6Egrf8K2IrywzwOMk?si=abc123
 */

function extractSpotifyShowId(url) {
  if (!url) {
    console.error('❌ Error: Please provide a Spotify URL');
    console.log('\nUsage: node scripts/extract-spotify-id.js <spotify-url>');
    console.log('Example: node scripts/extract-spotify-id.js https://open.spotify.com/show/4rOoJ6Egrf8K2IrywzwOMk');
    process.exit(1);
  }

  // Match Spotify show URL pattern
  // https://open.spotify.com/show/{id}
  const match = url.match(/spotify\.com\/show\/([a-zA-Z0-9]+)/);

  if (!match) {
    console.error('❌ Error: Invalid Spotify URL format');
    console.log('\nExpected format: https://open.spotify.com/show/{show-id}');
    console.log(`Received: ${url}`);
    process.exit(1);
  }

  const showId = match[1];
  
  console.log('✅ Spotify Show ID extracted successfully!\n');
  console.log(`Show ID: ${showId}`);
  console.log('\n📋 Add this to lib/data/shows.ts:');
  console.log(`   spotifyShowId: '${showId}',`);
  console.log('\n💡 Copy the line above and paste it into the appropriate show object.');

  return showId;
}

// Get URL from command line argument
const url = process.argv[2];
extractSpotifyShowId(url);

