/**
 * Test Spotify API Connection
 * 
 * This script tests your Spotify API credentials and optionally tests fetching a show.
 * 
 * Usage:
 *   node scripts/test-spotify.js
 *   node scripts/test-spotify.js <spotify-show-id>
 * 
 * Example:
 *   node scripts/test-spotify.js 4rOoJ6Egrf8K2IrywzwOMk
 */

require('dotenv').config({ path: '.env.local' });

async function testSpotifyConnection(showId = null) {
  const clientId = process.env.SPOTIFY_CLIENT_ID;
  const clientSecret = process.env.SPOTIFY_CLIENT_SECRET;

  console.log('🎵 Testing Spotify API Connection...\n');

  // Check credentials
  if (!clientId || !clientSecret) {
    console.error('❌ Error: Spotify credentials not found!');
    console.log('\nPlease add to .env.local:');
    console.log('  SPOTIFY_CLIENT_ID=your_client_id');
    console.log('  SPOTIFY_CLIENT_SECRET=your_client_secret');
    console.log('\nGet credentials from: https://developer.spotify.com/dashboard');
    process.exit(1);
  }

  if (clientId === 'your_spotify_client_id_here' || clientSecret === 'your_spotify_client_secret_here') {
    console.error('❌ Error: Please replace placeholder values with your actual Spotify credentials!');
    process.exit(1);
  }

  console.log('✅ Credentials found');
  console.log(`   Client ID: ${clientId.substring(0, 10)}...`);

  try {
    // Test authentication
    console.log('\n🔐 Testing authentication...');
    const tokenResponse = await fetch('https://accounts.spotify.com/api/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': `Basic ${Buffer.from(`${clientId}:${clientSecret}`).toString('base64')}`,
      },
      body: new URLSearchParams({
        grant_type: 'client_credentials',
      }),
    });

    if (!tokenResponse.ok) {
      const error = await tokenResponse.text();
      console.error('❌ Authentication failed!');
      console.error(`   Status: ${tokenResponse.status} ${tokenResponse.statusText}`);
      console.error(`   Error: ${error}`);
      process.exit(1);
    }

    const tokenData = await tokenResponse.json();
    console.log('✅ Authentication successful!');
    console.log(`   Token expires in: ${tokenData.expires_in} seconds`);

    // Test fetching a show if ID provided
    if (showId) {
      console.log(`\n📻 Testing show fetch for ID: ${showId}...`);
      const showResponse = await fetch(`https://api.spotify.com/v1/shows/${showId}`, {
        headers: {
          'Authorization': `Bearer ${tokenData.access_token}`,
        },
      });

      if (!showResponse.ok) {
        console.error('❌ Failed to fetch show!');
        console.error(`   Status: ${showResponse.status} ${showResponse.statusText}`);
        if (showResponse.status === 404) {
          console.error('   The show ID might be incorrect or the show might not be publicly available.');
        }
        process.exit(1);
      }

      const show = await showResponse.json();
      console.log('✅ Show fetched successfully!');
      console.log(`   Name: ${show.name}`);
      console.log(`   Publisher: ${show.publisher}`);
      console.log(`   Total Episodes: ${show.total_episodes}`);
      console.log(`   Spotify URL: ${show.external_urls.spotify}`);
      
      if (show.images && show.images.length > 0) {
        console.log(`   Cover Art: ${show.images[0].url}`);
      }
    } else {
      console.log('\n💡 Tip: Add a show ID to test fetching show data:');
      console.log('   node scripts/test-spotify.js <spotify-show-id>');
    }

    console.log('\n🎉 All tests passed! Your Spotify API is configured correctly.');
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

// Get show ID from command line argument
const showId = process.argv[2] || null;
testSpotifyConnection(showId);

