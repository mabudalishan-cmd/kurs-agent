"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Compass, Terminal } from "lucide-react";

import { useLanguage } from "@/lib/i18n/LanguageContext";

/** Bir sətir terminal çıxışı. */
type Line = {
  text: string;
  /** `$` işarəsi ilə başlayan əmr sətri. */
  command?: boolean;
  tone?: "error" | "ok" | "muted";
};

const TYPE_SPEED_MS = 14;
const CHARS_PER_TICK = 2;

export default function NotFound() {
  const { t } = useLanguage();
  const pathname = usePathname();

  // Ziyarətçinin yazdığı ünvanı göstəririk — səhvi özü görsün deyə.
  const attempted = pathname && pathname !== "/" ? pathname : "/naməlum";

  const lines: Line[] = useMemo(
    () => [
      { text: `cd .${attempted}`, command: true },
      {
        text: `bash: cd: .${attempted}: No such file or directory`,
        tone: "error",
      },
      { text: "status --explain", command: true },
      { text: `404 — ${t("notFound.terminalStatus")}`, tone: "error" },
      { text: "ls /", command: true },
      { text: t("notFound.terminalHint"), tone: "muted" },
      { text: "ana-sehife   kurslar   haqqimizda   bloq   elaqe", tone: "ok" },
    ],
    [attempted, t]
  );

  const totalChars = useMemo(
    () => lines.reduce((sum, l) => sum + l.text.length, 0),
    [lines]
  );

  const [typed, setTyped] = useState(0);

  useEffect(() => {
    // Hərəkəti azaltmaq istəyənlərə mətn ilk addımda tam göstərilir.
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const step = reduce ? totalChars : CHARS_PER_TICK;

    const id = setInterval(
      () => {
        setTyped((n) => {
          if (n >= totalChars) {
            clearInterval(id);
            return n;
          }
          return n + step;
        });
      },
      reduce ? 0 : TYPE_SPEED_MS
    );

    return () => clearInterval(id);
  }, [totalChars]);

  const done = typed >= totalChars;

  return (
    <div className="relative flex min-h-[80vh] items-center justify-center overflow-hidden px-4 py-20">
      {/* Fon işıqları */}
      <div className="pointer-events-none absolute -top-20 left-1/4 h-96 w-96 rounded-full bg-violet-600/20 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-20 right-1/4 h-80 w-80 rounded-full bg-blue-600/15 blur-3xl" />

      <div className="relative mx-auto w-full max-w-2xl text-center">
        <h1 className="text-7xl font-bold tracking-tight sm:text-8xl">
          <span className="gradient-text">{t("notFound.title")}</span>
        </h1>

        <h2 className="mt-4 text-2xl font-bold sm:text-3xl">
          {t("notFound.message")}
        </h2>

        {/* Terminal pəncərəsi */}
        <div className="mt-8 overflow-hidden rounded-xl border border-[var(--card-border)] bg-[#0b0f19] text-left shadow-2xl">
          {/* Pəncərə başlığı */}
          <div className="flex items-center gap-2 border-b border-white/10 px-4 py-2.5">
            <span className="h-3 w-3 rounded-full bg-[#ff5f57]" />
            <span className="h-3 w-3 rounded-full bg-[#febc2e]" />
            <span className="h-3 w-3 rounded-full bg-[#28c840]" />
            <span className="ml-2 flex items-center gap-1.5 text-xs text-neutral-400">
              <Terminal size={12} />
              guest@helloworld
            </span>
          </div>

          {/* Çıxış */}
          <div className="min-h-[188px] px-4 py-4 font-mono text-[13px] leading-relaxed sm:text-sm">
            {lines.map((line, i) => {
              // Bu sətirdən əvvəlki simvolların sayı
              const before = lines
                .slice(0, i)
                .reduce((sum, l) => sum + l.text.length, 0);
              const shown = Math.max(0, Math.min(line.text.length, typed - before));
              if (shown === 0) return null;

              const isLast = i === lines.length - 1;
              const active = shown < line.text.length;

              return (
                <div key={i} className="whitespace-pre-wrap break-all">
                  {line.command && (
                    <span className="text-[#00f2fe]">guest@helloworld:~$ </span>
                  )}
                  <span
                    className={
                      line.tone === "error"
                        ? "text-red-400"
                        : line.tone === "ok"
                          ? "text-emerald-400"
                          : line.tone === "muted"
                            ? "text-neutral-400"
                            : "text-neutral-100"
                    }
                  >
                    {line.text.slice(0, shown)}
                  </span>
                  {(active || (isLast && done)) && (
                    <span className="terminal-caret" aria-hidden="true" />
                  )}
                </div>
              );
            })}
          </div>
        </div>

        <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
          <Link
            href="/"
            className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-violet-600 to-blue-600 px-8 py-3.5 text-base font-semibold text-white transition-all hover:shadow-lg hover:shadow-violet-500/25 sm:w-auto"
          >
            <Home size={18} />
            {t("notFound.button")}
          </Link>
          <Link
            href="/kurslar"
            className="inline-flex w-full items-center justify-center gap-2 rounded-lg border border-[var(--card-border)] px-8 py-3.5 text-base font-semibold text-[var(--foreground)] transition-colors hover:bg-[var(--section)] sm:w-auto"
          >
            <Compass size={18} />
            {t("popular.viewAll")}
          </Link>
        </div>
      </div>
    </div>
  );
}
