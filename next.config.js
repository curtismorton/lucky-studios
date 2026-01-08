/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    formats: ['image/avif', 'image/webp'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'luckystudios.com',
      },
      {
        protocol: 'https',
        hostname: 'i.scdn.co', // Spotify CDN for images
      },
      {
        protocol: 'https',
        hostname: 'image-cdn-ak.spotifycdn.com', // Spotify image CDN
      },
      {
        protocol: 'https',
        hostname: 'image-cdn-fa.spotifycdn.com', // Spotify image CDN alternative
      },
    ],
  },
  // Optimize production builds
  swcMinify: true,
  // Enable compression
  compress: true,
  // Production source maps (optional, disable for smaller builds)
  productionBrowserSourceMaps: false,
}

module.exports = nextConfig

