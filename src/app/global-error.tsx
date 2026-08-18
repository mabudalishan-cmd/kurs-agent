"use client";

import { useEffect } from "react";

export default function GlobalError({
  error,
  unstable_retry,
}: {
  error: Error & { digest?: string };
  unstable_retry: () => void;
}) {
  useEffect(() => {
    console.error("Global error:", error);
  }, [error]);

  return (
    <html lang="az">
      <body className="min-h-screen flex items-center justify-center bg-[var(--background)] p-4">
        <div className="mx-auto max-w-md text-center">
          <div className="mx-auto mb-8 flex h-20 w-20 items-center justify-center rounded-2xl border border-red-500/30 bg-red-500/10 text-red-500">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="40"
              height="40"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="8" x2="12" y2="12" />
              <line x1="12" y1="16" x2="12.01" y2="16" />
            </svg>
          </div>

          <h1 className="text-3xl font-bold">Xəta baş verdi</h1>
          <p className="mt-4 text-[var(--muted)]">
            Gözlənilməz xəta baş verdi. Zəhmət olmasa bir az sonra yenidən
            cəhd edin.
          </p>

          {error.digest && (
            <p className="mt-2 text-xs text-[var(--muted)]">
              Error ID: {error.digest}
            </p>
          )}

          <button
            onClick={() => unstable_retry()}
            className="mt-8 inline-flex items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-violet-600 to-blue-600 px-6 py-3 text-sm font-semibold text-white transition-all hover:shadow-lg hover:shadow-violet-500/25"
          >
            Yenidən cəhd et
          </button>
        </div>
      </body>
    </html>
  );
}