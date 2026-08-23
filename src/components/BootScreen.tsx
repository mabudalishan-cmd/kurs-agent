"use client";

import { useEffect, useState } from "react";

export default function BootScreen() {
  const [done, setDone] = useState(false);

  useEffect(() => {
    // Hərəkəti azaltmaq istəyən istifadəçilər üçün ekranı dərhal keçirik.
    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    // CSS animasiyası 4.3s-də sönməyə başlayır və 4.6s-də bitir —
    // komponenti ondan sonra söndürürük ki, kəsilmə görünməsin.
    const timer = setTimeout(() => setDone(true), reduceMotion ? 0 : 4800);
    return () => clearTimeout(timer);
  }, []);

  if (done) return null;

  return (
    <div className="boot-screen" aria-hidden="true">
      <div className="boot-left" />
      <div className="boot-right" />
      <div className="boot-content">
        <span className="boot-symbol boot-symbol-left">{"<"}</span>
        <span className="boot-text">HelloWorld</span>
        <span className="boot-symbol boot-symbol-right">{">"}</span>
      </div>
    </div>
  );
}