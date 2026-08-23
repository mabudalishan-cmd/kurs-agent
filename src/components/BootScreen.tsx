"use client";

import { useEffect, useState } from "react";

export default function BootScreen() {
  const [done, setDone] = useState(false);

  useEffect(() => {
    // Hərəkəti azaltmaq istəyən istifadəçilər üçün ekranı dərhal keçirik.
    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    // Vaxt cədvəli: 0–0.5s giriş, 0.5–1.3s gözləmə, 1.3s çıxış,
    // 1.6s sönmə, 1.9s-də tam bitir. Komponenti ondan sonra söndürürük.
    const timer = setTimeout(() => setDone(true), reduceMotion ? 0 : 2100);
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