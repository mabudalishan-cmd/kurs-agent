"use client";

import { useState } from "react";
import Link from "next/link";
import { Mail, Loader2, CheckCircle2, Send } from "lucide-react";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import type { TranslationKey } from "@/lib/i18n/translations";

const footerLinks: { href: string; labelKey: TranslationKey }[] = [
  { href: "/", labelKey: "nav.home" },
  { href: "/kurslar", labelKey: "nav.courses" },
  { href: "/haqqimizda", labelKey: "nav.about" },
  { href: "/bloq", labelKey: "nav.blog" },
  { href: "/elaqe", labelKey: "nav.contact" },
];

export default function Footer() {
  const { t } = useLanguage();
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">(
    "idle"
  );
  const [message, setMessage] = useState("");

  async function handleSubscribe(e: React.FormEvent) {
    e.preventDefault();
    setStatus("loading");
    setMessage("");

    if (!email.trim()) {
      setStatus("error");
      setMessage(t("footer.emailRequired"));
      return;
    }

    try {
      const res = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim() }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => null);
        setStatus("error");
        setMessage(
          data?.code === "already_subscribed"
            ? t("footer.alreadySubscribed")
            : t("footer.subscribeError")
        );
        return;
      }

      setStatus("success");
      setMessage(t("footer.subscribeSuccess"));
      setEmail("");
    } catch {
      setStatus("error");
      setMessage(t("footer.subscribeError"));
    }
  }

  return (
    <footer className="border-t border-[var(--card-border)] bg-[var(--section)]">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 items-start gap-8 md:grid-cols-4">
          <div>
            <h3 className="gradient-text text-lg font-bold">HelloWorld</h3>
            <p className="mt-3 max-w-xs text-sm text-[var(--muted)]">
              {t("footer.tagline")}
            </p>
          </div>

          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider text-[var(--foreground)]">
              {t("footer.navigation")}
            </h4>
            <ul className="mt-4 space-y-2">
              {footerLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-[var(--muted)] transition-colors hover:text-[var(--accent)]"
                  >
                    {t(link.labelKey)}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider text-[var(--foreground)]">
              {t("footer.contact")}
            </h4>
            <ul className="mt-4 space-y-2 text-sm text-[var(--muted)]">
              <li>{t("footer.location")}</li>
              <li>
                <a
                  href="mailto:info@helloworld.az"
                  className="transition-colors hover:text-[var(--accent)]"
                >
                  info@helloworld.az
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

          {/* Email toplama formu */}
          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider text-[var(--foreground)]">
              {t("footer.subscribe")}
            </h4>
            <p className="mt-4 text-sm text-[var(--muted)]">
              {t("footer.subscribeDesc")}
            </p>
            {status === "success" ? (
              <div className="mt-3 flex items-center gap-2 rounded-lg border border-violet-500/30 bg-violet-500/10 px-3 py-2 text-sm text-[var(--accent)]">
                <CheckCircle2 size={16} />
                {message}
              </div>
            ) : (
              <form onSubmit={handleSubscribe} className="mt-3 flex gap-2">
                <div className="relative flex-1">
                  <Mail
                    size={14}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--muted)]"
                  />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder={t("footer.emailPlaceholder")}
                    required
                    className="w-full rounded-lg border border-[var(--card-border)] bg-[var(--background)] py-2 pl-9 pr-3 text-sm text-[var(--foreground)] placeholder-[var(--muted)] outline-none transition-colors focus:border-violet-500/50"
                  />
                </div>
                <button
                  type="submit"
                  disabled={status === "loading"}
                  className="inline-flex shrink-0 items-center justify-center rounded-lg bg-gradient-to-r from-violet-600 to-blue-600 px-3 py-2 text-sm font-semibold text-white transition-all hover:shadow-lg hover:shadow-violet-500/25 disabled:opacity-60"
                >
                  {status === "loading" ? (
                    <Loader2 size={16} className="animate-spin" />
                  ) : (
                    <Send size={16} />
                  )}
                </button>
              </form>
            )}
            {status === "error" && (
              <p className="mt-2 text-xs text-red-500">{message}</p>
            )}
          </div>
        </div>

        <div className="mt-10 border-t border-[var(--card-border)] pt-6 text-center text-sm text-[var(--muted)]">
          <p>{t("footer.copyright")}</p>
        </div>
      </div>
    </footer>
  );
}