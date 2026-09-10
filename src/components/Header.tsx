"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTheme } from "next-themes";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Globe } from "lucide-react";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import type { TranslationKey } from "@/lib/i18n/translations";
import MenuToggle from "./MenuToggle";
import { ThemeToggle } from "@/components/ui/curtain-theme-toggle";
import { RandomLetterSwap } from "@/components/ui/random-letter-swap";

const navLinks: { href: string; labelKey: TranslationKey }[] = [
  { href: "/", labelKey: "nav.home" },
  { href: "/kurslar", labelKey: "nav.courses" },
  { href: "/haqqimizda", labelKey: "nav.about" },
  { href: "/bloq", labelKey: "nav.blog" },
  { href: "/elaqe", labelKey: "nav.contact" },
];

export default function Header() {
  const pathname = usePathname();
  const { theme, setTheme } = useTheme();
  const { lang, toggleLang, t } = useLanguage();
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
  }, []);

  return (
    <header className="liquid-glass liquid-glass--flat sticky top-0 z-50 border-b border-[var(--card-border)]">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-2 text-xl font-bold">
          <span className="gradient-text">HelloWorld</span>
        </Link>

        {/* Desktop nav */}
        <ul className="hidden items-center gap-1 md:flex">
          {navLinks.map((link) => {
            const active = pathname === link.href;
            return (
              <li key={link.href}>
                {/* Padding link-in özündə deyil, RandomLetterSwap-dadır ki,
                    hover sahəsi bütöv olsun — effekt kənarda da işləsin. */}
                <Link href={link.href} className="block">
                  <RandomLetterSwap
                    label={t(link.labelKey)}
                    staggerDuration={0.025}
                    className={`rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                      active
                        ? "text-[var(--accent)]"
                        : "text-[var(--muted)] hover:text-[var(--foreground)]"
                    }`}
                  />
                </Link>
              </li>
            );
          })}
        </ul>

        <div className="flex items-center gap-2">
          {/* Language toggle */}
          {mounted && (
            <button
              onClick={toggleLang}
              className="flex items-center gap-1 rounded-lg border border-[var(--card-border)] px-2.5 py-2 text-xs font-semibold text-[var(--muted)] transition-colors hover:text-[var(--foreground)]"
              aria-label="Dil dəyiş"
            >
              <Globe size={16} />
              {lang === "az" ? "AZ" : "RU"}
            </button>
          )}

          {/* Theme toggle */}
          {mounted && (
            <ThemeToggle
              variant="icon"
              defaultTheme={theme === "dark" ? "dark" : "light"}
              onThemeChange={(newTheme) => setTheme(newTheme)}
            />
          )}

          <Link
            href="/kurslar"
            className="hidden rounded-lg bg-gradient-to-r from-violet-600 to-blue-600 px-4 py-2 text-sm font-semibold text-white transition-opacity hover:opacity-90 md:inline-block"
          >
            {t("nav.start")}
          </Link>

          {/* Mobile toggle */}
          <MenuToggle isOpen={open} onClick={() => setOpen(!open)} />
        </div>
      </nav>

      {/* Mobile menu drawer */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="overflow-hidden border-t border-[var(--card-border)] bg-[var(--background)] md:hidden"
          >
            <ul className="space-y-1 px-4 py-4">
              {navLinks.map((link, i) => {
                const active = pathname === link.href;
                return (
                  <motion.li
                    key={link.href}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.05 }}
                  >
                    <Link
                      href={link.href}
                      onClick={() => setOpen(false)}
                      className={`block rounded-lg px-3 py-2.5 text-base font-medium transition-colors ${
                        active
                          ? "bg-violet-500/10 text-[var(--accent)]"
                          : "text-[var(--muted)] hover:bg-violet-500/5 hover:text-[var(--foreground)]"
                      }`}
                    >
                      {t(link.labelKey)}
                    </Link>
                  </motion.li>
                );
              })}
              <motion.li
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: navLinks.length * 0.05 }}
                className="pt-2"
              >
                <Link
                  href="/kurslar"
                  onClick={() => setOpen(false)}
                  className="block rounded-lg bg-gradient-to-r from-violet-600 to-blue-600 px-3 py-2.5 text-center text-base font-semibold text-white"
                >
                  {t("nav.start")}
                </Link>
              </motion.li>
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}