import type { NextConfig } from "next";

const isProd = process.env.NODE_ENV === "production";

/**
 * Production security headers. CSP deliberately allows the pieces Next.js and
 * the client-side experience need: inline hydration scripts/styles, WebGL
 * (blob:/data: for textures), next/font (self-hosted), GitHub avatar images,
 * and our own same-origin API calls + dev HMR websocket.
 */
const securityHeaders = [
  {
    key: "Content-Security-Policy",
    value: [
      "default-src 'self'",
      "script-src 'self' 'unsafe-inline' 'unsafe-eval'",
      "style-src 'self' 'unsafe-inline'",
      "img-src 'self' data: blob: https://avatars.githubusercontent.com https://*.githubusercontent.com",
      "font-src 'self' data:",
      "connect-src 'self' ws: https://api.github.com https://api.codolio.com",
      "object-src 'none'",
      "base-uri 'self'",
      "form-action 'self'",
      "frame-ancestors 'none'",
      isProd ? "upgrade-insecure-requests" : "",
    ]
      .filter(Boolean)
      .join("; "),
  },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
  { key: "X-DNS-Prefetch-Control", value: "on" },
  { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains; preload" },
];

const nextConfig: NextConfig = {
  poweredByHeader: false,
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: securityHeaders,
      },
    ];
  },
};

export default nextConfig;