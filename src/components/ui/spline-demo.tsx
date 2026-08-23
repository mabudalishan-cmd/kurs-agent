"use client";

import { useCallback, useRef } from "react";
import type { Application } from "@splinetool/runtime";

import { SplineScene } from "@/components/ui/spline";
import { GridVignetteBackground } from "@/components/ui/vignette-grid-background";

/**
 * Hero bölməsindəki grid ilə eyni ölçü və rəng — bu bölmə ayrıca blok
 * olduğu üçün səhifənin öz GridBackground-u bura çatmır, ona görə grid
 * burada təkrar çəkilir ki, xətlər kəsilmədən davam etsin.
 */
const GRID_SIZE = 44;

/**
 * Kanvasın alt kənarındakı yumşaq keçid.
 * Ayaqlar ~%72-dən sonra tədricən əriyir; iki aralıq dayaq (%88 / %96)
 * keçidi xətti deyil, daha təbii edir — tək dayaqla sərhəd nəzərə çarpır.
 */
const FADE_MASK =
  "linear-gradient(to bottom, #000 72%, rgba(0,0,0,0.65) 88%, rgba(0,0,0,0.2) 96%, transparent 100%)";

export function SplineDemo() {
  const appRef = useRef<Application | null>(null);

  /**
   * Səhnənin öz fonu tünd-boz solid rəng idi və arxadakı grid-i örtürdü.
   * Fonu şəffaf edirik ki, kanvasın altındakı grid və işıq görünsün.
   */
  const handleLoad = useCallback((app: Application) => {
    appRef.current = app;
    app.setBackgroundColor("transparent");
  }, []);

  return (
    <div className="relative h-[600px] w-full overflow-hidden md:h-[700px]">
      {/* Grid — hero bölməsindəki naxışın davamı.
          Kənar boşluq 44px-in tam qatıdır: sürüşmə üçün yer verir, eyni
          zamanda xətlərin fazasını pozmur (48px olsaydı 4px sürüşərdi). */}
      <GridVignetteBackground
        className="-inset-[44px] z-0 opacity-100"
        size={GRID_SIZE}
        lineColor="var(--grid-line)"
        horizontalVignetteSize={70}
        verticalVignetteSize={80}
        intensity={45}
        style={{ animation: "grid-drift 60s linear infinite" }}
      />

      {/* Robotun arxasında yumşaq işıq — konturu itməsin deyə */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-0"
        style={{
          background:
            "radial-gradient(60% 55% at 62% 50%, color-mix(in srgb, var(--accent) 16%, transparent), transparent 70%)",
        }}
      />

      {/* 3D səhnə — mouse hadisələri kanvasa çatsın deyə pointer events açıqdır.
          Alt kənarda maska: robotun ayaqları kanvasın sərhədində kəskin
          kəsilirdi, maska onu yumşaq şəkildə əridir. Rəngli örtük yox,
          məhz maska istifadə olunur — örtük yalnız fonla eyni rəngdə
          işləyər və arxadakı grid-i də gizlədərdi; maska isə şəffaflıq
          yaratdığı üçün grid təmiz qalır və hər iki temada düzgün işləyir. */}
      <div
        className="absolute inset-0 z-[1] h-full w-full"
        style={{
          WebkitMaskImage: FADE_MASK,
          maskImage: FADE_MASK,
        }}
      >
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
