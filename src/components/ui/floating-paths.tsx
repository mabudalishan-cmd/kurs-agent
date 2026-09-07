"use client";

import * as React from "react";

import { cn } from "@/lib/utils";

/**
 * Yolların sayı.
 *
 * Orijinalda 36 idi. Hər yol ayrıca animasiya olunduğu üçün bu, bloq
 * səhifəsində gözlə görünən donma yaradırdı — say azaldılıb.
 */
const PATH_COUNT = 18;

export type FloatingPathsBackgroundProps = {
  /** Əyrilərin üfüqi sürüşməsi və istiqaməti (mənfi dəyər əksinə çevirir). */
  position: number;
  /**
   * Xətlərin ümumi görünmə gücü.
   * Arxa fon kimi işlədildiyi üçün default zəifdir — orijinalda sonuncu
   * xətlərin şəffaflığı 1-i keçirdi və mətnin oxunmasına mane olurdu.
   */
  intensity?: number;
  className?: string;
  children?: React.ReactNode;
};

/**
 * Yavaş axan əyri xətlərdən ibarət dekorativ arxa fon.
 *
 * Orijinal komponentdən fərqlər:
 *
 *  1. Animasiya framer-motion yerinə CSS-dədir. Orijinalda hər yolun
 *     `pathLength`/`pathOffset` dəyəri JS ilə, əsas axında, hər kadr üçün
 *     hesablanırdı — 36 yol × 60 kadr saniyədə. Bu, səhifəyə keçəndə
 *     donmaya səbəb olurdu. CSS `stroke-dashoffset` animasiyasını brauzer
 *     özü aparır. (Layihə qaydası: keyframe-lər `globals.css`-dədir.)
 *
 *  2. `opacity: [0.3, 0.6, 0.3]` nəbzi silindi — 36 xəttin fərqli
 *     sürətlə işıqlanması "yanıb-sönmə" effekti verirdi.
 *
 *  3. Yolların sayı 36 → 18.
 *
 *  4. `motion/react` yerinə heç bir animasiya kitabxanası işlədilmir —
 *     `motion` paketi eyni framer-motion-dur, ikisini saxlamaq bundle-a
 *     runtime-ın ikinci nüsxəsini əlavə edərdi.
 *
 *  5. İstifadə olunmayan `color` sahəsi silindi (SVG `currentColor` işlədir).
 */
export function FloatingPathsBackground({
  position,
  intensity = 0.35,
  className,
  children,
}: FloatingPathsBackgroundProps) {
  const paths = React.useMemo(
    () =>
      Array.from({ length: PATH_COUNT }, (_, index) => {
        // Orijinal həndəsə 36 yol üçün qurulmuşdu — say azaldığı üçün
        // addımı iki misli edirik ki, kompozisiya eyni qalsın.
        const i = index * 2;
        return {
          id: index,
          d: `M-${380 - i * 5 * position} -${189 + i * 6}C-${
            380 - i * 5 * position
          } -${189 + i * 6} -${312 - i * 5 * position} ${216 - i * 6} ${
            152 - i * 5 * position
          } ${343 - i * 6}C${616 - i * 5 * position} ${470 - i * 6} ${
            684 - i * 5 * position
          } ${875 - i * 6} ${684 - i * 5 * position} ${875 - i * 6}`,
          width: 0.5 + i * 0.03,
          opacity: (0.1 + i * 0.03) * intensity,
          // Sabit, lakin qeyri-bərabər — `Math.random()` render zamanı
          // çağırılsaydı, hər yenidən render animasiyanı sıfırlayardı.
          duration: 24 + ((index * 7) % 12),
          delay: (index * 3) % 11,
        };
      }),
    [position, intensity]
  );

  return (
    <div className={cn("relative w-full", className)}>
      <div className="pointer-events-none absolute inset-0" aria-hidden="true">
        <svg
          className="h-full w-full text-slate-950 dark:text-white"
          viewBox="0 0 696 316"
          /*
           * `none` — şəkil konteynerin ölçüsünə tam uyğunlaşır.
           * `slice` uyğun deyil: viewBox nisbəti 2.2 (geniş və alçaq),
           * səhifə konteyneri isə hündürdür — `slice` şəkli 3-4 dəfə
           * yaxınlaşdırırdı. Default `meet` isə boş zolaq buraxır.
           */
          preserveAspectRatio="none"
          fill="none"
        >
          {paths.map((path) => (
            <path
              key={path.id}
              className="floating-path"
              d={path.d}
              stroke="currentColor"
              strokeWidth={path.width}
              strokeOpacity={path.opacity}
              /* Oxlar fərqli əmsalla uzandığı üçün xəttin qalınlığı
                 təhrif olunardı — bu, onu sabit saxlayır. */
              vectorEffect="non-scaling-stroke"
              style={{
                animationDuration: `${path.duration}s`,
                animationDelay: `-${path.delay}s`,
              }}
            />
          ))}
        </svg>
      </div>

      {children}
    </div>
  );
}

export default FloatingPathsBackground;
