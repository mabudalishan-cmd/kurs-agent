"use client";

import * as React from "react";
import { motion, useReducedMotion } from "framer-motion";

import { cn } from "@/lib/utils";

const PATH_COUNT = 36;

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
 *  - `motion/react` yerinə `framer-motion` — eyni kitabxananın köhnə adıdır
 *    və layihədə onsuz da var; `motion` paketini əlavə etsək, bundle-a
 *    animasiya runtime-ının ikinci nüsxəsi düşərdi.
 *  - Yollar `useMemo` ilə hesablanır: `Math.random()` render zamanı
 *    çağırılırdı, yəni hər yenidən render animasiyanı sıfırdan başladırdı.
 *  - İstifadə olunmayan `color` sahəsi silindi (SVG `currentColor` işlədir).
 *  - `prefers-reduced-motion` seçilibsə xətlər hərəkətsiz göstərilir.
 */
export function FloatingPathsBackground({
  position,
  intensity = 0.35,
  className,
  children,
}: FloatingPathsBackgroundProps) {
  const reduceMotion = useReducedMotion();

  const paths = React.useMemo(
    () =>
      Array.from({ length: PATH_COUNT }, (_, i) => ({
        id: i,
        d: `M-${380 - i * 5 * position} -${189 + i * 6}C-${
          380 - i * 5 * position
        } -${189 + i * 6} -${312 - i * 5 * position} ${216 - i * 6} ${
          152 - i * 5 * position
        } ${343 - i * 6}C${616 - i * 5 * position} ${470 - i * 6} ${
          684 - i * 5 * position
        } ${875 - i * 6} ${684 - i * 5 * position} ${875 - i * 6}`,
        width: 0.5 + i * 0.03,
        opacity: (0.1 + i * 0.03) * intensity,
        // Sabit, lakin qeyri-bərabər müddət — hər render-də dəyişməsin deyə
        // `Math.random()` yerinə indeksdən törədilir.
        duration: 20 + ((i * 7) % 10),
      })),
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
           *
           * `slice` uyğun deyil: viewBox nisbəti 2.2 (geniş və alçaq),
           * səhifə konteyneri isə hündürdür (~0.9). `slice` örtmək üçün
           * böyük əmsalı seçir və şəkli 3-4 dəfə yaxınlaşdırır — incə
           * xətlər əvəzinə bir neçə nəhəng ləkə görünür.
           * Default `meet` isə əksinə, aşağıda və yuxarıda boş zolaq buraxır.
           *
           * Xətlər dekorativ və mücərrəd olduğu üçün uzanma nəzərə çarpmır.
           */
          preserveAspectRatio="none"
          fill="none"
        >
          {paths.map((path) => (
            <motion.path
              key={path.id}
              d={path.d}
              stroke="currentColor"
              strokeWidth={path.width}
              strokeOpacity={path.opacity}
              /* `preserveAspectRatio="none"` oxları fərqli miqyasla
                 uzatdığı üçün xəttin qalınlığı da təhrif olunardı —
                 bu, qalınlığı sabit saxlayır. */
              vectorEffect="non-scaling-stroke"
              initial={{ pathLength: 0.3, opacity: 0.6 }}
              animate={
                reduceMotion
                  ? { pathLength: 1, opacity: 0.5 }
                  : {
                      pathLength: 1,
                      opacity: [0.3, 0.6, 0.3],
                      pathOffset: [0, 1, 0],
                    }
              }
              transition={
                reduceMotion
                  ? { duration: 0 }
                  : {
                      duration: path.duration,
                      repeat: Number.POSITIVE_INFINITY,
                      ease: "linear",
                    }
              }
            />
          ))}
        </svg>
      </div>

      {children}
    </div>
  );
}

export default FloatingPathsBackground;
