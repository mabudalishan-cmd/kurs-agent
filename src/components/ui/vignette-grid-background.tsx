import * as React from "react";

import { cn } from "@/lib/utils";

interface GridVignetteBackgroundProps {
  /** Grid hüceyrəsinin ölçüsü (px). */
  size?: number;
  /** Vinyet mərkəzinin üfüqi mövqeyi (%). */
  x?: number;
  /** Vinyet mərkəzinin şaquli mövqeyi (%). */
  y?: number;
  horizontalVignetteSize?: number;
  verticalVignetteSize?: number;
  /** 0 = kənarlar kəsilmir, 100 = mərkəzdən tam sönür. */
  intensity?: number;
  /** Xəttin rəngi — saytın grid-i ilə eyni olsun deyə dəyişdirilə bilir. */
  lineColor?: string;
}

/**
 * Vinyet maskası ilə grid arxa fonu.
 *
 * Orijinal komponentdən üç fərq:
 *  1. `fixed z-[-1]` yerinə `absolute inset-0` — bu layihədə fon bütün
 *     səhifəyə deyil, ayrıca bölməyə tətbiq olunur. Mövqe/z sinifləri
 *     `className` ilə üstələnə bilər (twMerge onları düzgün əvəzləyir).
 *  2. `pointer-events-none` əlavə edildi — əks halda təbəqə altındakı
 *     Spline kanvasının siçan hadisələrini kəsir.
 *  3. Xəttin rəngi `lineColor` prop-u ilə verilir; default olaraq
 *     `--muted-foreground` qalır.
 */
export function GridVignetteBackground({
  className,
  size = 48,
  x = 50,
  y = 50,
  horizontalVignetteSize = 100,
  verticalVignetteSize = 100,
  intensity = 0,
  lineColor = "var(--muted-foreground)",
  style,
  ...props
}: React.ComponentProps<"div"> & GridVignetteBackgroundProps) {
  const mask = `radial-gradient(ellipse ${horizontalVignetteSize}% ${verticalVignetteSize}% at ${x}% ${y}%, black ${
    100 - intensity
  }%, transparent 100%)`;

  return (
    <div
      aria-hidden="true"
      className={cn("pointer-events-none absolute inset-0 opacity-50", className)}
      style={{
        backgroundImage: `linear-gradient(to right, ${lineColor}, transparent 1px), linear-gradient(to bottom, ${lineColor}, transparent 1px)`,
        backgroundSize: `${size}px ${size}px`,
        WebkitMaskImage: mask,
        maskImage: mask,
        ...style,
      }}
      {...props}
    />
  );
}

export default GridVignetteBackground;
