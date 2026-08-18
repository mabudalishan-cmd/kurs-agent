"use client";

import * as React from "react";

import { cn } from "@/lib/utils";

/** Kursorun mövqeyi və işığın rəngi CSS dəyişəni kimi saxlanılır. */
type GlowVars = React.CSSProperties & {
  "--glow-x"?: string;
  "--glow-y"?: string;
  "--glow-color"?: string;
};

export type CursorGlowProps = {
  style: GlowVars;
  onMouseMove: React.MouseEventHandler<HTMLElement>;
  onMouseLeave: React.MouseEventHandler<HTMLElement>;
};

/**
 * Elementin üzərində kursoru izləyən işıq effekti üçün prop-lar qaytarır.
 *
 * Dinləyici qlobal `window`-a deyil, elementin özünə bağlanır — səhifədə
 * çoxlu kart olduqda qlobal dinləyici hər siçan hərəkətində lüzumsuz
 * hesablama yaradardı.
 *
 * @example
 * <div className="group relative overflow-hidden" {...cursorGlowProps("rgba(139,92,246,0.28)")}>
 *   <CursorGlowLayer />
 * </div>
 */
export function cursorGlowProps(
  color = "rgba(139, 92, 246, 0.28)"
): CursorGlowProps {
  return {
    style: {
      "--glow-x": "50%",
      "--glow-y": "50%",
      "--glow-color": color,
    },
    onMouseMove: (event) => {
      const el = event.currentTarget;
      const rect = el.getBoundingClientRect();
      el.style.setProperty("--glow-x", `${event.clientX - rect.left}px`);
      el.style.setProperty("--glow-y", `${event.clientY - rect.top}px`);
    },
    onMouseLeave: (event) => {
      const el = event.currentTarget;
      el.style.removeProperty("--glow-x");
      el.style.removeProperty("--glow-y");
    },
  };
}

export type CursorGlowLayerProps = {
  /** İşığın ölçüsü — CSS radial-gradient ölçüsü kimi. */
  size?: string;
  /** Yalnız hover zamanı görünsün (valideyndə `group` sinfi olmalıdır). */
  hoverOnly?: boolean;
  className?: string;
};

/**
 * `cursorGlowProps` ilə işləyən işıq təbəqəsi.
 * Valideyn element `relative` (və çox halda `overflow-hidden`) olmalıdır.
 */
export function CursorGlowLayer({
  size = "260px 160px",
  hoverOnly = true,
  className,
}: CursorGlowLayerProps) {
  return (
    <span
      aria-hidden="true"
      className={cn(
        "pointer-events-none absolute inset-0 transition-opacity duration-300",
        hoverOnly ? "opacity-0 group-hover:opacity-100" : "opacity-100",
        className
      )}
      style={{
        backgroundImage: `radial-gradient(${size} at var(--glow-x) var(--glow-y), var(--glow-color), transparent 70%)`,
      }}
    />
  );
}
