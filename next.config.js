/** @type {import('next').NextConfig} */

// Security headers applied to every response. CSP is deliberately not
// maximally strict (Next.js's own hydration bootstrap and Tailwind/inline
// styles need 'unsafe-inline' unless you wire up nonces, which is a larger
// change) — this is a meaningful hardening step, not a guarantee against
// every possible XSS vector. Test thoroughly after deploying; CSPs
// routinely need one or two follow-up adjustments once you see real
// traffic hit an overlooked resource.
const supabaseOrigin = "https://*.supabase.co";
const isDev = process.env.NODE_ENV !== "production";

const csp = [
  "default-src 'self'",
  // 'unsafe-eval' is only added in dev — Next.js's local dev server (Fast
  // Refresh/HMR) uses eval() internally, which a strict CSP correctly
  // blocks. Production builds don't need it and don't get it.
  `script-src 'self' 'unsafe-inline' ${isDev ? "'unsafe-eval'" : ""} https://unpkg.com https://checkout.razorpay.com`,
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: blob: https:",
  `media-src 'self' blob: ${supabaseOrigin}`,
  "font-src 'self' data:",
  `connect-src 'self' ${supabaseOrigin} wss://*.supabase.co https://api.razorpay.com https://lumberjack.razorpay.com`,
  "worker-src 'self' blob:",
  "frame-src 'self' https://api.razorpay.com https://checkout.razorpay.com",
  "frame-ancestors 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "object-src 'none'",
  ...(isDev ? [] : ["upgrade-insecure-requests"]),
].join("; ");

const securityHeaders = [
  { key: "Content-Security-Policy", value: csp },
  { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains; preload" },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=(), interest-cohort=(), payment=(), usb=()",
  },
];

const nextConfig = {
  reactStrictMode: true,
  output: "standalone",
  images: {
    formats: ["image/avif", "image/webp"],
  },
  // Never ship source maps to the client in production — they'd expose
  // original (unminified, fully commented) source to anyone who opens
  // DevTools on the live site.
  productionBrowserSourceMaps: false,
  async headers() {
    return [
      {
        source: "/:path*",
        headers: securityHeaders,
      },
    ];
  },
};

module.exports = nextConfig;
