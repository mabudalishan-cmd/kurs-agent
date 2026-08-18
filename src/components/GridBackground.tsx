"use client";

/**
 * GridBackground — tünd fonun üzərində çox zəif, incə xətli grid naxışı.
 * - CSS background-image (linear-gradient) ilə kvadrat grid
 * - Mərkəzdən kənarlara doğru radial-gradient mask (fade effekti)
 * - Çox yavaş "drift" animasiyası (CSS keyframes)
 * - prefers-reduced-motion dəstəyi
 *
 * İstifadə: <GridBackground /> — absolute/fixed position ilə arxa fonda
 */
export default function GridBackground() {
  return (
    <div
      className="pointer-events-none absolute inset-0 z-0 overflow-hidden"
      aria-hidden="true"
    >
      <div className="grid-layer" />
    </div>
  );
}