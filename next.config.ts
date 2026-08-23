import type { NextConfig } from "next";

/**
 * Content Security Policy.
 *
 * Qeydlər:
 * - `'unsafe-inline'` (script) Next.js-in hidrasiya skriptləri və
 *   next-themes-in flash-ın qarşısını alan inline skripti üçün lazımdır.
 * - `'wasm-unsafe-eval'` Spline 3D səhnəsinin WASM runtime-ı üçündür.
 * - dev rejimində Turbopack `eval` istifadə etdiyi üçün `'unsafe-eval'`
 *   yalnız orada əlavə olunur; produksiyada verilmir.
 */
const isDev = process.env.NODE_ENV === "development";

const csp = [
  "default-src 'self'",
  `script-src 'self' 'unsafe-inline' 'wasm-unsafe-eval'${isDev ? " 'unsafe-eval'" : ""} https://prod.spline.design https://unpkg.com`,
  "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
  "font-src 'self' data: https://fonts.gstatic.com",
  "img-src 'self' data: blob: https:",
  "media-src 'self' data: blob: https:",
  // Supabase (REST + realtime), Spline səhnə faylları.
  // unpkg.com Spline-ın WASM modulunu (modelling-wasm) fetch ilə yüklədiyi
  // üçün buradadır — yalnız script-src kifayət etmir.
  `connect-src 'self' https://*.supabase.co wss://*.supabase.co https://*.spline.design https://prod.spline.design https://unpkg.com${
    // dev-də Turbopack hot-reload üçün WebSocket
    isDev ? " ws://localhost:* http://localhost:*" : ""
  }`,
  "worker-src 'self' blob:",
  "frame-ancestors 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "object-src 'none'",
  "upgrade-insecure-requests",
].join("; ");

const securityHeaders = [
  { key: "Content-Security-Policy", value: csp },
  // Klikcacking-in qarşısını alır (CSP frame-ancestors dəstəkləməyən köhnə brauzerlər üçün)
  { key: "X-Frame-Options", value: "DENY" },
  // Brauzer MIME növünü təxmin etməsin
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  // İstifadə etmədiyimiz cihaz icazələrini bağlayırıq
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=(), interest-cohort=()",
  },
  // Yalnız HTTPS üzərindən nəzərə alınır — localhost-da brauzer onu yox sayır
  {
    key: "Strict-Transport-Security",
    value: "max-age=63072000; includeSubDomains; preload",
  },
];

const nextConfig: NextConfig = {
  devIndicators: false,
  // Cavab başlıqlarında Next.js versiyasını gizlədir
  poweredByHeader: false,
  async headers() {
    return [
      {
        source: "/:path*",
        headers: securityHeaders,
      },
    ];
  },
};

export default nextConfig;
