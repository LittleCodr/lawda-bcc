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
};

export default nextConfig;

import('@opennextjs/cloudflare').then(m => m.initOpenNextCloudflareForDev());
