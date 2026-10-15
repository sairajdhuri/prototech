import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  poweredByHeader: false,
  devIndicators: false,
  images: {
    remotePatterns: [{ protocol: "https", hostname: "img1.wsimg.com", pathname: "/isteam/ip/68492da2-903b-4178-b641-6c9c1d026062/**" }],
    formats: ["image/avif", "image/webp"],
  },
  redirects() {
    return [
      { source: "/about-us", destination: "/about", permanent: true },
      { source: "/our-products", destination: "/products", permanent: true },
      { source: "/our-customers", destination: "/customers", permanent: true },
      { source: "/privacy-policy", destination: "/privacy", permanent: true },
      { source: "/terms-and-conditions", destination: "/terms", permanent: true },
    ];
  },
  async headers() {
    return [{ source: "/(.*)", headers: [
      { key: "X-Content-Type-Options", value: "nosniff" },
      { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
      { key: "X-Frame-Options", value: "DENY" },
      { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
    ] }];
  },
};
export default nextConfig;
