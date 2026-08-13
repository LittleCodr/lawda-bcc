import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
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
    ]
  },
};

export default nextConfig;
