import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  compress: true,
  images: {
    formats: ['image/avif', 'image/webp'],
    minimumCacheTTL: 31536000, // Cache optimized images for 1 year to minimize Vercel Image writes/bandwidth
    deviceSizes: [640, 750, 828, 1080, 1200],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "cdn.shopify.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "www.everlasting.shop",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "octopusperfume.in",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "www.octopusperfume.in",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "octopusperfumes.in",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "www.octopusperfumes.in",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "buyoctopusperfume.in",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "www.buyoctopusperfume.in",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "buyoctopus.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "www.perfumenetwork.in",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "perfumenetwork.in",
        pathname: "/**",
      },
    ],
  },
  async redirects() {
    return [
      // Redirect old domain → new primary domain
      {
        source: '/:path*',
        has: [
          {
            type: 'host',
            value: 'buyoctopusperfume.in',
          },
        ],
        destination: 'https://octopusperfume.in/:path*',
        permanent: true,
      },
      {
        source: '/:path*',
        has: [
          {
            type: 'host',
            value: 'www.buyoctopusperfume.in',
          },
        ],
        destination: 'https://octopusperfume.in/:path*',
        permanent: true,
      },
      {
        source: '/:path*',
        has: [
          {
            type: 'host',
            value: 'octopusperfumes.in',
          },
        ],
        destination: 'https://octopusperfume.in/:path*',
        permanent: true,
      },
      {
        source: '/:path*',
        has: [
          {
            type: 'host',
            value: 'www.octopusperfumes.in',
          },
        ],
        destination: 'https://octopusperfume.in/:path*',
        permanent: true,
      },
      // Coupon redirects for SEO & UX
      {
        source: '/coupons',
        destination: '/octopus-perfume-coupon-code',
        permanent: true,
      },
      {
        source: '/coupon-codes',
        destination: '/octopus-perfume-coupon-code',
        permanent: true,
      },
      {
        source: '/octopus-coupon-code',
        destination: '/octopus-perfume-coupon-code',
        permanent: true,
      },
      // Redirect www → non-www (canonical)
      {
        source: '/:path*',
        has: [
          {
            type: 'host',
            value: 'www.octopusperfume.in',
          },
        ],
        destination: 'https://octopusperfume.in/:path*',
        permanent: true,
      },
    ];
  },
  async headers() {
    return [
      {
        source: '/:all*(svg|jpg|jpeg|png|webp|avif|ico|woff2)',
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

export default nextConfig;
