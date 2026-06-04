import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  experimental: {
    // Amplify serves the app behind CloudFront, which rewrites the host header.
    // Without this, Next.js rejects Server Actions (e.g. publishPain) because the
    // Origin header doesn't match the forwarded host — the action silently fails.
    serverActions: {
      allowedOrigins: [
        "main.d2ndbxm77ao4qm.amplifyapp.com",
        "*.amplifyapp.com",
      ],
    },
  },
};

export default nextConfig;
