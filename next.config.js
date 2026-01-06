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

