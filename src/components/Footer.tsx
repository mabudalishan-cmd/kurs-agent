import Link from "next/link";

const footerLinks = [
  { href: "/", label: "Ana Səhifə" },
  { href: "/kurslar", label: "Kurslar" },
  { href: "/haqqimizda", label: "Haqqımızda" },
  { href: "/bloq", label: "Bloq" },
  { href: "/elaqe", label: "Əlaqə" },
];

export default function Footer() {
  return (
    <footer className="border-t border-[var(--card-border)] bg-[var(--section)]">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          <div>
            <h3 className="gradient-text text-lg font-bold">KursAgent</h3>
            <p className="mt-3 max-w-xs text-sm text-[var(--muted)]">
              Azərbaycanda IT və proqramlaşdırma təhsilində müasir yanaşma.
              Sənin gələcək karyeran burada başlayır.
            </p>
          </div>

          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider text-[var(--foreground)]">
              Naviqasiya
            </h4>
            <ul className="mt-4 space-y-2">
              {footerLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-[var(--muted)] transition-colors hover:text-[var(--accent)]"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider text-[var(--foreground)]">
              Əlaqə
            </h4>
            <ul className="mt-4 space-y-2 text-sm text-[var(--muted)]">
              <li>Bakı, Azərbaycan</li>
              <li>
                <a
                  href="mailto:info@kursagent.az"
                  className="transition-colors hover:text-[var(--accent)]"
                >
                  info@kursagent.az
                </a>
              </li>
              <li>
                <a
                  href="tel:+994501234567"
                  className="transition-colors hover:text-[var(--accent)]"
                >
                  +994 50 123 45 67
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-10 border-t border-[var(--card-border)] pt-6 text-center text-sm text-[var(--muted)]">
          <p>© 2026 KursAgent. Bütün hüquqlar qorunur.</p>
        </div>
      </div>
    </footer>
  );
}