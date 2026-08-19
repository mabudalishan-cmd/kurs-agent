"use client";

import { useCallback, useEffect, useRef } from "react";
import { useTheme } from "next-themes";
import type { Application } from "@splinetool/runtime";

import { SplineScene } from "@/components/ui/spline";

export function SplineDemo() {
  const { resolvedTheme } = useTheme();
  const appRef = useRef<Application | null>(null);

  /**
   * Səhnənin öz fonu tünd-boz idi və saytın rənglərinə uymurdu.
   * Fonu saytın `--background` dəyişənindən götürürük ki, bölmə
   * səhifənin qalan hissəsi ilə birləşsin və temaya uyğunlaşsın.
   */
  const applyBackground = useCallback(() => {
    const app = appRef.current;
    if (!app) return;

    const background = getComputedStyle(document.documentElement)
      .getPropertyValue("--background")
      .trim();

    if (background) app.setBackgroundColor(background);
  }, []);

  // Tema dəyişəndə fonu yenidən təyin et.
  useEffect(() => {
    applyBackground();
  }, [resolvedTheme, applyBackground]);

  const handleLoad = useCallback(
    (app: Application) => {
      appRef.current = app;
      applyBackground();
    },
    [applyBackground]
  );

  return (
    <div className="relative h-[600px] w-full overflow-hidden bg-[var(--background)] md:h-[700px]">
      {/* Robotun arxasında yumşaq işıq — fon ilə eyni rəngdə olduğu üçün
          robotun konturu itməsin deyə ona ayrıca dərinlik verir */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-0"
        style={{
          background:
            "radial-gradient(60% 55% at 62% 50%, color-mix(in srgb, var(--accent) 18%, transparent), transparent 70%)",
        }}
      />

      {/* 3D səhnə — mouse hadisələri kanvasa çatsın deyə pointer events açıqdır */}
      <div className="absolute inset-0 z-[1] h-full w-full">
        <SplineScene
          className="h-full w-full"
          scene="https://prod.spline.design/kZDDjO5HuC9GJUM2/scene.splinecode"
          onLoad={handleLoad}
        />
      </div>

      {/* Başlığın oxunaqlı qalması üçün YALNIZ sol tərəfdə keçid.
          Bütün eni tutmamalıdır — əks halda robotun üstünə pərdə düşür. */}
      <div className="pointer-events-none absolute inset-y-0 left-0 z-[5] w-full bg-gradient-to-r from-[var(--background)] from-5% via-[var(--background)]/45 via-25% to-transparent to-50% md:w-3/5" />

      {/* Mətn qatı — pointer-events-none ki, siçan kanvasa çatsın */}
      <div className="pointer-events-none relative z-10 flex h-full max-w-2xl flex-col justify-center p-8 md:p-16">
        <h1 className="text-4xl font-bold text-[var(--foreground)] md:text-5xl lg:text-6xl">
          Gələcəyin Texnologiyasını Öyrən
        </h1>
        <p className="mt-6 max-w-lg text-lg text-[var(--muted)] md:text-xl">
          Müasir proqramlaşdırma kurslarımızla gələcəyin texnologiyalarını
          mənimsə. Praktiki layihələr və peşəkar müəllimlərlə real nəticələr
          əldə et.
        </p>
      </div>
    </div>
  );
}
