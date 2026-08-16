import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      { source: "/new", destination: "/console/new", permanent: false },
      { source: "/jobs/:id", destination: "/console/jobs/:id", permanent: false },
    ];
  },
};

export default nextConfig;
