import type { NextConfig } from "next";

const isDev = process.env.NODE_ENV === "development";
const supabaseHost = (() => {
  try {
    return new URL(process.env.NEXT_PUBLIC_SUPABASE_URL ?? "").hostname;
  } catch {
    return "";
  }
})();
const supabaseOrigin = supabaseHost ? `https://${supabaseHost}` : "";

// CSP sin nonces: compatible con prerenderizado parcial (los nonces obligarían a renderizar todo en cada request).
const csp = [
  "default-src 'self'",
  `script-src 'self' 'unsafe-inline' https://challenges.cloudflare.com${isDev ? " 'unsafe-eval'" : ""}`,
  "style-src 'self' 'unsafe-inline'",
  `img-src 'self' data: blob: ${supabaseOrigin} https://lh3.googleusercontent.com`,
  "font-src 'self' data:",
  `connect-src 'self' ${supabaseOrigin} ${supabaseOrigin.replace("https://", "wss://")} https://challenges.cloudflare.com${isDev ? " ws:" : ""}`,
  "frame-src https://challenges.cloudflare.com",
  "manifest-src 'self'",
  "object-src 'none'",
  "base-uri 'self'",
  `form-action 'self' ${supabaseOrigin} https://accounts.google.com`,
  "frame-ancestors 'none'",
  ...(isDev ? [] : ["upgrade-insecure-requests"]),
]
  .map((d) => d.replace(/\s+/g, " ").trim())
  .join("; ");

const securityHeaders = [
  { key: "Content-Security-Policy", value: csp },
  { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=(), browsing-topics=()" },
  { key: "Cross-Origin-Opener-Policy", value: "same-origin" },
];

const nextConfig: NextConfig = {
  experimental: {
    agentFeedback: true,
    serverActions: {
      bodySizeLimit: "8mb",
    },
  },
  poweredByHeader: false,
  async headers() {
    return [{ source: "/:path*", headers: securityHeaders }];
  },
  cacheComponents: true,
  partialPrefetching: true,
  reactCompiler: true,
  images: {
    // Las fotos llevan hash en el nombre: se pueden cachear un mes sin riesgo.
    minimumCacheTTL: 2678400,
    // Solo el bucket público de este proyecto: el optimizador no debe servir imágenes ajenas.
    remotePatterns: supabaseHost
      ? [{ protocol: "https", hostname: supabaseHost, pathname: "/storage/v1/object/public/**" }]
      : [],
  },
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
