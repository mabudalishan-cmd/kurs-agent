/**
 * Sosial şəbəkə ikonları.
 *
 * lucide-react v1 brend ikonlarını (Facebook, Instagram, LinkedIn, ...)
 * ticarət nişanı səbəbilə paketdən çıxarıb, ona görə burada saxlanılır.
 * Facebook / Instagram / LinkedIn xətt (stroke) üslubundadır ki, saytın
 * qalan lucide ikonları ilə eyni görünsün; TikTok qlifi xətt şəklində
 * oxunaqlı olmadığı üçün doldurulmuş (fill) verilir.
 */

type IconProps = {
  size?: number;
  className?: string;
};

const strokeProps = {
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 2,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
};

export function FacebookIcon({ size = 18, className }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      className={className}
      aria-hidden="true"
      {...strokeProps}
    >
      <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
    </svg>
  );
}

export function InstagramIcon({ size = 18, className }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      className={className}
      aria-hidden="true"
      {...strokeProps}
    >
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
    </svg>
  );
}

export function LinkedinIcon({ size = 18, className }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      className={className}
      aria-hidden="true"
      {...strokeProps}
    >
      <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-4 0v7h-4v-7a6 6 0 0 1 6-6z" />
      <rect x="2" y="9" width="4" height="12" />
      <circle cx="4" cy="4" r="2" />
    </svg>
  );
}

export function TiktokIcon({ size = 18, className }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      className={className}
      aria-hidden="true"
      fill="currentColor"
      stroke="none"
    >
      <path d="M12.53 2h3.16a4.83 4.83 0 0 0 4.31 4.31v3.16a7.94 7.94 0 0 1-4.31-1.35v6.14a5.86 5.86 0 1 1-5.86-5.86c.3 0 .6.02.89.07v3.24a2.7 2.7 0 1 0 1.81 2.55V2z" />
    </svg>
  );
}
