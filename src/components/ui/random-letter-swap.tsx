"use client";

import * as React from "react";

import { cn } from "@/lib/utils";

export type RandomLetterSwapProps = {
  label: string;
  className?: string;
  /** Hərflər arasındakı gecikmə əmsalı (saniyə). */
  staggerDuration?: number;
  /** Bir hərfin dəyişmə müddəti (saniyə). */
  duration?: number;
};

/**
 * Hərflərin təsadüfi sıra ilə "dəyişdiyi" hover effekti.
 *
 * Hər hərfin iki nüsxəsi var: görünən və altda gizlənən. Hover zamanı
 * ikisi də yuxarı sürüşür, altdakı nüsxə yerini tutur.
 *
 * Framer-motion yerine saf CSS istifadə olunur — `y: "100%"` kimi faiz
 * dəyərləri bu quruluşda tətbiq olunmurdu (transform: none qalırdı).
 * CSS həm də daha ucuzdur: hover state React-ə çatmır, yenidən render yoxdur.
 *
 * Gecikmələr `Math.random()` ilə deyil, hərfin kodundan törədilir ki,
 * serverdə və brauzerdə eyni dəyər alınsın.
 */
export function RandomLetterSwap({
  label,
  className,
  staggerDuration = 0.03,
  duration = 0.4,
}: RandomLetterSwapProps) {
  const chars = React.useMemo(() => Array.from(label), [label]);

  const delays = React.useMemo(
    () =>
      chars.map((ch, i) => {
        const seed = (ch.charCodeAt(0) * 9301 + i * 49297) % 233280;
        return (seed / 233280) * staggerDuration * chars.length;
      }),
    [chars, staggerDuration]
  );

  return (
    <span className={cn("letter-swap inline-block", className)}>
      {/* Ekran oxuyucular sözü bütöv oxusun deyə */}
      <span className="sr-only">{label}</span>

      <span aria-hidden="true" className="inline-flex leading-none">
        {chars.map((ch, i) => {
          const char = ch === " " ? " " : ch;
          const style = {
            transitionDelay: `${delays[i]}s`,
            transitionDuration: `${duration}s`,
          };

          return (
            <span key={`${ch}-${i}`} className="letter-swap__slot">
              <span className="letter-swap__char" style={style}>
                {char}
              </span>
              <span
                className="letter-swap__char letter-swap__char--next"
                style={style}
              >
                {char}
              </span>
            </span>
          );
        })}
      </span>
    </span>
  );
}

export default RandomLetterSwap;
