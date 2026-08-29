"use client";

import * as React from "react";

import { cn } from "@/lib/utils";

export type ParticleDriftProps = {
  /** Zərrəciklərin sıxlığı (1 = standart). */
  density?: number;
  /** Hərəkət sürəti (1 = standart). */
  speed?: number;
  /** Ümumi şəffaflıq. */
  opacity?: number;
  className?: string;
};

type Node = { x: number; y: number; vy: number; char: string };
type Beam = { x: number; y: number; length: number; speed: number; alpha: number };

const CHARS = "0123456789ABCDEF#$%&*<>{}[]".split("");
const LINK_DISTANCE = 120;
const MOUSE_DISTANCE = 170;

/** CSS dəyişənindən rəngi oxuyur (tema dəyişəndə yenidən çağırılır). */
function readVar(name: string, fallback: string) {
  if (typeof document === "undefined") return fallback;
  const v = getComputedStyle(document.documentElement)
    .getPropertyValue(name)
    .trim();
  return v || fallback;
}

/**
 * ASCII zərrəcik sahəsi — aşağı süzülən simvollar, bir-birinə bağlanan
 * xətlər və yuxarı qalxan şüalar.
 *
 * Orijinal komponent bu effekti `srcDoc` iframe-i içində Tailwind CDN,
 * GSAP və Iconify yükləyərək qururdu. Burada native canvas kimi yazılıb:
 *  - `srcdoc` iframe valideynin CSP-sini miras alır, həmin CDN-lər
 *    bloklanır və fon boş qalırdı
 *  - iframe fon kimi işlənəndə `pointer-events: none` lazımdır, bu da
 *    siçan interaktivliyini söndürür — native canvas-da işləyir
 *  - yarım meqabayt xarici asılılıq əvəzinə bir neçə kilobayt kod
 */
