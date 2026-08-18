"use client";

import { SplineScene } from "@/components/ui/spline";

export function SplineDemo() {
  return (
    <div className="relative h-[600px] w-full overflow-hidden bg-transparent md:h-[700px]">
      {/* 3D Background — full-section canvas (pointer events enabled for interaction) */}
      <div className="absolute inset-0 z-0 h-full w-full">
        <SplineScene
          className="h-full w-full"
          scene="https://prod.spline.design/kZDDjO5HuC9GJUM2/scene.splinecode"
        />
      </div>

      {/* Readability gradient overlay (left-side darkening for text contrast) */}
      <div className="pointer-events-none absolute inset-0 z-[5] bg-gradient-to-r from-black/60 via-black/30 to-transparent" />

      {/* Text Overlay — pointer-events-none so mouse events reach the canvas */}
      <div className="pointer-events-none relative z-10 flex h-full max-w-2xl flex-col justify-center p-8 md:p-16">
        <h1 className="text-4xl font-bold text-white drop-shadow-lg md:text-5xl lg:text-6xl">
          Gələcəyin Texnologiyasını Öyrən
        </h1>
        <p className="mt-6 max-w-lg text-lg text-neutral-200 drop-shadow-md md:text-xl">
          Müasir proqramlaşdırma kurslarımızla gələcəyin
          texnologiyalarını mənimsə. Praktiki layihələr və peşəkar
          müəllimlərlə real nəticələr əldə et.
        </p>
      </div>
    </div>
  );
}