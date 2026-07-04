import type { NextConfig } from "next";
import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin();

const nextConfig: NextConfig = {
  compress: true,
  experimental: {
    // Inline critical CSS into HTML — eliminates render-blocking CSS chunks
    // This is the biggest LCP win: ~1000ms saved on mobile
    optimizeCss: true,
  },
  images: {
    formats: ['image/avif', 'image/webp'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
    ],
    // Mobile-first sizes: 390 is iPhone 14 viewport
    deviceSizes: [390, 640, 750, 828, 1080, 1200],
    imageSizes: [32, 64, 96, 128, 256],
    // Lower default quality — saves payload without visible quality loss
    minimumCacheTTL: 60 * 60 * 24 * 365,
    qualities: [25, 50, 60, 75, 90, 100],
    localPatterns: [
      {
        pathname: '/**',
        search: '',
      },
    ],
  },
  // Cache static image assets aggressively
  async headers() {
    return [
      {
        source: '/images/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
    ];
  },
};

export default withNextIntl(nextConfig);
