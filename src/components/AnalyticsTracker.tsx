"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

export default function AnalyticsTracker() {
  const pathname = usePathname();

  useEffect(() => {
    // Don't track admin pages
    if (pathname.startsWith("/admin")) return;

    // Don't track API routes
    if (pathname.startsWith("/api")) return;

    // Get or create visitor_id
    let visitorId = localStorage.getItem("visitor_id");
    if (!visitorId) {
      visitorId = crypto.randomUUID();
      localStorage.setItem("visitor_id", visitorId);
    }

    // Insert page view
    const trackView = async () => {
      try {
        await fetch("/api/track", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            page_path: pathname,
            visitor_id: visitorId,
          }),
        });
      } catch {
        // Silently fail — analytics should never break the site
      }
    };

    trackView();
  }, [pathname]);

  return null;
}