export function ParticleDrift({
  density = 1,
  speed = 1,
  opacity = 1,
  className,
}: ParticleDriftProps) {
  const canvasRef = React.useRef<HTMLCanvasElement>(null);

  React.useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    let width = 0;
    let height = 0;
    let nodes: Node[] = [];
    let beams: Beam[] = [];
    let frame = 0;
    const mouse = { x: -9999, y: -9999 };

    // Rənglər temadan gəlir; tema dəyişəndə yenilənir.
    let accent = readVar("--accent", "#8b5cf6");
    let muted = readVar("--muted", "#64748b");

    const themeObserver = new MutationObserver(() => {
      accent = readVar("--accent", "#8b5cf6");
      muted = readVar("--muted", "#64748b");
    });
    themeObserver.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });

    function seed() {
      const area = width * height;
      const nodeCount = Math.min(
        90,
        Math.max(12, Math.round((area / 18000) * density))
      );
      const beamCount = Math.max(4, Math.round(nodeCount / 4));

      nodes = Array.from({ length: nodeCount }, () => ({
        x: Math.random() * width,
        y: Math.random() * height,
        vy: Math.random() * 0.4 + 0.1,
        char: CHARS[Math.floor(Math.random() * CHARS.length)],
      }));

      beams = Array.from({ length: beamCount }, () => ({
        x: Math.random() * width,
        y: Math.random() * height,
        length: Math.random() * 100 + 50,
        speed: Math.random() * 6 + 3,
        alpha: Math.random() * 0.4 + 0.2,
      }));
    }

    /**
     * Ölçü dəyişməyibsə heç nə etmirik.
     *
     * Bu yoxlama vacibdir: `canvas.width` təyin etmək ResizeObserver-i
     * yenidən işə sala bilir və sonsuz döngə yaranır — əsas axın kilidlənir,
     * React hidrasiyanı bitirə bilmir və səhifə gizli qalır.
     */
    function resize() {
      const rect = canvas!.getBoundingClientRect();
      if (rect.width === width && rect.height === height) return;

      width = rect.width;
      height = rect.height;
      if (width < 1 || height < 1) return;

      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas!.width = Math.round(width * dpr);
      canvas!.height = Math.round(height * dpr);
      ctx!.setTransform(dpr, 0, 0, dpr, 0, 0);
      seed();
    }

    function draw() {
      if (width < 1 || height < 1) {
        frame = requestAnimationFrame(draw);
        return;
      }
      ctx!.clearRect(0, 0, width, height);

      // Yuxarı qalxan şüalar
      for (const b of beams) {
        b.y -= b.speed * speed;
        if (b.y + b.length < 0) {
          b.y = height + 100;
          b.x = Math.random() * width;
        }
        const g = ctx!.createLinearGradient(b.x, b.y, b.x, b.y + b.length);
        g.addColorStop(0, accent);
        g.addColorStop(1, "transparent");
        ctx!.globalAlpha = b.alpha * opacity;
        ctx!.strokeStyle = g;
        ctx!.lineWidth = 1.2;
        ctx!.beginPath();
        ctx!.moveTo(b.x, b.y);
        ctx!.lineTo(b.x, b.y + b.length);
        ctx!.stroke();
      }

      // Yaxın qovşaqları birləşdirən xətlər
      ctx!.lineWidth = 0.5;
      ctx!.strokeStyle = muted;
      for (let i = 0; i < nodes.length; i++) {
        const a = nodes[i];
        for (let j = i + 1; j < nodes.length; j++) {
          const b = nodes[j];
          const d = Math.hypot(a.x - b.x, a.y - b.y);
          if (d < LINK_DISTANCE) {
            ctx!.globalAlpha = 0.16 * (1 - d / LINK_DISTANCE) * opacity;
            ctx!.beginPath();
            ctx!.moveTo(a.x, a.y);
            ctx!.lineTo(b.x, b.y);
            ctx!.stroke();
          }
        }
      }

      // Simvollar
      ctx!.font = "12px var(--font-geist-mono), monospace";
      ctx!.textAlign = "center";
      ctx!.textBaseline = "middle";

      for (const n of nodes) {
        n.y += n.vy * speed;
        if (n.y > height + 20) {
          n.y = -20;
          n.x = Math.random() * width;
        }

        const dist = Math.hypot(mouse.x - n.x, mouse.y - n.y);
        const near = dist < MOUSE_DISTANCE;

        // Kursor yaxınlaşanda simvol dəyişir
        if (near && Math.random() > 0.9) {
          n.char = CHARS[Math.floor(Math.random() * CHARS.length)];
        }

        if (near) {
          ctx!.globalAlpha = 0.45 * (1 - dist / MOUSE_DISTANCE) * opacity;
          ctx!.strokeStyle = accent;
          ctx!.lineWidth = 0.6;
          ctx!.beginPath();
          ctx!.moveTo(n.x, n.y);
          ctx!.lineTo(mouse.x, mouse.y);
          ctx!.stroke();
        }

        ctx!.globalAlpha = (near ? 0.9 : 0.35) * opacity;
        ctx!.fillStyle = near ? accent : muted;
        ctx!.fillText(n.char, n.x, n.y);
      }

      ctx!.globalAlpha = 1;
      frame = requestAnimationFrame(draw);
    }

    function onPointerMove(e: PointerEvent) {
      const rect = canvas!.getBoundingClientRect();
      mouse.x = e.clientX - rect.left;
      mouse.y = e.clientY - rect.top;
    }

    // Səhifə görünmürsə animasiyanı dayandırırıq — batareya və CPU üçün.
    function onVisibility() {
      cancelAnimationFrame(frame);
      if (!document.hidden && !reduceMotion) frame = requestAnimationFrame(draw);
    }

    const observer = new ResizeObserver(resize);
    observer.observe(canvas);

    resize();
    window.addEventListener("pointermove", onPointerMove, { passive: true });
    document.addEventListener("visibilitychange", onVisibility);

    if (reduceMotion) {
      // Hərəkətsiz tək kadr
      draw();
      cancelAnimationFrame(frame);
    } else {
      frame = requestAnimationFrame(draw);
    }

    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
      themeObserver.disconnect();
      window.removeEventListener("pointermove", onPointerMove);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, [density, speed, opacity]);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className={cn(
        "pointer-events-none absolute inset-0 h-full w-full",
        className
      )}
    />
  );
}

export default ParticleDrift;
