"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus } from "lucide-react";

import { cn } from "@/lib/utils";

export type FaqEntry = {
  question: string;
  answer: string;
  /** İstəyə bağlı kateqoriya nişanı (məs. "Ödəniş"). */
  meta?: string | null;
};

export type FaqMonochromeProps = {
  items: FaqEntry[];
  /** Yuxarıdaki dekorativ pill-in mətni. */
  eyebrow?: string;
  title: string;
  /** Başlığın gradient ilə vurğulanan hissəsi. */
  titleAccent?: string;
  subtitle?: string;
  /** Başlanğıcda açıq olan sual (-1 = hamısı bağlı). */
  defaultOpenIndex?: number;
  className?: string;
};

/** Kursorun mövqeyini CSS dəyişəni kimi saxlayır — işıq effekti üçün. */
type GlowStyle = React.CSSProperties & {
  "--faq-x"?: string;
  "--faq-y"?: string;
};

export function FaqMonochrome({
  items,
  eyebrow,
  title,
  titleAccent,
  subtitle,
  defaultOpenIndex = 0,
  className,
}: FaqMonochromeProps) {
  const [activeIndex, setActiveIndex] = React.useState(defaultOpenIndex);

  const toggle = (index: number) =>
    setActiveIndex((prev) => (prev === index ? -1 : index));

  const trackGlow = (event: React.MouseEvent<HTMLLIElement>) => {
    const target = event.currentTarget;
    const rect = target.getBoundingClientRect();
    target.style.setProperty("--faq-x", `${event.clientX - rect.left}px`);
    target.style.setProperty("--faq-y", `${event.clientY - rect.top}px`);
  };

  const clearGlow = (event: React.MouseEvent<HTMLLIElement>) => {
    const target = event.currentTarget;
    target.style.removeProperty("--faq-x");
    target.style.removeProperty("--faq-y");
  };

  return (
    <motion.section
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.15 }}
      transition={{ duration: 0.6, ease: [0.22, 0.68, 0, 1] }}
      className={cn(
        "mx-auto flex max-w-3xl flex-col gap-8 px-4 py-16 sm:px-6 lg:px-8",
        className
      )}
    >
      {eyebrow ? (
        <div className="faq-pill">
          <span className="faq-pill__beam" aria-hidden="true" />
          <span className="faq-pill__pulse" aria-hidden="true" />
          <span className="faq-pill__label">{eyebrow}</span>
          <span className="faq-pill__meter" aria-hidden="true" />
          <span className="faq-pill__tick" aria-hidden="true" />
        </div>
      ) : null}

      <header className="space-y-3 text-center">
        <h2 className="text-2xl font-bold leading-tight sm:text-3xl md:text-4xl">
          {title}
          {titleAccent ? (
            <>
              {" "}
              <span className="gradient-text">{titleAccent}</span>
            </>
          ) : null}
        </h2>
        {subtitle ? (
          <p className="mx-auto max-w-xl text-sm text-[var(--muted)]">
            {subtitle}
          </p>
        ) : null}
      </header>

      <ul className="space-y-3">
        {items.map((item, index) => {
          const open = activeIndex === index;
          const panelId = `faq-panel-${index}`;
          const triggerId = `faq-trigger-${index}`;

          return (
            <li
              key={item.question}
              onMouseMove={trackGlow}
              onMouseLeave={clearGlow}
              className="liquid-glass group relative overflow-hidden rounded-2xl transition-all duration-500 hover:-translate-y-0.5 focus-within:-translate-y-0.5"
            >
              {/* Kursoru izləyən işıq */}
              <div
                aria-hidden="true"
                className={cn(
                  "pointer-events-none absolute inset-0 transition-opacity duration-500",
                  open ? "opacity-100" : "opacity-0 group-hover:opacity-100"
                )}
                style={
                  {
                    background:
                      "radial-gradient(240px circle at var(--faq-x, 50%) var(--faq-y, 50%), var(--faq-glow), transparent 70%)",
                  } as GlowStyle
                }
              />

              <h3>
                <button
                  type="button"
                  id={triggerId}
                  aria-controls={panelId}
                  aria-expanded={open}
                  onClick={() => toggle(index)}
                  className="relative flex w-full items-start gap-3 px-4 py-3.5 text-left transition-colors duration-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--faq-outline)] sm:gap-4 sm:px-5 sm:py-4"
                >
                  <span className="relative flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-[var(--card-border)] bg-[var(--section)] transition-transform duration-500 group-hover:scale-105">
                    <span
                      aria-hidden="true"
                      className={cn(
                        "pointer-events-none absolute inset-0 rounded-full border border-[var(--card-border)] opacity-30",
                        open && "animate-ping"
                      )}
                    />
                    <Plus
                      size={15}
                      strokeWidth={1.75}
                      className={cn(
                        "relative text-[var(--foreground)] transition-transform duration-500",
                        open && "rotate-45"
                      )}
                    />
                  </span>

                  <span className="flex flex-1 flex-col gap-2">
                    <span className="flex flex-col gap-1.5 sm:flex-row sm:items-center sm:gap-3">
                      <span
                        className={cn(
                          "text-sm font-medium leading-snug transition-colors sm:text-base",
                          open
                            ? "text-[var(--accent)]"
                            : "text-[var(--foreground)] group-hover:text-[var(--accent)]"
                        )}
                      >
                        {item.question}
                      </span>
                      {item.meta ? (
                        <span className="inline-flex w-fit items-center rounded-full border border-[var(--card-border)] px-2 py-0.5 text-[10px] uppercase tracking-[0.2em] text-[var(--muted)] sm:ml-auto">
                          {item.meta}
                        </span>
                      ) : null}
                    </span>
                  </span>
                </button>
              </h3>

              <AnimatePresence initial={false}>
                {open ? (
                  <motion.div
                    key="panel"
                    id={panelId}
                    role="region"
                    aria-labelledby={triggerId}
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                    className="relative overflow-hidden"
                  >
                    {/* Sol boşluq sualın mətni ilə hizalanır:
                        mobil = px-4 (1rem) + ikon w-8 (2rem) + gap-3 (0.75rem) = 3.75rem
                        sm    = px-5 (1.25rem) + ikon (2rem) + gap-4 (1rem)     = 4.25rem */}
                    <p className="pb-3.5 pl-[3.75rem] pr-4 text-sm leading-relaxed text-[var(--muted)] sm:pb-4 sm:pl-[4.25rem] sm:pr-5">
                      {item.answer}
                    </p>
                  </motion.div>
                ) : null}
              </AnimatePresence>
            </li>
          );
        })}
      </ul>
    </motion.section>
  );
}

export default FaqMonochrome;
