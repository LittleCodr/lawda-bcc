import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
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
      {
        source: '/:path*',
        has: [
          {
            type: 'host',
            value: 'www.octopusperfumes.in',
          },
        ],
        destination: 'https://buyoctopusperfume.in/:path*',
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
        destination: 'https://buyoctopusperfume.in/:path*',
        permanent: true,
      }
    ]
  },
};

export default nextConfig;

import('@opennextjs/cloudflare').then(m => m.initOpenNextCloudflareForDev());
