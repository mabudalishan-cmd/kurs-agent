"use client";

import { useCallback, useEffect, useRef } from "react";
import type { Application } from "@splinetool/runtime";

import { SplineScene } from "@/components/ui/spline";
import { GridVignetteBackground } from "@/components/ui/vignette-grid-background";
import { useLanguage } from "@/lib/i18n/LanguageContext";

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

function HeroCopy({
  title,
  description,
  className,
}: {
  title: string;
  description: string;
  className?: string;
}) {
  return (
    <div className={className}>
      {/* h2, h1 deyil: səhifənin əsas başlığı yuxarıdakı hero bölməsindədir.
          Üstəlik bu mətn iki nüsxədə render olunur (mobil/masaüstü), ikisi
          də h1 olsaydı səhifədə üç h1 alınardı. */}
      <h2 className="text-3xl font-bold text-[var(--foreground)] sm:text-4xl lg:text-6xl">
        {title}
      </h2>
      <p className="mt-4 max-w-lg text-base text-[var(--muted)] sm:text-lg lg:mt-6 lg:text-xl">
        {description}
      </p>
    </div>
  );
}

export function SplineDemo() {
  const { t } = useLanguage();
  const appRef = useRef<Application | null>(null);
  const stageRef = useRef<HTMLDivElement>(null);

  /**
   * Robot səhifənin istənilən yerindəki kursoru izləsin.
   *
   * Spline runtime siçan hadisələrini yalnız öz kanvasında dinləyir, ona
   * görə kursor kanvasdan kənara çıxanda robot donub qalır. Qlobal
   * hərəkəti kanvasa ötürürük — koordinatlar olduğu kimi verilir, Spline
   * onları öz sahəsinə nisbətdə hesablayır.
   */
  useEffect(() => {
    const stage = stageRef.current;
    if (!stage) return;

    const forward = (event: PointerEvent) => {
      const canvas = stage.querySelector("canvas");
      // Hadisə onsuz da kanvasdan gəlirsə təkrarlamırıq.
      if (!canvas || event.target === canvas) return;

      const base = {
        clientX: event.clientX,
        clientY: event.clientY,
        screenX: event.screenX,
        screenY: event.screenY,
        // `bubbles` vacibdir: Spline dinləyicilərinin bir hissəsi kanvasda
        // deyil, `ownerDocument`-də oturur.
        bubbles: true,
        cancelable: true,
        view: window,
      };

      canvas.dispatchEvent(
        new PointerEvent("pointermove", {
          ...base,
          // `isPrimary` sintetik hadisələrdə default olaraq false-dur və
          // Spline belə hadisələri nəzərə almır — açıq şəkildə veririk.
          pointerId: 1,
          pointerType: "mouse",
          isPrimary: true,
        })
      );
      canvas.dispatchEvent(new MouseEvent("mousemove", base));
    };

    window.addEventListener("pointermove", forward, { passive: true });
    return () => window.removeEventListener("pointermove", forward);
  }, []);

  /**
   * Səhnənin öz fonu tünd-boz solid rəng idi və arxadakı grid-i örtürdü.
   * Fonu şəffaf edirik ki, kanvasın altındakı grid və işıq görünsün.
   */
  const handleLoad = useCallback((app: Application) => {
    appRef.current = app;
    app.setBackgroundColor("transparent");
  }, []);

  const title = t("spline.title");
  const description = t("spline.description");

  return (
    <div className="relative w-full overflow-hidden">
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

      {/* Mobil və planşet: mətn robotdan AYRI blokdur.
          Əvvəl mətn kanvasın üstündə üst-üstə dayanırdı və robotun
          başına düşürdü. Robotun kadr daxilindəki yeri 3D səhnədən
          asılıdır — əvvəlcədən bilinmir, ona görə üst-üstə qoymaq
          etibarsızdır. Ayrı bloklarda toqquşma mümkün deyil. */}
      <HeroCopy
        title={title}
        description={description}
        className="relative z-10 px-5 pb-4 pt-10 sm:px-8 lg:hidden"
      />

      {/* Robot sahəsi */}
      <div
        ref={stageRef}
        className="relative h-[380px] w-full sm:h-[440px] lg:h-[700px]"
      >
        <div
          className="absolute inset-0 z-[1] h-full w-full"
          style={{ WebkitMaskImage: FADE_MASK, maskImage: FADE_MASK }}
        >
          <SplineScene
            className="h-full w-full"
            scene="https://prod.spline.design/kZDDjO5HuC9GJUM2/scene.splinecode"
            onLoad={handleLoad}
          />
        </div>

        {/* Masaüstündə mətn soldadır — oxunaqlı qalsın deyə soldan keçid */}
        <div className="pointer-events-none absolute inset-y-0 left-0 z-[5] hidden w-3/5 bg-gradient-to-r from-[var(--background)] from-5% via-[var(--background)]/45 via-25% to-transparent to-50% lg:block" />

        <HeroCopy
          title={title}
          description={description}
          className="pointer-events-none absolute inset-y-0 left-0 z-10 hidden max-w-2xl flex-col justify-center p-16 lg:flex"
        />
      </div>
    </div>
  );
}
